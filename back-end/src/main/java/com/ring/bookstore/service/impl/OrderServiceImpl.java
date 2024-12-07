package com.ring.bookstore.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import com.ring.bookstore.dtos.coupons.CouponDiscountDTO;
import com.ring.bookstore.dtos.mappers.CouponMapper;
import com.ring.bookstore.dtos.orders.*;
import com.ring.bookstore.dtos.ChartDTO;
import com.ring.bookstore.dtos.mappers.CalculateMapper;
import com.ring.bookstore.dtos.mappers.ChartDataMapper;
import com.ring.bookstore.enums.OrderStatus;
import com.ring.bookstore.enums.ShippingType;
import com.ring.bookstore.model.*;
import com.ring.bookstore.repository.*;
import com.ring.bookstore.request.*;
import com.ring.bookstore.service.CaptchaService;
import com.ring.bookstore.service.CouponService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

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
    private final OrderDetailRepository detailRepo;
    private final OrderItemRepository itemRepo;
    private final BookRepository bookRepo;
    private final ShopRepository shopRepo;
    private final CouponRepository couponRepo;
    private final AddressRepository addressRepo;

    private final CouponService couponService;
    private final EmailService emailService;
    private final CaptchaService captchaService;

    private final OrderMapper orderMapper;
    private final CalculateMapper calculateMapper;
    private final ChartDataMapper chartMapper;

    //Calculate
    public CalculateDTO calculate(CalculateRequest request) {
        List<CartDetailRequest> cart = request.getCart();

        //Create receipt
        var orderReceipt = OrderReceipt.builder().details(new ArrayList<>()).build();

        //Calculate
        double totalPrice = 0.0; //Total price (exclude discount)
        double totalShippingFee = 0.0;
        double totalDiscount;

        //For result
        double totalDealDiscount = 0.0; //From deal (% discount in Book)
        double totalCouponDiscount = 0.0; //From coupon
        double totalShippingDiscount = 0.0;
        int totalQuantity = 0;

        //Prefetch Stuff
        List<Long> bookIds = new ArrayList<>();
        List<Long> shopIds = new ArrayList<>();
        List<String> couponCodes = new ArrayList<>();
        couponCodes.add(request.getCoupon());

        for (CartDetailRequest detail : cart) {
            shopIds.add(detail.getShopId());
            couponCodes.add(detail.getCoupon());

            for (CartItemRequest item : detail.getItems()) {
                bookIds.add(item.getId());
            }
        }
        Map<Long, Shop> shops = shopRepo.findShopsInIds(shopIds).stream()
                .collect(Collectors.toMap(Shop::getId, Function.identity()));
        Map<Long, Book> books = bookRepo.findBooksInIds(bookIds).stream()
                .collect(Collectors.toMap(Book::getId, Function.identity()));
        Map<String, Coupon> coupons = couponRepo.findCouponInCodes(couponCodes).stream()
                .collect(Collectors.toMap(Coupon::getCode, Function.identity()));

        //Create order details
        for (CartDetailRequest detail : cart) {
            //Validation
            Shop shop = shops.get(detail.getShopId());
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

                //Address stuff
                if (request.getAddress() != null) {
                    AddressRequest addressRequest = request.getAddress();
                    ShippingType type = request.getShippingType();
                    var origin = Address.builder()
                            .name(addressRequest.getName())
                            .companyName(addressRequest.getCompanyName())
                            .phone(addressRequest.getPhone())
                            .city(addressRequest.getCity())
                            .address(addressRequest.getAddress())
                            .type(addressRequest.getType())
                            .build();
                    Address destination = shop.getAddress();
                    shippingFee = distanceCalculation(origin, destination);

                    //Shipping type stuff
                    if (type != null) {
                        if (type.equals(ShippingType.ECONOMY)) shippingFee *= 0.2;
                        if (type.equals(ShippingType.EXPRESS)) shippingFee *= 1.5;
                    }
                }

                //Create detail
                var orderDetail = OrderDetail.builder()
                        .shop(shop)
                        .items(new ArrayList<>()).build();

                //Loop items
                for (CartItemRequest item : items) {
                    //Validation
                    Book book = books.get(item.getId());

                    if (book == null || !book.getShop().getId().equals(shop.getId())) {
                        //Create temp item
                        var orderItem = OrderItem.builder()
                                .book(Book.builder().id(item.getId()).build())
                                .build();

                        orderDetail.addOrderItem(orderItem);
                    } else {
                        short quantity = item.getQuantity();
                        if (!(quantity < 1 || quantity > book.getAmount())) {
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
                Coupon shopCoupon = detail.getCoupon() == null ? null //Not select any
                        : coupons.containsKey(detail.getCoupon()) ? coupons.get(detail.getCoupon())
                        : (couponRepo.recommendCoupon(shop.getId(), detailTotal - discountDeal, detailQuantity)
                        .orElse(null));
                if (shopCoupon != null
                        && shopCoupon.getShop().getId().equals(shop.getId())
                        && !couponService.isExpired(shopCoupon)) {
                    //Apply coupon (must use price with deal discount)
                    CouponDiscountDTO discountFromCoupon = couponService.applyCoupon(shopCoupon,
                            new CartStateRequest(
                                    detailTotal - discountDeal,
                                    shippingFee,
                                    detailQuantity
                            )
                    );

                    if (discountFromCoupon != null) {
                        shopCoupon.setIsUsable(true);
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
        Coupon coupon = request.getCoupon() == null ? null //Not select any
                : coupons.containsKey(request.getCoupon()) ? coupons.get(request.getCoupon())
                : (couponRepo.recommendCoupon(null, totalPrice - totalDealDiscount, totalQuantity)
                .orElse(null));

        if (coupon != null && coupon.getShop() == null && !couponService.isExpired(coupon)) {
            double discountValue = 0.0;
            double shippingDiscount = 0.0;

            //Apply coupon (must use price with deal discount)
            CouponDiscountDTO discountAll = couponService.applyCoupon(coupon,
                    new CartStateRequest(
                            totalPrice - totalDealDiscount,
                            totalShippingFee,
                            totalQuantity)
            );

            if (discountAll != null) {
                coupon.setIsUsable(true);
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
    public ReceiptDTO checkout(OrderRequest checkRequest, HttpServletRequest request, Account user) {
        //Recaptcha
        final String recaptchaToken = request.getHeader("response");
        final String source = request.getHeader("source");
        captchaService.validate(recaptchaToken, source, CaptchaServiceImpl.CHECKOUT_ACTION);

        List<CartDetailRequest> cart = checkRequest.getCart();
        String cartContent = ""; //Email content

        //Create address
        AddressRequest addressRequest = checkRequest.getAddress();
        var address = Address.builder()
                .name(addressRequest.getName())
                .companyName(addressRequest.getCompanyName())
                .phone(addressRequest.getPhone())
                .city(addressRequest.getCity())
                .address(addressRequest.getAddress())
                .type(addressRequest.getType())
                .build();
        Address savedAddress = addressRepo.save(address);

        //Create receipt
        var orderReceipt = OrderReceipt.builder()
                .email(user.getEmail())
                .address(savedAddress)
                .orderMessage(checkRequest.getMessage())
                .details(new ArrayList<>())
                .user(user)
                .shippingType(checkRequest.getShippingType())
                .paymentType(checkRequest.getPaymentMethod())
                .build();

        //Calculate
        double totalPrice = 0.0; //Total price (exclude discount)
        double totalShippingFee = 0.0;
        double totalDiscount;

        //For result
        double totalDealDiscount = 0.0; //From deal (% discount in Book)
        double totalCouponDiscount = 0.0; //From coupon
        double totalShippingDiscount = 0.0;
        int totalQuantity = 0;

        //Prefetch Stuff
        List<Long> bookIds = new ArrayList<>();
        List<Long> shopIds = new ArrayList<>();
        List<String> couponCodes = new ArrayList<>();
        couponCodes.add(checkRequest.getCoupon());

        for (CartDetailRequest detail : cart) {
            shopIds.add(detail.getShopId());
            couponCodes.add(detail.getCoupon());

            for (CartItemRequest item : detail.getItems()) {
                bookIds.add(item.getId());
            }
        }
        Map<Long, Shop> shops = shopRepo.findShopsInIds(shopIds).stream()
                .collect(Collectors.toMap(Shop::getId, Function.identity()));
        Map<Long, Book> books = bookRepo.findBooksInIds(bookIds).stream()
                .collect(Collectors.toMap(Book::getId, Function.identity()));
        Map<String, Coupon> coupons = couponRepo.findCouponInCodes(couponCodes).stream()
                .collect(Collectors.toMap(Coupon::getCode, Function.identity()));

        //Create order details
        for (CartDetailRequest detail : cart) {
            //Validation
            Shop shop = shops.get(detail.getShopId());
            List<CartItemRequest> items = detail.getItems();

            if (shop == null || (items != null && items.isEmpty())) {
                throw new ResourceNotFoundException("Shop not found!");
            } else {
                //Calculate
                double shippingFee;
                double detailTotal = 0.0; //Total price of Books in detail (exclude discount)
                double discountDeal = 0.0; //Total discount from deal (% discount in Book)
                double discountCoupon = 0.0; //Total discount from coupon
                double discountValue = 0.0; //Total discount of detail (exclude shipping discount)
                double discountShipping = 0.0; //Shipping discount of detail
                int detailQuantity = 0; //Total amount of Books in detail

                //Address stuff
                ShippingType type = checkRequest.getShippingType();
                Address destination = shop.getAddress();
                shippingFee = distanceCalculation(savedAddress, destination);

                //Shipping type stuff
                if (type != null) {
                    if (type.equals(ShippingType.ECONOMY)) shippingFee *= 0.2;
                    if (type.equals(ShippingType.EXPRESS)) shippingFee *= 1.5;
                }

                //Create detail
                var orderDetail = OrderDetail.builder()
                        .status(OrderStatus.PENDING)
                        .shop(shop)
                        .items(new ArrayList<>()).build();

                //Loop items
                for (CartItemRequest item : items) {
                    //Validation
                    Book book = books.get(item.getId());

                    if (book == null || !book.getShop().getId().equals(shop.getId())) {
                        throw new ResourceNotFoundException("Book not found!");
                    } else {
                        short quantity = item.getQuantity();

                        if (!(quantity < 1 || quantity > book.getAmount())) {
                            //Calculate + info
                            double deal = book.getPrice() * book.getDiscount().doubleValue();
                            detailQuantity += quantity;
                            detailTotal += book.getPrice() * quantity; //Not include the deal discount
                            discountDeal += deal * quantity;

                            //Decrease stock
                            bookRepo.decreaseStock(book.getId(), quantity);
                        } else {
                            throw new HttpResponseException(
                                    HttpStatus.CONFLICT,
                                    "Product out of stock!",
                                    "Sản phẩm " + book.getTitle() + " không đủ số lượng hàng yêu cầu!"
                            );
                        }

                        //Add item
                        var orderItem = OrderItem.builder()
                                .book(book)
                                .price(book.getPrice())
                                .discount(book.getDiscount())
                                .quantity(quantity)
                                .build();

                        orderDetail.addOrderItem(orderItem);

                        //Add to email content
                        cartContent +=
                                "<div style=\"display: flex; padding: 5px 15px; border: 0.5px solid lightgray;\">\r\n"
                                        + "	   <div style=\"margin-left: 15px;\">\r\n"
                                        + "      <h3>" + book.getTitle() + "</h3>\r\n"
                                        + "      <p style=\"font-size: 14px;\">x" + item.getQuantity() + "</p>\r\n"
                                        + "      <p style=\"font-size: 16px; color: green;\"><b style=\"color: black;\">Thành tiền: </b>" + "FIX" + "đ</p>\r\n"
                                        + "    </div>\r\n"
                                        + "</div><br><br>";
                    }
                }

                //Coupon
                Coupon shopCoupon = coupons.get(detail.getCoupon());
                if (shopCoupon == null) throw new ResourceNotFoundException("Coupon not found!");

                if (shopCoupon != null
                        && shopCoupon.getShop().getId().equals(shop.getId())
                        && !couponService.isExpired(shopCoupon)) {
                    //Apply coupon (must use price with deal discount)
                    CouponDiscountDTO discountFromCoupon = couponService.applyCoupon(shopCoupon,
                            new CartStateRequest(
                                    detailTotal - discountDeal,
                                    shippingFee,
                                    detailQuantity
                            )
                    );

                    if (discountFromCoupon != null) {
                        couponRepo.decreaseUsage(shopCoupon.getId()); //Decrease usage
                        discountCoupon = discountFromCoupon.discountValue();
                        discountShipping = discountFromCoupon.discountShipping();
                    } else {
                        throw new HttpResponseException(
                                HttpStatus.CONFLICT,
                                "Coupon expired!",
                                "Không thể sử dụng mã coupon " + detail.getCoupon() + "!"
                        );
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

                //Add to receipt
                orderReceipt.addOrderDetail(orderDetail);
            }
        }

        //Main coupon
        Coupon coupon = coupons.get(checkRequest.getCoupon());
        if (coupon == null) throw new ResourceNotFoundException("Coupon not found!");

        if (coupon != null && coupon.getShop() == null && !couponService.isExpired(coupon)) {
            double discountValue = 0.0;
            double shippingDiscount = 0.0;

            //Apply coupon (must use price - deal discount)
            CouponDiscountDTO discountAll = couponService.applyCoupon(coupon,
                    new CartStateRequest(
                            totalPrice - totalDealDiscount,
                            totalShippingFee,
                            totalQuantity
                    )
            );

            if (discountAll != null) {
                couponRepo.decreaseUsage(coupon.getId());
                discountValue = discountAll.discountValue();
                shippingDiscount = discountAll.discountShipping();
            } else {
                throw new HttpResponseException(
                        HttpStatus.CONFLICT,
                        "Coupon expired!",
                        "Không thể sử dụng mã coupon " + checkRequest.getCoupon() + "!"
                );
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

//        //Create and send email
//        String subject = "RING! - BOOKSTORE: Đặt hàng thành công! ";
//        String content = "<h1><b style=\"color: #63e399;\">RING!</b> - BOOKSTORE</h1>\n"
//                + "<h2 style=\"background-color: #63e399; padding: 10px; color: white;\" >\r\n"
//                + "Đơn hàng của bạn đã được xác nhận!\r\n"
//                + "</h2>\n"
//                + "<h3>Chi tiết đơn hàng:</h3>\n"
//                + "<p><b>Tên người nhận: </b>" + request.getName() + "</p>\n"
//                + "<p><b>SĐT người nhận: </b>" + request.getPhone() + "</p>\n"
//                + "<p><b>Địa chỉ: </b>" + request.getAddress() + "</p>\n"
//                + "<br><p>Lời nhắn cho shipper: <b>" + request.getMessage() + "</b></p>\n"
//                + "<br><br><h3>Chi tiết sản phẩm:</h3>\n"
//                + cartContent
//                + "<br><br><h3>Tổng đơn giá: <b style=\"color: red\">" + total + "đ</b></h3>";
//        emailService.sendHtmlMessage(user.getEmail(), subject, content); //Send

        OrderReceipt savedOrder = orderRepo.save(orderReceipt);
        return orderMapper.orderToOrderDTO(savedOrder);
    }

    //Get all orders
    @Override
    public Page<ReceiptDTO> getAllReceipts(Account user, Integer pageNo, Integer pageSize, String sortBy, String sortDir) {
        Pageable pageable = PageRequest.of(pageNo, pageSize, sortDir.equals("asc") ? Sort.by(sortBy).ascending() //Pagination
                : Sort.by(sortBy).descending());

        Page<OrderReceipt> ordersList = null;

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals(RoleName.ROLE_ADMIN.toString()))) {
            ordersList = orderRepo.findAll(pageable); //Get all if ADMIN
        } else {
            ordersList = orderRepo.findAllBySellerId(user.getId(), pageable); //If SELLER, only get their
        }

        Page<ReceiptDTO> ordersDTO = ordersList.map(orderMapper::orderToOrderDTO);
        return ordersDTO;
    }

    //Get order with book's {id} FIX
    @Override
    public Page<OrderDTO> getOrdersByBookId(Long id, Integer pageNo, Integer pageSize, String sortBy, String sortDir) {
        Pageable pageable = PageRequest.of(pageNo, pageSize, sortDir.equals("asc") ? Sort.by(sortBy).ascending() //Pagination
                : Sort.by(sortBy).descending());

        //Same as getOrdersByUser
        Page<Long> orderIds = detailRepo.findAllIdsByBookId(id, pageable);
        List<IOrderItem> itemsList = itemRepo.findAllWithDetailIds(orderIds.getContent());
        List<OrderDTO> ordersList = orderMapper.itemsToDetailDTO(itemsList);
        Page<OrderDTO> ordersDTO = new PageImpl<OrderDTO>(
                ordersList,
                pageable,
                orderIds.getTotalElements()
        );
        return ordersDTO;
    }

    //Get current user's orders
    @Transactional
    public Page<OrderDTO> getOrdersByUser(Account user, OrderStatus status, String keyword, Integer pageNo, Integer pageSize) {
        Pageable pageable = PageRequest.of(pageNo, pageSize); //Pagination

        //Get list ids with pagination (avoid applying in memory warning from Fetch Join)
        //Find items then map back to details list using Map (the other way around cost more memory if used projection)
        Page<Long> orderIds = detailRepo.findAllIdsByUserId(user.getId(), status, keyword, pageable); //Fetch from database
        List<IOrderItem> itemsList = itemRepo.findAllWithDetailIds(orderIds.getContent());
        List<OrderDTO> ordersList = orderMapper.itemsToDetailDTO(itemsList);
        Page<OrderDTO> ordersDTO = new PageImpl<OrderDTO>(
                ordersList,
                pageable,
                orderIds.getTotalElements()
        );
        return ordersDTO;
    }

    //Get order by {id}
    @Override
    public ReceiptDTO getReceipt(Long id) {
        OrderReceipt order = orderRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Order not found!"));
        ReceiptDTO receiptDTO = orderMapper.orderToOrderDTO(order); //Map to DTO
        return receiptDTO;
    }

    //Get detail order by {detail's id}
    @Override
    public OrderDetailDTO getOrderDetail(Long id) {
        OrderDetail orderDetail = detailRepo.findDetailById(id).orElseThrow(() -> new ResourceNotFoundException("Detail not found!"));
        OrderDetailDTO detailDTO = orderMapper.orderToDetailDTO(orderDetail); //Map to DTO
        return detailDTO;
    }

    //Get monthly sales FIX
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

    //Return fixed amount of shipping fee for now :<
    private double distanceCalculation(Address origin, Address destination) {
        return 10000.0;
    }
}
