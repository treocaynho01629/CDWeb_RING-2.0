package com.ring.bookstore.service.impl;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import com.ring.bookstore.dtos.coupons.CouponDiscountDTO;
import com.ring.bookstore.dtos.dashboard.StatDTO;
import com.ring.bookstore.dtos.mappers.DashboardMapper;
import com.ring.bookstore.dtos.orders.*;
import com.ring.bookstore.dtos.dashboard.ChartDTO;
import com.ring.bookstore.dtos.mappers.CalculateMapper;
import com.ring.bookstore.enums.OrderStatus;
import com.ring.bookstore.enums.ShippingType;
import com.ring.bookstore.listener.checkout.OnCheckoutCompletedEvent;
import com.ring.bookstore.model.*;
import com.ring.bookstore.repository.*;
import com.ring.bookstore.request.*;
import com.ring.bookstore.service.CaptchaService;
import com.ring.bookstore.service.CouponService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.ring.bookstore.dtos.mappers.OrderMapper;
import com.ring.bookstore.enums.RoleName;
import com.ring.bookstore.exception.HttpResponseException;
import com.ring.bookstore.exception.ResourceNotFoundException;
import com.ring.bookstore.service.OrderService;

import org.springframework.transaction.annotation.Transactional;
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
    private final CaptchaService captchaService;

    private final OrderMapper orderMapper;
    private final CalculateMapper calculateMapper;
    private final DashboardMapper dashMapper;

    private final ApplicationEventPublisher eventPublisher;

    //Calculate
    public CalculateDTO calculate(CalculateRequest request, Account user) {
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
                            ),
                            user
                    );

                    if (discountFromCoupon != null) {
                        shopCoupon.setIsUsable(true);
                        discountCoupon = discountFromCoupon.discountValue();
                        discountShipping = discountFromCoupon.discountShipping();
                    }
                }

                //Add discount deal & discount coupon
                discountValue += (discountDeal + discountCoupon);

                //Free
                if (discountValue >= detailTotal) discountValue = detailTotal;
                if (discountShipping >= shippingFee) discountShipping = shippingFee;

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
            double value = totalPrice - totalDealDiscount - totalCouponDiscount;
            double shipping = totalShippingFee - totalShippingDiscount;

            //Apply coupon (must use price with all discount)
            CouponDiscountDTO discountAll = couponService.applyCoupon(coupon,
                    new CartStateRequest(
                            value,
                            shipping,
                            totalQuantity),
                    user
            );

            if (discountAll != null) {
                coupon.setIsUsable(true);
                discountValue = discountAll.discountValue();
                shippingDiscount = discountAll.discountShipping();

                //Split discount for each detail
                double discountRatio = discountValue / value;
                double shippingDiscountRatio = shippingDiscount / shipping;

                for (OrderDetail detail : orderReceipt.getDetails()) {
                    double pDiscount = detail.getDiscount() != null ? detail.getDiscount() : 0;
                    double sDiscount = detail.getShippingDiscount() != null ? detail.getShippingDiscount() : 0;
                    double applyDiscount = (detail.getTotalPrice() - pDiscount) * discountRatio;
                    double applyShippingDiscount = (detail.getShippingFee() - sDiscount) * shippingDiscountRatio;

                    detail.setDiscount(pDiscount + applyDiscount);
                    detail.setShippingDiscount(sDiscount + applyShippingDiscount);
                }
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

        return calculateMapper.orderToDTO(orderReceipt);
    }

    //Commit order
    @Transactional
    public ReceiptDTO checkout(OrderRequest checkRequest, HttpServletRequest request, Account user) {
        //Recaptcha
        final String recaptchaToken = request.getHeader("response");
        final String source = request.getHeader("source");
        captchaService.validate(recaptchaToken, source, CaptchaServiceImpl.CHECKOUT_ACTION);

        List<CartDetailRequest> cart = checkRequest.getCart();

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
                    }
                }

                //Coupon
                Coupon shopCoupon = coupons.get(detail.getCoupon());
                if (detail.getCoupon() != null && shopCoupon == null)
                    throw new ResourceNotFoundException("Coupon not found!");

                if (shopCoupon != null
                        && shopCoupon.getShop().getId().equals(shop.getId())
                        && !couponService.isExpired(shopCoupon)) {
                    //Apply coupon (must use price with deal discount)
                    CouponDiscountDTO discountFromCoupon = couponService.applyCoupon(shopCoupon,
                            new CartStateRequest(
                                    detailTotal - discountDeal,
                                    shippingFee,
                                    detailQuantity
                            ),
                            user
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

                //Free
                if (discountValue >= detailTotal) discountValue = detailTotal;
                if (discountShipping >= shippingFee) discountShipping = shippingFee;

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
        if (checkRequest.getCoupon() != null && coupon == null)
            throw new ResourceNotFoundException("Coupon not found!");

        if (coupon != null && coupon.getShop() == null && !couponService.isExpired(coupon)) {
            double discountValue = 0.0;
            double shippingDiscount = 0.0;
            double value = totalPrice - totalDealDiscount - totalCouponDiscount;
            double shipping = totalShippingFee - totalShippingDiscount;

            //Apply coupon (must use price with all discount)
            CouponDiscountDTO discountAll = couponService.applyCoupon(coupon,
                    new CartStateRequest(
                            value,
                            shipping,
                            totalQuantity
                    ),
                    user
            );

            if (discountAll != null) {
                couponRepo.decreaseUsage(coupon.getId());
                discountValue = discountAll.discountValue();
                shippingDiscount = discountAll.discountShipping();

                //Split discount for each detail
                double discountRatio = discountValue / value;
                double shippingDiscountRatio = shippingDiscount / shipping;

                for (OrderDetail detail : orderReceipt.getDetails()) {
                    double pDiscount = detail.getDiscount() != null ? detail.getDiscount() : 0;
                    double sDiscount = detail.getShippingDiscount() != null ? detail.getShippingDiscount() : 0;
                    double applyDiscount = (detail.getTotalPrice() - pDiscount) * discountRatio;
                    double applyShippingDiscount = (detail.getShippingFee() - sDiscount) * shippingDiscountRatio;

                    detail.setDiscount(pDiscount + applyDiscount);
                    detail.setShippingDiscount(sDiscount + applyShippingDiscount);
                }
            } else {
                throw new HttpResponseException(
                        HttpStatus.CONFLICT,
                        "Coupon expired!",
                        "Không thể sử dụng mã coupon " + checkRequest.getCoupon() + "!"
                );
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

        OrderReceipt savedOrder = orderRepo.save(orderReceipt);
        ReceiptDTO receiptDTO = orderMapper.orderToDTO(savedOrder);

        //Trigger email event
        eventPublisher.publishEvent(new OnCheckoutCompletedEvent(
                user.getUsername(),
                user.getEmail(),
                totalPrice,
                totalShippingFee,
                receiptDTO));
        return receiptDTO;
    }

    @Transactional
    public void cancel(Long id, String reason, Account user) {
        OrderDetail detail = detailRepo.findDetailById(id).orElseThrow(() ->
                new ResourceNotFoundException("Order detail not found"));

        //Check if correct user
        if (!isUserValid(detail.getOrder(), user)) {
            throw new HttpResponseException(HttpStatus.FORBIDDEN, "Invalid user!");
        }

        //Check valid status for cancel
        OrderStatus currStatus = detail.getStatus();
        if (!(currStatus.equals(OrderStatus.SHIPPING) || currStatus.equals(OrderStatus.PENDING))) {
            throw new HttpResponseException(HttpStatus.BAD_REQUEST, "Invalid order status!");
        }

        detail.setStatus(OrderStatus.CANCELED);
        detailRepo.save(detail);
    }

    @Transactional
    public void refund(Long id, String reason, Account user) {
        OrderDetail detail = detailRepo.findDetailById(id).orElseThrow(() ->
                new ResourceNotFoundException("Order detail not found"));

        //Check if correct user
        if (!isUserValid(detail.getOrder(), user))
            throw new HttpResponseException(HttpStatus.FORBIDDEN, "Invalid user!");

        //Check valid status for cancel
        OrderStatus currStatus = detail.getStatus();
        if (!currStatus.equals(OrderStatus.COMPLETED))
            throw new HttpResponseException(HttpStatus.BAD_REQUEST, "Invalid order status!");

        if (detail.getOrder().getLastModifiedDate()
                .plus(1, ChronoUnit.WEEKS).isAfter(LocalDateTime.now()))
            throw new HttpResponseException(HttpStatus.BAD_REQUEST, "Invalid date!");

        detail.setStatus(OrderStatus.PENDING_REFUND);
        detailRepo.save(detail);
    }

    @Transactional
    public void confirm(Long id, Account user) {
        OrderDetail detail = detailRepo.findDetailById(id).orElseThrow(() ->
                new ResourceNotFoundException("Order detail not found"));

        //Check if correct user
        if (!isUserValid(detail.getOrder(), user))
            throw new HttpResponseException(HttpStatus.FORBIDDEN, "Invalid user!");

        //Check valid status for cancel
        OrderStatus currStatus = detail.getStatus();
        if (!(currStatus.equals(OrderStatus.SHIPPING)
                || currStatus.equals(OrderStatus.PENDING))) {
            throw new HttpResponseException(HttpStatus.BAD_REQUEST, "Invalid order status!");
        }

        detail.setStatus(OrderStatus.COMPLETED);
        detailRepo.save(detail);
    }

    @Transactional
    public void changeStatus(Long id, OrderStatus status, Account user) {
        OrderDetail detail = detailRepo.findDetailById(id).orElseThrow(() ->
                new ResourceNotFoundException("Order detail not found"));

        //Check if correct user
        if (!isOwnerValid(detail.getShop(), user))
            throw new HttpResponseException(HttpStatus.FORBIDDEN, "Invalid role!");

        detail.setStatus(status);
        detailRepo.save(detail);
    }

    //Get all orders
    @Transactional
    public Page<ReceiptDTO> getAllReceipts(Account user, Long shopId, OrderStatus status,
                                           String keyword, Integer pageNo, Integer pageSize, String sortBy, String sortDir) {
        Pageable pageable = PageRequest.of(pageNo, pageSize, sortDir.equals("asc") ?
                Sort.by(sortBy).ascending() :
                Sort.by(sortBy).descending());
        boolean isAdmin = isAuthAdmin();

        Page<Long> receiptIds = orderRepo.findAllIds(shopId, isAdmin ? null : user.getId(), status, keyword, pageable); //Fetch from database
        List<IOrderDetail> detailsList = detailRepo.findAllWithReceiptIds(receiptIds.getContent());
        List<ReceiptDTO> ordersList = orderMapper.detailsToReceiptDTO(detailsList);
        Page<ReceiptDTO> ordersDTOS = new PageImpl<ReceiptDTO>(
                ordersList,
                pageable,
                receiptIds.getTotalElements()
        );

        return ordersDTOS;
    }

    //Get all order summaries
    @Transactional
    public Page<ReceiptSummaryDTO> getSummariesWithFilter(Account user,
                                                          Long shopId,
                                                          Long bookId,
                                                          Integer pageNo,
                                                          Integer pageSize,
                                                          String sortBy,
                                                          String sortDir) {
        Pageable pageable = PageRequest.of(pageNo, pageSize, sortDir.equals("asc") ?
                Sort.by(sortBy).ascending() :
                Sort.by(sortBy).descending());
        boolean isAdmin = isAuthAdmin();

        Page<IReceiptSummary> summariesList = orderRepo.findAllSummaries(shopId, isAdmin ? null : user.getId(), bookId, pageable);
        if (summariesList == null) throw new HttpResponseException(HttpStatus.FORBIDDEN, "Invalid role!");

        Page<ReceiptSummaryDTO> summariesDTOS = summariesList.map(orderMapper::summaryToDTO);
        return summariesDTOS;
    }

    //Get order with book's {id}
    @Override
    public Page<OrderDTO> getOrdersByBookId(Long id,
                                            Integer pageNo,
                                            Integer pageSize,
                                            String sortBy,
                                            String sortDir) {
        Pageable pageable = PageRequest.of(pageNo, pageSize, sortDir.equals("asc") ?
                Sort.by(sortBy).ascending() :
                Sort.by(sortBy).descending());

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
    public Page<OrderDTO> getOrdersByUser(Account user,
                                          OrderStatus status,
                                          String keyword,
                                          Integer pageNo,
                                          Integer pageSize) {
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
        ReceiptDTO receiptDTO = orderMapper.orderToDTO(order); //Map to DTO
        return receiptDTO;
    }

    //Get detail order by {detail's id}
    @Transactional
    public OrderDetailDTO getOrderDetail(Long id, Account user) {
        List<IOrderDetailItem> itemsList = itemRepo.findOrderDetailItems(id, isAuthAdmin() ? null : user.getId());
        if (itemsList.isEmpty()) throw new ResourceNotFoundException("Detail not found!");
        OrderDetailDTO detailDTO = orderMapper.detailItemsToDTO(itemsList); //Map to DTO
        return detailDTO;
    }

    public StatDTO getAnalytics(Account user, Long shopId) {
        boolean isAdmin = isAuthAdmin();
        return dashMapper.statToDTO(orderRepo.getSalesAnalytics(shopId, isAdmin ? null : user.getId()),
                "sales",
                "Doanh thu tháng này");
    }

    //Get monthly sales
    public List<ChartDTO> getMonthlySales(Account user, Long shopId, Integer year) {
        boolean isAdmin = isAuthAdmin();
        List<Map<String, Object>> data = orderRepo.getMonthlySales(shopId, isAdmin ? null : user.getId(), year);
        return data.stream().map(dashMapper::dataToChartDTO).collect(Collectors.toList()); //Return chart data
    }

    //Return fixed amount of shipping fee for now :<
    private double distanceCalculation(Address origin, Address destination) {
        return 10000.0;
    }

    //Check valid role function
    protected boolean isAuthAdmin() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication(); //Get current auth
        return (auth != null && auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals(RoleName.ROLE_ADMIN.toString())));
    }

    //Check valid role function
    protected boolean isOwnerValid(Shop shop, Account user) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication(); //Get current auth
        boolean isAdmin = (auth != null && auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals(RoleName.ROLE_ADMIN.toString())));
        //Check if is admin or valid owner id
        return shop.getOwner().getId().equals(user.getId()) || isAdmin;
    }

    protected boolean isUserValid(OrderReceipt receipt, Account user) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication(); //Get current auth
        boolean isAdmin = (auth != null && auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals(RoleName.ROLE_ADMIN.toString())));
        //Check if is admin or valid owner id
        return receipt.getUser().getId().equals(user.getId()) || isAdmin;
    }
}
