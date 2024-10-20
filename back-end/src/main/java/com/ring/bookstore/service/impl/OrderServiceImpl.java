package com.ring.bookstore.service.impl;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.ring.bookstore.dtos.CouponDiscountDTO;
import com.ring.bookstore.dtos.orders.CalculateDTO;
import com.ring.bookstore.dtos.ChartDTO;
import com.ring.bookstore.dtos.mappers.CalculateMapper;
import com.ring.bookstore.dtos.mappers.ChartDataMapper;
import com.ring.bookstore.model.*;
import com.ring.bookstore.repository.*;
import com.ring.bookstore.request.*;
import com.ring.bookstore.service.CouponService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.ring.bookstore.dtos.orders.OrderDTO;
import com.ring.bookstore.dtos.mappers.OrderMapper;
import com.ring.bookstore.enums.RoleName;
import com.ring.bookstore.exception.HttpResponseException;
import com.ring.bookstore.exception.ResourceNotFoundException;
import com.ring.bookstore.service.EmailService;
import com.ring.bookstore.service.OrderService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class OrderServiceImpl implements OrderService {

    private final OrderReceiptRepository orderRepo;
    private final BookRepository bookRepo;
    private final ShopRepository shopRepo;
    private final CouponRepository couponRepo;

    private final CouponService couponService;
    private final EmailService emailService;

    private final OrderMapper orderMapper;
    private final CalculateMapper calculateMapper;
    private final ChartDataMapper chartMapper;

    //Calculate
    public CalculateDTO calculate(CalculateRequest request) {
        //Info validation
        List<CartDetailRequest> cart = request.getCart();
        if (cart != null && cart.isEmpty())
            throw new HttpResponseException(HttpStatus.BAD_REQUEST, "Cart cannot be empty!");

        //Create receipt
        var orderReceipt = OrderReceipt.builder().details(new ArrayList<>()).build();

        //Calculate
        double totalPrice = 0.0; //Total price (exclude discount)
        double totalShippingFee = 0.0;
        double totalDiscount = 0.0;

        //For result
        double totalDealDiscount = 0.0; //From deal (% discount in Book)
        double totalCouponDiscount = 0.0; //From coupon
        double totalShippingDiscount = 0.0;
        int totalQuantity = 0;

        //Create order details
        for (CartDetailRequest detail : cart) {
            //Validation
            Shop shop = shopRepo.findById(detail.getShopId()).orElse(null);
            List<CartItemRequest> items = detail.getItems();

            if (shop == null || (items != null && items.isEmpty())) {
                //Create temp detail
                var orderDetail = OrderDetail.builder()
                        .shop(Shop.builder().id(detail.getShopId()).build())
                        .totalPrice(0.0)
                        .shippingFee(0.0)
                        .discount(0.0)
                        .shippingDiscount(0.0)
                        .coupon(Coupon.builder().code(detail.getCoupon()).build())
                        .items(new ArrayList<>()).build();

                //Add to receipt
                orderReceipt.addOrderDetail(orderDetail);
            } else {
                //Calculate
                double shippingFee = 10000.0; //Will change later
                double detailTotal = 0.0; //Total price of Books in detail (exclude discount)
                double discountDeal = 0.0; //Total discount from deal (% discount in Book)
                double discountCoupon = 0.0; //Total discount from coupon
                double discountValue = 0.0; //Total discount of detail (exclude shipping discount)
                double discountShipping = 0.0; //Shipping discount of detail
                int detailQuantity = 0; //Total amount of Books in detail

                //Create detail
                var orderDetail = OrderDetail.builder()
                        .shop(shop)
                        .items(new ArrayList<>()).build();

                //Loop items
                for (CartItemRequest item : items) {
                    //Validation
                    Book book = bookRepo.findById(item.getId()).orElse(null);

                    if (book == null || !book.getShopId().equals(shop.getId())) {
                        //Create temp item
                        var orderItem = OrderItem.builder()
                                .book(Book.builder().id(item.getId()).build())
                                .build();

                        orderDetail.addOrderItem(orderItem);
                    } else {
                        short quantity = item.getQuantity();
                        if (!(quantity < 1 && quantity > book.getAmount())) {
                            //Calculate + info
                            double deal = book.getPrice() * book.getDiscount().doubleValue();
                            detailQuantity += quantity;
                            detailTotal += book.getPrice() * quantity; //Not include the deal discount
                            discountDeal += deal * quantity;
                        }

                        //Add item
                        var orderItem = OrderItem.builder()
                                .book(book)
                                .quantity(quantity)
                                .build();

                        orderDetail.addOrderItem(orderItem);
                    }
                }

                //Coupon
                Coupon shopCoupon = couponRepo.findByCode(detail.getCoupon())
                        .orElse(couponRepo.recommendCoupon(shop.getId(),
                            detailTotal - discountDeal, detailQuantity).orElse(null));
                if (shopCoupon != null
                        && shopCoupon.getShopId().equals(shop.getId())
                            && !couponService.isExpired(shopCoupon)) {
                    //Apply coupon (must use price with deal discount)
                    CouponDiscountDTO discountFromCoupon = couponService.applyCoupon(shopCoupon,
                        new CartStateRequest(detailTotal - discountDeal, shippingFee, detailQuantity));

                    if (discountFromCoupon != null) {
                        discountCoupon = discountFromCoupon.discountValue();
                        discountShipping = discountFromCoupon.discountShipping();
                    }
                }

                //Add discount deal & discount coupon
                discountValue += (discountDeal + discountCoupon);

                //Add to receipt total
                totalPrice += detailTotal;
                totalQuantity += detailQuantity;
                totalShippingFee += shippingFee;
                totalCouponDiscount += discountCoupon;
                totalDealDiscount += discountDeal;

                //Set more detail
                orderDetail.setTotalPrice(detailTotal);
                orderDetail.setDiscount(discountValue);
                orderDetail.setShippingFee(shippingFee);
                orderDetail.setShippingDiscount(discountShipping);
                orderDetail.setCoupon(shopCoupon);
                orderDetail.setTotalPrice(detailTotal);
                orderDetail.setShippingFee(shippingFee);

                //Result mapping
                orderDetail.setCouponDiscount(discountCoupon);

                //Add to receipt
                orderReceipt.addOrderDetail(orderDetail);
            }
        }

        //Main coupon
        Coupon coupon = couponRepo.findByCode(request.getCoupon())
            .orElse(couponRepo.recommendCoupon(null, totalPrice - totalDealDiscount, totalQuantity)
                .orElse(null));

        if (coupon != null && coupon.getShop() == null && !couponService.isExpired(coupon)) {
            double discountValue = 0.0;
            double shippingDiscount = 0.0;

            //Apply coupon (must use price with deal discount)
            CouponDiscountDTO discountAll = couponService.applyCoupon(coupon,
                    new CartStateRequest((totalPrice - totalDealDiscount), totalShippingFee, totalQuantity));

            if (discountAll != null) {
                discountValue = discountAll.discountValue();
                shippingDiscount = discountAll.discountShipping();
            }

            //Split discount for each detail
            int totalDetail = orderReceipt.getDetails().size();
            double applyDiscount = discountValue / totalDetail;
            double applyShippingDiscount = shippingDiscount / totalDetail;

            for (OrderDetail detail : orderReceipt.getDetails()) {
                detail.setDiscount((detail.getDiscount() == null ? 0
                        : detail.getDiscount()) + applyDiscount);
                detail.setShippingDiscount((detail.getShippingDiscount() == null ? 0
                        : detail.getShippingDiscount()) + applyShippingDiscount);
            }

            //Add to total
            totalCouponDiscount += discountValue;
            totalShippingDiscount += shippingDiscount;
        }

        //Free
        if (totalCouponDiscount >= totalPrice) totalCouponDiscount = totalPrice;
        if (totalShippingDiscount >= totalShippingFee) totalShippingDiscount = totalShippingFee;

        //Total discount
        totalDiscount = totalCouponDiscount + totalDealDiscount + totalShippingDiscount;

        //Set value for receipt & return
        orderReceipt.setCoupon(coupon);
        orderReceipt.setTotal(totalPrice + totalShippingFee);
        orderReceipt.setTotalDiscount(totalDiscount);

        //For mapping result
        orderReceipt.setProductsPrice(totalPrice);
        orderReceipt.setShippingFee(totalShippingFee);
        orderReceipt.setDealDiscount(totalDealDiscount);
        orderReceipt.setCouponDiscount(totalCouponDiscount);
        orderReceipt.setShippingDiscount(totalShippingDiscount);

        return calculateMapper.orderToCalculate(orderReceipt);
    }

    //Commit order
    @Transactional
    public OrderReceipt checkout(OrderRequest request, Account user) {

        //Info validation
        String cartContent = ""; //For email
        double total = 0.0; //Total price

        //Get cart from request
        if (request.getCart() != null && request.getCart().isEmpty())
            throw new HttpResponseException(HttpStatus.BAD_REQUEST, "Cart cannot be empty!");

        //Create new receipt
        var orderReceipt = OrderReceipt.builder()
                .fullName(request.getName())
                .email(user.getEmail())
                .phone(request.getPhone())
                .orderAddress(request.getAddress())
                .orderMessage(request.getMessage())
                .user(user)
                .build();

        OrderReceipt savedOrder = orderRepo.save(orderReceipt); //Save receipt to database

        //Create order details
        for (CartItemRequest item : request.getCart()) {
            //Book validation
            Book book = bookRepo.findById(item.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found!"));
            if (book.getAmount() < item.getQuantity()) throw new ResourceNotFoundException("Product is out of stock!");

            //Calculate
            double shippingFee = 10000.0;
            double productPrice = book.getPrice() * (BigDecimal.valueOf(1).subtract(book.getDiscount())).doubleValue();
            double totalPrice = (item.getQuantity() * productPrice) + shippingFee;
            total += totalPrice; //Add to total price

            //Add to email content
            cartContent +=
                    "<div style=\"display: flex; padding: 5px 15px; border: 0.5px solid lightgray;\">\r\n"
                            + "	   <div style=\"margin-left: 15px;\">\r\n"
                            + "      <h3>" + book.getTitle() + "</h3>\r\n"
                            + "      <p style=\"font-size: 14px;\">x" + item.getQuantity() + "</p>\r\n"
                            + "      <p style=\"font-size: 16px; color: green;\"><b style=\"color: black;\">Thành tiền: </b>" + totalPrice + "đ</p>\r\n"
                            + "    </div>\r\n"
                            + "</div><br><br>";

//			//Create details
//			var orderDetail = OrderDetail.builder()
//					.amount(item.getQuantity())
//					.price(productPrice)
//					.book(book)
//					.order(savedOrder)
//					.status(OrderStatus.PENDING)
//					.build();

            //Decrease product amount
            book.setAmount((short) (book.getAmount() - item.getQuantity()));

            bookRepo.save(book); //Save after decrement
//			detailRepo.save(orderDetail); //Save details to database
        }

        savedOrder.setTotal(total);

        //Create and send email
        String subject = "RING! - BOOKSTORE: Đặt hàng thành công! ";
        String content = "<h1><b style=\"color: #63e399;\">RING!</b> - BOOKSTORE</h1>\n"
                + "<h2 style=\"background-color: #63e399; padding: 10px; color: white;\" >\r\n"
                + "Đơn hàng của bạn đã được xác nhận!\r\n"
                + "</h2>\n"
                + "<h3>Chi tiết đơn hàng:</h3>\n"
                + "<p><b>Tên người nhận: </b>" + request.getName() + "</p>\n"
                + "<p><b>SĐT người nhận: </b>" + request.getPhone() + "</p>\n"
                + "<p><b>Địa chỉ: </b>" + request.getAddress() + "</p>\n"
                + "<br><p>Lời nhắn cho shipper: <b>" + request.getMessage() + "</b></p>\n"
                + "<br><br><h3>Chi tiết sản phẩm:</h3>\n"
                + cartContent
                + "<br><br><h3>Tổng đơn giá: <b style=\"color: red\">" + total + "đ</b></h3>";
        emailService.sendHtmlMessage(user.getEmail(), subject, content); //Send

        return orderRepo.save(savedOrder); //Save to database
    }

    //Get all orders
    @Override
    public Page<OrderDTO> getAllOrders(Account user, Integer pageNo, Integer pageSize, String sortBy, String sortDir) {
        Pageable pageable = PageRequest.of(pageNo, pageSize, sortDir.equals("asc") ? Sort.by(sortBy).ascending() //Pagination
                : Sort.by(sortBy).descending());

        Page<OrderReceipt> ordersList = null;

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals(RoleName.ROLE_ADMIN.toString()))) {
            ordersList = orderRepo.findAll(pageable); //Get all if ADMIN
        } else {
            ordersList = orderRepo.findAllBySellerId(user.getId(), pageable); //If SELLER, only get their
        }

        Page<OrderDTO> ordersDTO = ordersList.map(orderMapper::orderToOrderDTO);
        return ordersDTO;
    }

    //Get order with book's {id}
    @Override
    public Page<OrderDTO> getOrdersByBookId(Long id, Integer pageNo, Integer pageSize, String sortBy, String sortDir) {
        Pageable pageable = PageRequest.of(pageNo, pageSize, sortDir.equals("asc") ? Sort.by(sortBy).ascending() //Pagination
                : Sort.by(sortBy).descending());

        Page<OrderReceipt> ordersList = orderRepo.findAllByBookId(id, pageable); //Fetch from database
        Page<OrderDTO> ordersDTO = ordersList.map(orderMapper::orderToOrderDTO);
        return ordersDTO;
    }

    //Get current user's orders
    @Override
    public Page<OrderDTO> getOrdersByUser(Account user, Integer pageNo, Integer pageSize) {
        Pageable pageable = PageRequest.of(pageNo, pageSize); //Pagination
        Page<OrderReceipt> ordersList = orderRepo.findAllByUserId(user.getId(), pageable); //Fetch from database
        Page<OrderDTO> ordersDTO = ordersList.map(orderMapper::orderToOrderDTO);
        return ordersDTO;
    }

    //Get order by {id}
    @Override
    public OrderDTO getOrderById(Long id) {
        OrderReceipt order = orderRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Order not found!"));
        OrderDTO orderDTO = orderMapper.orderToOrderDTO(order); //Map to DTO
        return orderDTO;
    }

    //Get monthly sales
    @Override
    public List<ChartDTO> getMonthlySale(Account user) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        List<Map<String, Object>> result;

        if (auth != null && auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals(RoleName.ROLE_ADMIN.toString()))) {
            result = orderRepo.getMonthlySale(); //Get all if ADMIN
        } else {
            result = orderRepo.getMonthlySaleBySeller(user.getId()); //If seller only get their
        }
        return result.stream().map(chartMapper::apply).collect(Collectors.toList()); //Return chart data
    }
}
