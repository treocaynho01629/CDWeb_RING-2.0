package com.ring.bookstore.service.impl;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import com.ring.bookstore.dtos.coupons.CouponDiscountDTO;
import com.ring.bookstore.dtos.coupons.ICoupon;
import com.ring.bookstore.dtos.dashboard.StatDTO;
import com.ring.bookstore.dtos.mappers.CouponMapper;
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
    private final CouponMapper couponMapper;

    private final ApplicationEventPublisher eventPublisher;

    //Calculate
    public CalculateDTO calculate(CalculateRequest request,
                                  Account user) {
        //Create address
        AddressRequest addressRequest = request.getAddress();
        var address = addressRequest != null
                ? Address.builder()
                        .name(addressRequest.getName())
                        .companyName(addressRequest.getCompanyName())
                        .phone(addressRequest.getPhone())
                        .city(addressRequest.getCity())
                        .address(addressRequest.getAddress())
                        .type(addressRequest.getType())
                        .build()
                : null;

        OrderReceipt calculatedReceipt = processOrder(request.getCart(),
                request.getCoupon(),
                address,
                request.getShippingType(),
                user,
                false);

        return calculateMapper.orderToDTO(calculatedReceipt);
    }

    //Commit order
    @Transactional
    public ReceiptDTO checkout(OrderRequest checkRequest,
                               HttpServletRequest request,
                               Account user) {
        //Recaptcha
        final String recaptchaToken = request.getHeader("response");
        final String source = request.getHeader("source");
        captchaService.validate(recaptchaToken, source, CaptchaServiceImpl.CHECKOUT_ACTION);

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

        OrderReceipt orderReceipt = processOrder(checkRequest.getCart(),
                checkRequest.getCoupon(),
                savedAddress,
                checkRequest.getShippingType(),
                user,
                true);

        //Set relevant values
        orderReceipt.setUser(user);
        orderReceipt.setEmail(user.getEmail());
        orderReceipt.setAddress(savedAddress);
        orderReceipt.setOrderMessage(checkRequest.getMessage());
        orderReceipt.setShippingType(checkRequest.getShippingType());
        orderReceipt.setPaymentType(checkRequest.getPaymentMethod());

        //Save to database
        OrderReceipt savedOrder = orderRepo.save(orderReceipt);
        ReceiptDTO receiptDTO = orderMapper.orderToDTO(savedOrder);

        //Trigger email event
        eventPublisher.publishEvent(new OnCheckoutCompletedEvent(
                user.getUsername(),
                user.getEmail(),
                orderReceipt.getProductsPrice(),
                orderReceipt.getShippingFee(),
                receiptDTO));
        return receiptDTO;
    }

    @Transactional
    public void cancel(Long id,
                       String reason,
                       Account user) {
        OrderDetail detail = detailRepo.findDetailById(id).orElseThrow(() ->
                new ResourceNotFoundException("Order detail not found"));
        OrderReceipt order = detail.getOrder();

        //Check if correct user
        if (!isUserValid(order, user)) {
            throw new HttpResponseException(HttpStatus.FORBIDDEN, "Invalid user!");
        }

        //Check valid status for cancel
        OrderStatus currStatus = detail.getStatus();
        if (!(currStatus.equals(OrderStatus.SHIPPING) || currStatus.equals(OrderStatus.PENDING))) {
            throw new HttpResponseException(HttpStatus.BAD_REQUEST, "Invalid order status!");
        }

        detail.setStatus(OrderStatus.CANCELED);
        detailRepo.save(detail);

        //Subtract price & discount
        order.setTotal(order.getTotal() - detail.getTotalPrice() - detail.getShippingFee());
        order.setTotalDiscount(order.getTotalDiscount() - detail.getDiscount() - detail.getShippingDiscount());
        orderRepo.save(order);
    }

    @Transactional
    public void refund(Long id,
                       String reason,
                       Account user) {
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
    public void confirm(Long id,
                        Account user) {
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
    public void changeStatus(Long id,
                             OrderStatus status,
                             Account user) {
        OrderDetail detail = detailRepo.findDetailById(id).orElseThrow(() ->
                new ResourceNotFoundException("Order detail not found"));
        OrderReceipt order = detail.getOrder();

        //Check if correct user
        if (!isOwnerValid(detail.getShop(), user))
            throw new HttpResponseException(HttpStatus.FORBIDDEN, "Invalid role!");

        detail.setStatus(status);
        detailRepo.save(detail);

        //Subtract price & discount
        if (status.equals(OrderStatus.CANCELED) || status.equals(OrderStatus.REFUNDED)) {
            order.setTotal(order.getTotal() - detail.getTotalPrice() - detail.getShippingFee());
            order.setTotalDiscount(order.getTotalDiscount() - detail.getDiscount() - detail.getShippingDiscount());
            orderRepo.save(order);
        }
    }

    //Get all orders
    @Transactional
    public Page<ReceiptDTO> getAllReceipts(Account user,
                                           Long shopId,
                                           OrderStatus status,
                                           String keyword,
                                           Integer pageNo,
                                           Integer pageSize,
                                           String sortBy,
                                           String sortDir) {
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

    //Process cart order
    private OrderReceipt processOrder(List<CartDetailRequest> cart,
                                      String orderCoupon,
                                      Address address,
                                      ShippingType shippingType,
                                      Account user,
                                      boolean isCheckout) {
        //Create receipt
        var orderReceipt = OrderReceipt.builder()
                .details(new ArrayList<>())
                .build();

        //Get books, shops, coupons IDS for prefetch
        List<Long> bookIds = new ArrayList<>();
        List<Long> shopIds = new ArrayList<>();
        List<String> couponCodes = new ArrayList<>();
        couponCodes.add(orderCoupon);

        for (CartDetailRequest detail : cart) {
            shopIds.add(detail.getShopId());
            couponCodes.add(detail.getCoupon());
            for (CartItemRequest item : detail.getItems()) {
                bookIds.add(item.getId());
            }
        }

        //Fetch shops, books, coupons
        Map<Long, Shop> shops = shopRepo.findShopsInIds(shopIds).stream()
                .collect(Collectors.toMap(Shop::getId, Function.identity()));
        Map<Long, Book> books = bookRepo.findBooksInIds(bookIds).stream()
                .collect(Collectors.toMap(Book::getId, Function.identity()));
        Map<String, ICoupon> coupons = couponRepo.findCouponInCodes(couponCodes).stream()
                .collect(Collectors.toMap(coupon -> coupon.getCoupon().getCode(), Function.identity()));

        //Initial values
        double totalPrice = 0.0;
        double totalShippingFee = 0.0;
        double totalDealDiscount = 0.0;
        double totalCouponDiscount = 0.0;
        double totalShippingDiscount = 0.0;
        int totalQuantity = 0;

        //Process each detail in the cart order
        for (CartDetailRequest detail : cart) {
            OrderDetail orderDetail = processOrderDetail(detail,
                    shops,
                    books,
                    coupons,
                    address,
                    shippingType,
                    user,
                    isCheckout);

            //Add detail to order
            orderReceipt.addOrderDetail(orderDetail);

            //Add value
            totalPrice += orderDetail.getTotalPrice();
            totalQuantity += orderDetail.getTotalQuantity();
            totalShippingFee += orderDetail.getShippingFee();
            totalCouponDiscount += orderDetail.getCouponDiscount();
            totalShippingDiscount += orderDetail.getShippingDiscount();
            totalDealDiscount += orderDetail.getDealDiscount();
        }

        //Apply main coupon
        ICoupon coupon = orderCoupon == null ? null //Null => User not select any coupon
                : coupons.containsKey(orderCoupon) ? coupons.get(orderCoupon)
                : (couponRepo.recommendCoupon(null, totalPrice - totalDealDiscount, totalQuantity)
                .orElse(null));

        if (coupon != null && coupon.getCoupon().getShop() == null
                && !couponService.isExpired(coupon.getCoupon())) {
            //Initial value
            double discountValue = 0.0;
            double shippingDiscount = 0.0;
            double value = totalPrice - totalDealDiscount - totalCouponDiscount;
            double shipping = totalShippingFee - totalShippingDiscount;

            //Apply coupon
            CouponDiscountDTO discountFromCoupon = couponService.applyCoupon(coupon.getCoupon(),
                    new CartStateRequest(value, shipping, totalQuantity), user);

            if (discountFromCoupon != null) {
                //Decrease usage on checkout
                if (isCheckout) {
                    couponRepo.decreaseUsage(coupon.getCoupon().getId());
                }

                coupon.getCoupon().setIsUsable(true); //Mark usable for DTO result mapping
                discountValue = discountFromCoupon.discountValue();
                shippingDiscount = discountFromCoupon.discountShipping();

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
            } else if (isCheckout) {
                throw new HttpResponseException(
                        HttpStatus.CONFLICT,
                        "Coupon expired!",
                        "Không thể sử dụng mã coupon " + orderCoupon + "!"
                );
            }

            //Add to total
            totalCouponDiscount += discountValue;
            totalShippingDiscount += shippingDiscount;
        }

        //Total discount
        double totalDiscount = totalCouponDiscount + totalDealDiscount + totalShippingDiscount;

        //Set value
        orderReceipt.setTotal(totalPrice + totalShippingFee);
        orderReceipt.setProductsPrice(totalPrice);
        orderReceipt.setShippingFee(totalShippingFee);
        orderReceipt.setTotalDiscount(totalDiscount);
        orderReceipt.setDealDiscount(totalDealDiscount);
        orderReceipt.setCouponDiscount(totalCouponDiscount);
        orderReceipt.setShippingDiscount(totalShippingDiscount);

        if (isCheckout) {
            orderReceipt.setCoupon(coupon != null ? coupon.getCoupon() : null);
        } else {
            orderReceipt.setCouponDTO(coupon != null ? couponMapper.couponToDTO(coupon) : null);
        }

        return orderReceipt;
    }

    //Process detail (Shop's items)
    private OrderDetail processOrderDetail(CartDetailRequest detail,
                                           Map<Long, Shop> shops,
                                           Map<Long, Book> books,
                                           Map<String, ICoupon> coupons,
                                           Address address,
                                           ShippingType shippingType,
                                           Account user,
                                           boolean isCheckout) {
        //Shop validation
        Shop shop = shops.get(detail.getShopId());
        List<CartItemRequest> items = detail.getItems();
        if (shop == null || items == null || items.isEmpty()) {
            if (isCheckout) throw new ResourceNotFoundException("Shop not found!");

            //Return temp detail
            return OrderDetail.builder()
                    .shop(Shop.builder().id(detail.getShopId()).build())
                    .totalPrice(0.0)
                    .shippingFee(0.0)
                    .discount(0.0)
                    .shippingDiscount(0.0)
                    .coupon(Coupon.builder().code(detail.getCoupon()).build())
                    .items(new ArrayList<>()).build();
        }

        //New detail
        OrderDetail orderDetail = OrderDetail.builder()
                .status(OrderStatus.PENDING)
                .shop(shop)
                .items(new ArrayList<>()).build();

        //Initial value
        double shippingFee = calculateShippingFee(address, shop.getAddress(), shippingType);
        double detailTotal = 0.0;
        double discountDeal = 0.0;
        double discountCoupon = 0.0;
        double discountValue = 0.0;
        double discountShipping = 0.0;
        int detailQuantity = 0;

        //Process each item in detail
        for (CartItemRequest item : items) {
            //Book validation
            Book book = books.get(item.getId());
            if (book == null || !book.getShop().getId().equals(shop.getId())) {
                if (isCheckout) throw new ResourceNotFoundException("Book not found!");

                //Create temp item
                var orderItem = OrderItem.builder()
                        .book(Book.builder().id(item.getId()).build())
                        .build();

                orderDetail.addOrderItem(orderItem);
                continue; //Skip other steps
            }

            //Stocks validation
            short quantity = item.getQuantity();
            if (quantity < 1 || quantity > book.getAmount()) {
                throw new HttpResponseException(HttpStatus.CONFLICT, "Product out of stock!", "Sản phẩm không đủ số lượng!");
            }

            //Calculate deal (for DTO result only ~ ~)
            double deal = book.getPrice() * book.getDiscount().doubleValue();
            detailQuantity += quantity;
            detailTotal += book.getPrice() * quantity;
            discountDeal += deal * quantity;

            //Decrease stock on checkout
            if (isCheckout) {
                bookRepo.decreaseStock(book.getId(), quantity);
            }

            //Add item into new detail
            orderDetail.addOrderItem(OrderItem.builder()
                    .price(book.getPrice())
                    .discount(book.getDiscount())
                    .book(book)
                    .quantity(quantity)
                    .build());
        }

        //Check coupon
        ICoupon shopCoupon = detail.getCoupon() == null ? null //Null => User not select any coupon
                : coupons.containsKey(detail.getCoupon()) ? coupons.get(detail.getCoupon())
                : couponRepo.recommendCoupon(shop.getId(), detailTotal - discountDeal, detailQuantity)
                .orElse(null);

        //Validate + apply coupon
        if (shopCoupon != null
                && shopCoupon.getCoupon().getShop().getId().equals(shop.getId())
                && !couponService.isExpired(shopCoupon.getCoupon())) {
            CouponDiscountDTO discountFromCoupon = couponService.applyCoupon(shopCoupon.getCoupon(),
                    new CartStateRequest(detailTotal - discountDeal, shippingFee, detailQuantity), user);

            //Appliable coupon
            if (discountFromCoupon != null) {
                //Decrease usage on checkout
                if (isCheckout) {
                    couponRepo.decreaseUsage(shopCoupon.getCoupon().getId());
                }
                shopCoupon.getCoupon().setIsUsable(true); //Mark usable to map DTO result
                discountCoupon = discountFromCoupon.discountValue();
                discountShipping = discountFromCoupon.discountShipping();
            } else if (isCheckout) {
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

        //Set detail value
        orderDetail.setTotalPrice(detailTotal);
        orderDetail.setShippingFee(shippingFee);
        orderDetail.setDealDiscount(discountDeal);
        orderDetail.setDiscount(discountValue);
        orderDetail.setCouponDiscount(discountCoupon);
        orderDetail.setShippingDiscount(discountShipping);
        orderDetail.setTotalQuantity(detailQuantity);

        if (isCheckout) {
            orderDetail.setCoupon(shopCoupon != null ? shopCoupon.getCoupon() : null);
        } else {
            orderDetail.setCouponDTO(shopCoupon != null ? couponMapper.couponToDTO(shopCoupon) : null);
        }

        return orderDetail;
    }

    private double calculateShippingFee(Address origin,
                                        Address destination,
                                        ShippingType type) {
        double shippingFee = origin != null ? distanceCalculation(origin, destination) : 10000;
        if (type != null) {
            if (type.equals(ShippingType.ECONOMY)) shippingFee *= 0.2;
            if (type.equals(ShippingType.EXPRESS)) shippingFee *= 1.5;
        }
        return shippingFee;
    }

    //Return fixed amount of shipping fee for now :<
    private double distanceCalculation(Address origin,
                                       Address destination) {
        return 10000.0;
    }

    //Check valid role function
    protected boolean isAuthAdmin() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication(); //Get current auth
        return (auth != null && auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals(RoleName.ROLE_ADMIN.toString())));
    }

    //Check valid role function
    protected boolean isOwnerValid(Shop shop,
                                   Account user) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication(); //Get current auth
        boolean isAdmin = (auth != null && auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals(RoleName.ROLE_ADMIN.toString())));
        //Check if is admin or valid owner id
        return shop.getOwner().getId().equals(user.getId()) || isAdmin;
    }

    protected boolean isUserValid(OrderReceipt receipt,
                                  Account user) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication(); //Get current auth
        boolean isAdmin = (auth != null && auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals(RoleName.ROLE_ADMIN.toString())));
        //Check if is admin or valid owner id
        return receipt.getUser().getId().equals(user.getId()) || isAdmin;
    }
}
