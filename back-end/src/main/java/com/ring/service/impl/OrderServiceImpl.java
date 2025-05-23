package com.ring.service.impl;

import com.ring.dto.projection.coupons.ICoupon;
import com.ring.dto.projection.orders.*;
import com.ring.dto.request.*;
import com.ring.dto.response.PagingResponse;
import com.ring.dto.response.coupons.CouponDiscountDTO;
import com.ring.dto.response.dashboard.ChartDTO;
import com.ring.dto.response.dashboard.StatDTO;
import com.ring.dto.response.orders.*;
import com.ring.exception.EntityOwnershipException;
import com.ring.exception.HttpResponseException;
import com.ring.exception.PaymentException;
import com.ring.exception.ResourceNotFoundException;
import com.ring.listener.checkout.OnCheckoutCompletedEvent;
import com.ring.mapper.CalculateMapper;
import com.ring.mapper.CouponMapper;
import com.ring.mapper.DashboardMapper;
import com.ring.mapper.OrderMapper;
import com.ring.model.entity.*;
import com.ring.model.enums.*;
import com.ring.repository.*;
import com.ring.service.CaptchaService;
import com.ring.service.CouponService;
import com.ring.service.OrderService;
import com.ring.service.PayOSService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.payos.type.CheckoutResponseData;
import vn.payos.type.PaymentLinkData;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

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
        private final PaymentInfoRepository paymentRepo;

        private final CouponService couponService;
        private final CaptchaService captchaService;
        private final PayOSService payOSService;

        private final OrderMapper orderMapper;
        private final CalculateMapper calculateMapper;
        private final DashboardMapper dashMapper;
        private final CouponMapper couponMapper;

        private final ApplicationEventPublisher eventPublisher;

        @Cacheable(cacheNames = "calculate")
        public CalculateDTO calculate(CalculateRequest request,
                        Account user) {
                // Create address
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
                                null,
                                user,
                                false);

                return calculateMapper.orderToDTO(calculatedReceipt);
        }

        @CacheEvict(cacheNames = { "calculate", "receipts", "orders", "orderAnalytics", "sales" }, allEntries = true)
        @Transactional
        public ReceiptDTO checkout(OrderRequest checkRequest,
                        HttpServletRequest request,
                        Account user) {

                // Recaptcha
                final String recaptchaToken = request.getHeader("response");
                final String source = request.getHeader("source");
                captchaService.validate(recaptchaToken, source, CaptchaServiceImpl.CHECKOUT_ACTION);

                // Create address
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
                                checkRequest.getPaymentMethod(),
                                user,
                                true);

                // Payment
                PaymentInfo paymentInfo = PaymentInfo.builder()
                                .paymentType(checkRequest.getPaymentMethod())
                                .status(PaymentStatus.PENDING)
                                .amount((int) Math.floor(orderReceipt.getTotal() - orderReceipt.getTotalDiscount()))
                                .build();

                // Set relevant values
                orderReceipt.setUser(user);
                orderReceipt.setEmail(user.getEmail());
                orderReceipt.setAddress(savedAddress);

                orderReceipt.setPayment(paymentInfo);
                orderRepo.save(orderReceipt);

                ReceiptDTO receiptDTO = orderMapper.orderToDTO(orderReceipt);

                if (checkRequest.getPaymentMethod().equals(PaymentType.ONLINE_PAYMENT)) {
                        try {
                                CheckoutResponseData checkoutResponse = payOSService.checkout(receiptDTO);

                                paymentInfo.setCheckoutUrl(checkoutResponse.getCheckoutUrl());
                                paymentInfo.setStatus(PaymentStatus.valueOf(checkoutResponse.getStatus()));
                                paymentInfo.setAmount(checkoutResponse.getAmount());
                                paymentInfo.setDescription(checkoutResponse.getDescription());
                                paymentInfo.setExpiredAt(Instant.ofEpochSecond(checkoutResponse.getExpiredAt())
                                                .atZone(ZoneId.systemDefault())
                                                .toLocalDateTime());

                                orderRepo.save(orderReceipt);
                        } catch (PaymentException ignored) {
                        }
                }

                // Trigger email event
                eventPublisher.publishEvent(new OnCheckoutCompletedEvent(
                                user.getUsername(),
                                user.getEmail(),
                                orderReceipt.getProductsPrice(),
                                orderReceipt.getShippingFee(),
                                receiptDTO));

                return receiptDTO;
        }

        @Cacheable(cacheNames = "paymentLink", key = "#id")
        @Transactional
        public PaymentInfo createPaymentLink(HttpServletRequest request,
                        Long id) {

                // Recaptcha
                final String recaptchaToken = request.getHeader("response");
                final String source = request.getHeader("source");
                captchaService.validate(recaptchaToken, source, CaptchaServiceImpl.PAYMENT_ACTION);

                PaymentInfo paymentInfo = paymentRepo.findByOrder(id).orElseThrow(
                                () -> new ResourceNotFoundException("Payment for this Order not found!",
                                                "Không thể tìm thấy đường dẫn thanh toán cho đơn hàng yêu cầu!"));

                if (paymentInfo.getPaymentType().equals(PaymentType.ONLINE_PAYMENT)
                                && paymentInfo.getStatus().equals(PaymentStatus.PENDING)
                                && paymentInfo.getCheckoutUrl() == null) {
                        ReceiptDTO receiptDTO = this.getReceipt(id);
                        CheckoutResponseData checkoutResponse = payOSService.checkout(receiptDTO);

                        LocalDateTime expiredAt = LocalDateTime.ofInstant(
                                        Instant.ofEpochSecond(checkoutResponse.getExpiredAt()),
                                        ZoneId.systemDefault());

                        paymentInfo.setCheckoutUrl(checkoutResponse.getCheckoutUrl());
                        paymentInfo.setStatus(PaymentStatus.valueOf(checkoutResponse.getStatus()));
                        paymentInfo.setAmount(checkoutResponse.getAmount());
                        paymentInfo.setDescription(checkoutResponse.getDescription());
                        paymentInfo.setExpiredAt(expiredAt);

                        paymentRepo.save(paymentInfo);
                }

                return paymentInfo;
        }

        @Cacheable(cacheNames = "payment", key = "#id")
        public PaymentLinkData getPaymentLinkData(Long id) {
                return payOSService.getPaymentLinkData(id);
        }

        @CacheEvict(cacheNames = { "orders", "orderAnalytics" }, allEntries = true)
        @Transactional
        public void cancel(Long id,
                        String reason,
                        Account user) {

                OrderDetail detail = detailRepo.findDetailById(id)
                                .orElseThrow(() -> new ResourceNotFoundException("Order detail not found!",
                                                "Không tìm thấy chi tiết đơn hàng yêu cầu!"));

                // Check valid status for cancel
                OrderStatus currStatus = detail.getStatus();
                if (!currStatus.equals(OrderStatus.PENDING)) {
                        throw new HttpResponseException(HttpStatus.BAD_REQUEST, "Invalid order status!");
                }

                // Check if correct user
                OrderReceipt order = detail.getOrder();
                if (!isUserValid(order, user)) {
                        throw new EntityOwnershipException("Invalid user!",
                                        "Người dùng không có quyền huỷ đơn hàng này!");
                }

                detail.setStatus(OrderStatus.CANCELED);
                detail.setNote(reason);
                detailRepo.save(detail);

                // Subtract price & discount
                order.setTotal(order.getTotal() - detail.getTotalPrice() - detail.getShippingFee());
                order.setTotalDiscount(order.getTotalDiscount() - detail.getDiscount() - detail.getShippingDiscount());

                orderRepo.save(order);
        }

        @Caching(evict = {
                        @CacheEvict(cacheNames = { "orders", "orderAnalytics", "receipts",
                                        "sales" }, allEntries = true),
                        @CacheEvict(cacheNames = "paymentLink", key = "#orderId"),
                        @CacheEvict(cacheNames = "payment", key = "#orderId") })
        @Transactional
        public void cancelUnpaidOrder(Long orderId,
                        String reason,
                        Account user) {

                OrderReceipt order = orderRepo.findById(orderId)
                                .orElseThrow(() -> new ResourceNotFoundException("Order not found!",
                                                "Không tìm thấy đơn hàng yêu cầu!"));

                // Check if correct user
                if (!isUserValid(order, user)) {
                        throw new EntityOwnershipException("Invalid user!",
                                        "Người dùng không có quyền huỷ đơn hàng này!");
                }

                PaymentInfo paymentInfo = paymentRepo.findByOrder(order.getId()).orElseThrow(
                                () -> new ResourceNotFoundException("Payment for this Order not found!",
                                                "Không thể tìm thấy đường dẫn thanh toán cho đơn hàng yêu cầu!"));

                if (!paymentInfo.getStatus().equals(PaymentStatus.PENDING))
                        throw new HttpResponseException(HttpStatus.BAD_REQUEST, "Invalid payment status!");

                // Cancel all details
                detailRepo.cancelUnpaidByOrderId(order.getId(), reason);

                // Subtract price & discount
                order.setTotal(0.0);
                order.setTotalDiscount(0.0);

                if (paymentInfo.getPaymentType().equals(PaymentType.ONLINE_PAYMENT)) {
                        // Cancel payment
                        try {
                                PaymentLinkData paymentData = payOSService.cancel(order.getId(), reason);
                                paymentInfo.setExpiredAt(null);
                                paymentInfo.setStatus(PaymentStatus.valueOf(paymentData.getStatus()));
                        } catch (Exception ignored) {
                                paymentInfo.setStatus(PaymentStatus.CANCELED);
                        }
                } else {
                        paymentInfo.setStatus(PaymentStatus.CANCELED);
                }

                paymentRepo.save(paymentInfo);
                orderRepo.save(order);
        }

        @CacheEvict(cacheNames = { "orders", "orderAnalytics", "receipts", "sales" }, allEntries = true)
        @Transactional
        public void refund(Long id,
                        String reason,
                        Account user) {

                OrderDetail detail = detailRepo.findDetailById(id)
                                .orElseThrow(() -> new ResourceNotFoundException("Order detail not found!",
                                                "Không tìm thấy chi tiết đơn hàng yêu cầu!"));

                // Check valid status for cancel
                OrderStatus currStatus = detail.getStatus();
                if (!currStatus.equals(OrderStatus.COMPLETED))
                        throw new HttpResponseException(HttpStatus.BAD_REQUEST, "Invalid order status!");

                // Check if correct user
                OrderReceipt order = detail.getOrder();
                if (!isUserValid(order, user))
                        throw new EntityOwnershipException("Invalid user!",
                                        "Người dùng không có quyền hoàn trả đơn hàng này!");

                if (order.getLastModifiedDate()
                                .plus(1, ChronoUnit.WEEKS).isAfter(LocalDateTime.now()))
                        throw new HttpResponseException(HttpStatus.BAD_REQUEST, "Invalid date!");

                detail.setStatus(OrderStatus.PENDING_REFUND);
                detail.setNote(reason);
                detailRepo.save(detail);
        }

        @Caching(evict = {
                        @CacheEvict(cacheNames = { "orders", "orderAnalytics", "receipts",
                                        "sales" }, allEntries = true),
                        @CacheEvict(cacheNames = "paymentLink", key = "#orderId"),
                        @CacheEvict(cacheNames = "payment", key = "#orderId") })
        @Transactional
        public void changePaymentMethod(Long orderId,
                        PaymentType paymentMethod,
                        Account user) {

                OrderReceipt order = orderRepo.findById(orderId)
                                .orElseThrow(() -> new ResourceNotFoundException("Order not found!",
                                                "Không tìm thấy đơn hàng yêu cầu!"));

                // Check if correct user
                if (!isUserValid(order, user))
                        throw new EntityOwnershipException("Invalid user!",
                                        "Người dùng không có quyền thay đổi hình thức thanh toán cho đơn hàng này!");

                PaymentInfo paymentInfo = paymentRepo.findByOrder(order.getId()).orElseThrow(
                                () -> new ResourceNotFoundException("Payment for this Order not found!",
                                                "Không thể tìm thấy đường dẫn thanh toán cho đơn hàng yêu cầu!"));

                // Check valid status for cancel
                if (!paymentInfo.getStatus().equals(PaymentStatus.PENDING))
                        throw new HttpResponseException(HttpStatus.BAD_REQUEST, "Invalid payment status!");

                paymentInfo.setPaymentType(paymentMethod);
                paymentRepo.save(paymentInfo);
        }

        @CacheEvict(cacheNames = { "orders", "orderAnalytics", "receipts", "sales" }, allEntries = true)
        @Transactional
        public void confirm(Long id,
                        Account user) {

                OrderDetail detail = detailRepo.findDetailById(id)
                                .orElseThrow(() -> new ResourceNotFoundException("Order detail not found!",
                                                "Không tìm thấy chi tiết đơn hàng yêu cầu!"));

                // Check valid status for cancel
                OrderStatus currStatus = detail.getStatus();
                if (!currStatus.equals(OrderStatus.SHIPPING)) {
                        throw new HttpResponseException(HttpStatus.BAD_REQUEST, "Invalid order status!");
                }

                PaymentInfo paymentInfo = paymentRepo.findByOrder(detail.getOrder().getId()).orElseThrow(
                                () -> new ResourceNotFoundException("Payment for this Order not found!",
                                                "Không thể tìm thấy đường dẫn thanh toán cho đơn hàng yêu cầu!"));

                if (!paymentInfo.getStatus().equals(PaymentStatus.PAID)) {
                        throw new HttpResponseException(HttpStatus.BAD_REQUEST, "Invalid payment status!");
                }

                // Check if correct user
                if (!isUserValid(detail.getOrder(), user))
                        throw new EntityOwnershipException("Invalid user!",
                                        "Người dùng không có quyền xác nhận đơn hàng này!");

                detail.setStatus(OrderStatus.COMPLETED);
                detailRepo.save(detail);
        }

        @Caching(evict = {
                        @CacheEvict(cacheNames = { "orders", "orderAnalytics", "receipts",
                                        "sales" }, allEntries = true),
                        @CacheEvict(cacheNames = "paymentLink", key = "#id"),
                        @CacheEvict(cacheNames = "payment", key = "#id") })
        @Transactional
        public void confirmPayment(Long id) {

                // Update payment status
                PaymentInfo paymentInfo = paymentRepo.findByOrder(id).orElse(null);

                if (paymentInfo != null) {
                        paymentInfo.setStatus(PaymentStatus.PAID);
                        paymentRepo.save(paymentInfo);
                }

                // Update details status
                detailRepo.confirmPaymentByOrderId(id);
        }

        @Caching(evict = {
                        @CacheEvict(cacheNames = { "orders", "orderAnalytics", "receipts",
                                        "sales" }, allEntries = true),
                        @CacheEvict(cacheNames = "paymentLink", key = "#id"),
                        @CacheEvict(cacheNames = "payment", key = "#id") })
        @Transactional
        public void changeStatus(Long id,
                        OrderStatus status,
                        Account user) {

                OrderDetail detail = detailRepo.findDetailById(id)
                                .orElseThrow(() -> new ResourceNotFoundException("Order detail not found!",
                                                "Không tìm thấy chi tiết đơn hàng yêu cầu!"));
                OrderReceipt order = detail.getOrder();

                // Check if correct user
                if (!isOwnerValid(detail.getShop(), user))
                        throw new EntityOwnershipException("Invalid ownership!",
                                        "Người dùng không có quyền chỉnh sửa đơn hàng này!");

                detail.setStatus(status);
                detailRepo.save(detail);

                // Subtract price & discount
                if (status.equals(OrderStatus.CANCELED) || status.equals(OrderStatus.REFUNDED)) {
                        order.setTotal(order.getTotal() - detail.getTotalPrice() - detail.getShippingFee());
                        order.setTotalDiscount(
                                        order.getTotalDiscount() - detail.getDiscount() - detail.getShippingDiscount());
                        orderRepo.save(order);
                }
        }

        @Cacheable(cacheNames = "receipts")
        @Transactional
        public PagingResponse<ReceiptDTO> getAllReceipts(Account user,
                        Long shopId,
                        OrderStatus status,
                        String keyword,
                        Integer pageNo,
                        Integer pageSize,
                        String sortBy,
                        String sortDir) {

                Pageable pageable = PageRequest.of(pageNo, pageSize,
                                sortDir.equals("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending());
                boolean isAdmin = isAuthAdmin();

                Page<IOrderReceipt> receipts = orderRepo.findAllBy(shopId,
                                isAdmin ? null : user.getId(),
                                status,
                                keyword,
                                pageable); // Fetch from database
                List<Long> receiptIds = receipts.getContent().stream().map(IOrderReceipt::getId)
                                .collect(Collectors.toList());
                List<IOrder> details = detailRepo.findAllByReceiptIds(receiptIds);

                // Map
                List<ReceiptDTO> ordersList = orderMapper.receiptsAndDetailsProjectionToReceiptDTOS(
                                receipts.getContent(),
                                details);
                return new PagingResponse<>(
                                ordersList,
                                receipts.getTotalPages(),
                                receipts.getTotalElements(),
                                receipts.getSize(),
                                receipts.getNumber(),
                                receipts.isEmpty());
        }

        @Cacheable(cacheNames = "receipts")
        @Transactional
        public PagingResponse<ReceiptSummaryDTO> getSummariesWithFilter(Account user,
                        Long shopId,
                        Long bookId,
                        Integer pageNo,
                        Integer pageSize,
                        String sortBy,
                        String sortDir) {

                Pageable pageable = PageRequest.of(pageNo, pageSize,
                                sortDir.equals("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending());
                boolean isAdmin = isAuthAdmin();

                Page<IReceiptSummary> summariesList = orderRepo.findAllSummaries(shopId,
                                isAdmin ? null : user.getId(),
                                bookId,
                                pageable);
                if (summariesList == null)
                        throw new EntityOwnershipException("Invalid role!",
                                        "Người dùng không có quyền truy xuất dữ liệu này!");

                List<ReceiptSummaryDTO> summariesDTOS = summariesList.map(orderMapper::summaryToDTO).toList();
                return new PagingResponse<>(
                                summariesDTOS,
                                summariesList.getTotalPages(),
                                summariesList.getTotalElements(),
                                summariesList.getSize(),
                                summariesList.getNumber(),
                                summariesList.isEmpty());
        }

        @Cacheable(cacheNames = "orders")
        @Override
        public PagingResponse<OrderDTO> getOrdersByBookId(Long id,
                        Integer pageNo,
                        Integer pageSize,
                        String sortBy,
                        String sortDir) {
                Pageable pageable = PageRequest.of(pageNo, pageSize,
                                sortDir.equals("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending());

                Page<IOrder> details = detailRepo.findAllByBookId(id, pageable);
                List<Long> orderIds = details.getContent().stream().map(IOrder::getId).collect(Collectors.toList());
                List<IOrderItem> items = itemRepo.findAllWithDetailIds(orderIds);
                List<OrderDTO> ordersList = orderMapper.ordersAndItemsProjectionToDTOS(details.getContent(), items);
                return new PagingResponse<>(
                                ordersList,
                                details.getTotalPages(),
                                details.getTotalElements(),
                                details.getSize(),
                                details.getNumber(),
                                details.isEmpty());
        }

        @Cacheable(cacheNames = "orders")
        @Transactional
        public PagingResponse<OrderDTO> getOrdersByUser(Account user,
                        OrderStatus status,
                        String keyword,
                        Integer pageNo,
                        Integer pageSize) {

                Pageable pageable = PageRequest.of(pageNo, pageSize);

                Page<IOrder> details = detailRepo.findAllByUserId(user.getId(), status, keyword, pageable);
                List<Long> orderIds = details.getContent().stream().map(IOrder::getId).collect(Collectors.toList());
                List<IOrderItem> items = itemRepo.findAllWithDetailIds(orderIds);
                List<OrderDTO> ordersList = orderMapper.ordersAndItemsProjectionToDTOS(details.getContent(), items);
                return new PagingResponse<>(
                                ordersList,
                                details.getTotalPages(),
                                details.getTotalElements(),
                                details.getSize(),
                                details.getNumber(),
                                details.isEmpty());
        }

        @Cacheable(cacheNames = "receipt", key = "#id")
        public ReceiptDTO getReceipt(Long id) {

                OrderReceipt order = orderRepo.findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException("Order not found!",
                                                "Không tìm thấy đơn hàng yêu cầu!"));
                ReceiptDTO receiptDTO = orderMapper.orderToDTO(order); // Map to DTO
                return receiptDTO;
        }

        @Transactional
        public OrderDetailDTO getOrderDetail(Long id, Account user) {

                IOrderDetail detailProjection = detailRepo.findOrderDetail(id, isAuthAdmin() ? null : user.getId())
                                .orElseThrow(() -> new ResourceNotFoundException("Order detail not found!",
                                                "Không tìm thấy chi tiết đơn hàng yêu cầu!"));
                List<IOrderItem> items = itemRepo.findAllWithDetailIds(List.of(detailProjection.getId()));
                OrderDetailDTO detailDTO = orderMapper.orderDetailAndItemsProjectionToOrderDetailDTO(detailProjection,
                                items);
                return detailDTO;
        }

        @Transactional
        public ReceiptDetailDTO getReceiptDetail(Long id, Account user) {

                IReceiptDetail receiptProjection = orderRepo.findReceiptDetail(id, isAuthAdmin() ? null : user.getId())
                                .orElseThrow(() -> new ResourceNotFoundException("Order not found!",
                                                "Không tìm thấy đơn hàng yêu cầu!"));
                List<IOrder> details = detailRepo.findAllByReceiptId(id);
                List<Long> orderIds = details.stream().map(IOrder::getId).collect(Collectors.toList());
                List<IOrderItem> items = itemRepo.findAllWithDetailIds(orderIds);
                List<OrderDTO> ordersList = orderMapper.ordersAndItemsProjectionToDTOS(details, items);
                ReceiptDetailDTO orderDTO = orderMapper.receiptDetailAndDetailsDTOToReceiptDetailDTO(receiptProjection,
                                ordersList); // Map to DTO
                return orderDTO;
        }

        @Cacheable(cacheNames = "orderAnalytics")
        public StatDTO getAnalytics(Account user, Long shopId) {

                boolean isAdmin = isAuthAdmin();
                return dashMapper.statToDTO(detailRepo.getSalesAnalytics(shopId, isAdmin ? null : user.getId()),
                                "sales",
                                "Doanh thu tháng này");
        }

        @Cacheable(cacheNames = "sales")
        public List<ChartDTO> getMonthlySales(Account user, Long shopId, Integer year) {

                boolean isAdmin = isAuthAdmin();
                List<Map<String, Object>> data = orderRepo.getMonthlySales(shopId, isAdmin ? null : user.getId(), year);
                return data.stream().map(dashMapper::dataToChartDTO).collect(Collectors.toList()); // Return chart data
        }

        private OrderReceipt processOrder(List<CartDetailRequest> cart,
                        String orderCoupon,
                        Address address,
                        PaymentType paymentMethod,
                        Account user,
                        boolean isCheckout) {

                // Create receipt
                var orderReceipt = OrderReceipt.builder()
                                .details(new ArrayList<>())
                                .build();

                // Get books, shops, coupons IDS for prefetch
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

                // Fetch shops, books, coupons
                Map<Long, Shop> shops = shopRepo.findShopsInIds(shopIds).stream()
                                .collect(Collectors.toMap(Shop::getId, Function.identity()));
                Map<Long, Book> books = bookRepo.findBooksInIds(bookIds).stream()
                                .collect(Collectors.toMap(Book::getId, Function.identity()));
                Map<String, ICoupon> coupons = couponRepo.findCouponInCodes(couponCodes).stream()
                                .collect(Collectors.toMap(coupon -> coupon.getCoupon().getCode(), Function.identity()));

                // Initial values
                double totalPrice = 0.0;
                double totalShippingFee = 0.0;
                double totalDealDiscount = 0.0;
                double totalCouponDiscount = 0.0;
                double totalShippingDiscount = 0.0;
                int totalQuantity = 0;

                // Process each detail in the cart order
                for (CartDetailRequest detail : cart) {
                        OrderDetail orderDetail = processOrderDetail(detail,
                                        shops,
                                        books,
                                        coupons,
                                        address,
                                        paymentMethod,
                                        user,
                                        isCheckout);

                        // Add detail to order
                        orderReceipt.addOrderDetail(orderDetail);

                        // Add value
                        totalPrice += orderDetail.getTotalPrice();
                        totalQuantity += orderDetail.getTotalQuantity();
                        totalShippingFee += orderDetail.getShippingFee();
                        totalCouponDiscount += orderDetail.getCouponDiscount();
                        totalShippingDiscount += orderDetail.getShippingDiscount();
                        totalDealDiscount += orderDetail.getDealDiscount();
                }

                // Apply main coupon
                ICoupon cProjection = orderCoupon == null ? null // Null => User not select any coupon
                                : coupons.containsKey(orderCoupon) ? coupons.get(orderCoupon)
                                                : (couponRepo.recommendCoupon(null, totalPrice - totalDealDiscount,
                                                                totalQuantity)
                                                                .orElse(null));

                Coupon coupon = cProjection != null ? cProjection.getCoupon() : null;
                if (coupon != null && coupon.getShop() == null
                                && !couponService.isExpired(coupon)) {
                        // Initial value
                        double discountValue = 0.0;
                        double shippingDiscount = 0.0;
                        double value = totalPrice - totalDealDiscount - totalCouponDiscount;
                        double shipping = totalShippingFee - totalShippingDiscount;

                        // Apply coupon
                        if (couponRepo.hasUserUsedCoupon(coupon.getId(), user.getId())) {
                                coupon.setIsUsed(true);

                                if (isCheckout) {
                                        throw new HttpResponseException(
                                                        HttpStatus.CONFLICT,
                                                        "Coupon expired!",
                                                        "Mã coupon " + orderCoupon + " đã qua sử dụng!");
                                }
                        }

                        CouponDiscountDTO discountFromCoupon = couponService.applyCoupon(coupon,
                                        new CartStateRequest(value,
                                                        shipping,
                                                        totalQuantity,
                                                        null),
                                        user);

                        if (discountFromCoupon != null) {
                                // Decrease usage on checkout
                                if (isCheckout) {
                                        couponRepo.decreaseUsage(coupon.getId());
                                }

                                coupon.setIsUsable(true); // Mark usable for DTO result mapping
                                discountValue = discountFromCoupon.discountValue();
                                shippingDiscount = discountFromCoupon.discountShipping();

                                // Split discount for each detail
                                double discountRatio = discountValue / value;
                                double shippingDiscountRatio = shippingDiscount / shipping;

                                for (OrderDetail detail : orderReceipt.getDetails()) {
                                        double pDiscount = detail.getDiscount() != null ? detail.getDiscount() : 0;
                                        double sDiscount = detail.getShippingDiscount() != null
                                                        ? detail.getShippingDiscount()
                                                        : 0;
                                        double applyDiscount = (detail.getTotalPrice() - pDiscount) * discountRatio;
                                        double applyShippingDiscount = (detail.getShippingFee() - sDiscount)
                                                        * shippingDiscountRatio;

                                        detail.setDiscount(pDiscount + applyDiscount);
                                        detail.setShippingDiscount(sDiscount + applyShippingDiscount);
                                }
                        } else if (isCheckout) {
                                throw new HttpResponseException(
                                                HttpStatus.CONFLICT,
                                                "Invalid coupon!",
                                                "Không thể sử dụng mã coupon " + orderCoupon + "!");
                        }

                        // Add to total
                        totalCouponDiscount += discountValue;
                        totalShippingDiscount += shippingDiscount;
                }

                // Total discount
                double totalDiscount = totalCouponDiscount + totalDealDiscount + totalShippingDiscount;

                // Set value
                orderReceipt.setTotal(totalPrice + totalShippingFee);
                orderReceipt.setProductsPrice(totalPrice);
                orderReceipt.setShippingFee(totalShippingFee);
                orderReceipt.setTotalDiscount(totalDiscount);
                orderReceipt.setDealDiscount(totalDealDiscount);
                orderReceipt.setCouponDiscount(totalCouponDiscount);
                orderReceipt.setShippingDiscount(totalShippingDiscount);

                if (isCheckout) {
                        orderReceipt.setCoupon(coupon);
                } else {
                        orderReceipt.setCouponDTO(cProjection != null ? couponMapper.couponToDTO(cProjection) : null);
                }

                return orderReceipt;
        }

        // Process detail (Shop's items)
        private OrderDetail processOrderDetail(CartDetailRequest detail,
                        Map<Long, Shop> shops,
                        Map<Long, Book> books,
                        Map<String, ICoupon> coupons,
                        Address address,
                        PaymentType paymentMethod,
                        Account user,
                        boolean isCheckout) {

                // Shop validation
                Shop shop = shops.get(detail.getShopId());
                List<CartItemRequest> items = detail.getItems();
                if (shop == null || items == null || items.isEmpty()) {
                        if (isCheckout)
                                throw new ResourceNotFoundException("Shop not found!",
                                                "Không tìm thấy cửa hàng yêu cầu!");

                        // Return temp detail
                        return OrderDetail.builder()
                                        .shop(Shop.builder().id(detail.getShopId()).build())
                                        .totalPrice(0.0)
                                        .shippingFee(0.0)
                                        .discount(0.0)
                                        .shippingDiscount(0.0)
                                        .coupon(Coupon.builder().code(detail.getCoupon()).build())
                                        .items(new ArrayList<>()).build();
                }

                // New detail
                OrderStatus status = paymentMethod == PaymentType.CASH
                                ? OrderStatus.PENDING
                                : OrderStatus.PENDING_PAYMENT;
                OrderDetail orderDetail = OrderDetail.builder()
                                .status(status)
                                .shop(shop)
                                .items(new ArrayList<>()).build();

                // Initial value
                double shippingFee = calculateShippingFee(shop.getAddress(), address, detail.getShippingType());
                double detailTotal = 0.0;
                double discountDeal = 0.0;
                double discountCoupon = 0.0;
                double discountValue = 0.0;
                double discountShipping = 0.0;
                int detailQuantity = 0;

                // Process each item in detail
                for (CartItemRequest item : items) {
                        // Book validation
                        Book book = books.get(item.getId());
                        if (book == null || !book.getShop().getId().equals(shop.getId())) {
                                if (isCheckout)
                                        throw new ResourceNotFoundException("Product not found!",
                                                        "Không tìm thấy sản phẩm yêu cầu!");

                                // Create temp item
                                var orderItem = OrderItem.builder()
                                                .book(Book.builder().id(item.getId()).build())
                                                .build();

                                orderDetail.addOrderItem(orderItem);
                                continue; // Skip other steps
                        }

                        // Stocks validation
                        short quantity = item.getQuantity();
                        if (quantity < 1 || quantity > book.getAmount()) {
                                throw new HttpResponseException(HttpStatus.CONFLICT, "Product out of stock!",
                                                "Sản phẩm không đủ số lượng!");
                        }

                        // Calculate deal (for DTO result only ~ ~)
                        double deal = book.getPrice() * book.getDiscount().doubleValue();
                        detailQuantity += quantity;
                        detailTotal += book.getPrice() * quantity;
                        discountDeal += deal * quantity;

                        // Decrease stock on checkout
                        if (isCheckout) {
                                bookRepo.decreaseStock(book.getId(), quantity);
                        }

                        // Add item into new detail
                        orderDetail.addOrderItem(OrderItem.builder()
                                        .price(book.getPrice())
                                        .discount(book.getDiscount())
                                        .book(book)
                                        .quantity(quantity)
                                        .build());
                }

                // Check coupon
                ICoupon shopCoupon = detail.getCoupon() == null ? null // Null => User not select any coupon
                                : coupons.containsKey(detail.getCoupon()) ? coupons.get(detail.getCoupon())
                                                : couponRepo.recommendCoupon(shop.getId(), detailTotal - discountDeal,
                                                                detailQuantity)
                                                                .orElse(null);

                // Validate + apply coupon
                if (shopCoupon != null
                                && shopCoupon.getCoupon().getShop().getId().equals(shop.getId())
                                && !couponService.isExpired(shopCoupon.getCoupon())) {
                        CouponDiscountDTO discountFromCoupon = couponService.applyCoupon(shopCoupon.getCoupon(),
                                        new CartStateRequest(detailTotal - discountDeal, shippingFee, detailQuantity,
                                                        shop.getId()),
                                        user);

                        // Apply coupon
                        if (couponRepo.hasUserUsedCoupon(shopCoupon.getCoupon().getId(), user.getId())) {
                                shopCoupon.getCoupon().setIsUsed(true);

                                if (isCheckout) {
                                        throw new HttpResponseException(
                                                        HttpStatus.CONFLICT,
                                                        "Coupon expired!",
                                                        "Mã coupon " + detail.getCoupon() + " đã qua sử dụng!");
                                }
                        }

                        // Appliable coupon
                        if (discountFromCoupon != null) {
                                // Decrease usage on checkout
                                if (isCheckout) {
                                        couponRepo.decreaseUsage(shopCoupon.getCoupon().getId());
                                }
                                shopCoupon.getCoupon().setIsUsable(true); // Mark usable to map DTO result
                                discountCoupon = discountFromCoupon.discountValue();
                                discountShipping = discountFromCoupon.discountShipping();
                        } else if (isCheckout) {
                                throw new HttpResponseException(
                                                HttpStatus.CONFLICT,
                                                "Invalid coupon!",
                                                "Không thể sử dụng mã coupon " + detail.getCoupon() + "!");
                        }
                }

                // Add discount deal & discount coupon
                discountValue += (discountDeal + discountCoupon);

                // Free
                if (discountValue >= detailTotal)
                        discountValue = detailTotal;
                if (discountShipping >= shippingFee)
                        discountShipping = shippingFee;

                // Set detail value
                orderDetail.setTotalPrice(detailTotal);
                orderDetail.setShippingFee(shippingFee);
                orderDetail.setDealDiscount(discountDeal);
                orderDetail.setDiscount(discountValue);
                orderDetail.setCouponDiscount(discountCoupon);
                orderDetail.setShippingDiscount(discountShipping);
                orderDetail.setTotalQuantity(detailQuantity);
                orderDetail.setShippingType(detail.getShippingType());
                orderDetail.setNote(detail.getNote());

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
                double shippingFee = !(destination == null || origin == null) ? distanceCalculation(origin, destination)
                                : 10000;
                if (type != null)
                        shippingFee = shippingFee * type.getMultiplier().doubleValue();
                return shippingFee;
        }

        // Mock for now
        private double distanceCalculation(Address origin,
                        Address destination) {

                double baseFee = 10000;
                return baseFee;
                // if (destination == null) return baseFee;
                //
                // // Mock shipping fee calculation based on address hash codes
                // // Using hash codes ensures consistent results for same addresses
                // int originHash = origin.hashCode();
                // int destHash = destination.hashCode();
                //
                // // Add variation based on address differences
                // double distanceFactor = Math.abs(originHash - destHash) % 50000;
                //
                // // Ensure minimum fee of 20000 and maximum of 100000
                // return Math.min(100000, Math.max(baseFee, baseFee + distanceFactor));
        }

        // Check valid role function
        protected boolean isAuthAdmin() {
                Authentication auth = SecurityContextHolder.getContext().getAuthentication(); // Get current auth
                return (auth != null && auth.getAuthorities().stream()
                                .anyMatch(a -> a.getAuthority().equals(UserRole.ROLE_ADMIN.toString())));
        }

        // Check valid role function
        protected boolean isOwnerValid(Shop shop,
                        Account user) {
                Authentication auth = SecurityContextHolder.getContext().getAuthentication(); // Get current auth
                boolean isAdmin = (auth != null && auth.getAuthorities().stream()
                                .anyMatch(a -> a.getAuthority().equals(UserRole.ROLE_ADMIN.toString())));
                // Check if is admin or valid owner id
                return shop.getOwner().getId().equals(user.getId()) || isAdmin;
        }

        protected boolean isUserValid(OrderReceipt receipt,
                        Account user) {
                Authentication auth = SecurityContextHolder.getContext().getAuthentication(); // Get current auth
                boolean isAdmin = (auth != null && auth.getAuthorities().stream()
                                .anyMatch(a -> a.getAuthority().equals(UserRole.ROLE_ADMIN.toString())));
                // Check if is admin or valid owner id
                return receipt.getUser().getId().equals(user.getId()) || isAdmin;
        }
}
