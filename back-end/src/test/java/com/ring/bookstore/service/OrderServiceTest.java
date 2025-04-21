package com.ring.bookstore.service;

import com.ring.bookstore.base.AbstractServiceTest;
import com.ring.bookstore.exception.EntityOwnershipException;
import com.ring.bookstore.exception.HttpResponseException;
import com.ring.bookstore.exception.ResourceNotFoundException;
import com.ring.bookstore.model.dto.projection.orders.*;
import com.ring.bookstore.model.dto.projection.coupons.ICoupon;
import com.ring.bookstore.model.dto.projection.dashboard.IStat;
import com.ring.bookstore.model.dto.request.*;
import com.ring.bookstore.model.dto.response.dashboard.ChartDTO;
import com.ring.bookstore.model.dto.response.dashboard.StatDTO;
import com.ring.bookstore.model.dto.response.orders.*;
import com.ring.bookstore.model.entity.*;
import com.ring.bookstore.model.enums.OrderStatus;
import com.ring.bookstore.model.enums.PaymentType;
import com.ring.bookstore.model.enums.ShippingType;
import com.ring.bookstore.model.enums.UserRole;
import com.ring.bookstore.model.mappers.CalculateMapper;
import com.ring.bookstore.model.mappers.CouponMapper;
import com.ring.bookstore.model.mappers.DashboardMapper;
import com.ring.bookstore.model.mappers.OrderMapper;
import com.ring.bookstore.repository.*;
import com.ring.bookstore.service.impl.OrderServiceImpl;

import jakarta.servlet.http.HttpServletRequest;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

public class OrderServiceTest extends AbstractServiceTest {

//        @Mock
//        private OrderReceiptRepository orderRepo;
//
//        @Mock
//        private OrderDetailRepository detailRepo;
//
//        @Mock
//        private OrderItemRepository itemRepo;
//
//        @Mock
//        private BookRepository bookRepo;
//
//        @Mock
//        private ShopRepository shopRepo;
//
//        @Mock
//        private CouponRepository couponRepo;
//
//        @Mock
//        private AddressRepository addressRepo;
//
//        @Mock
//        private CouponService couponService;
//
//        @Mock
//        private CaptchaService captchaService;
//
//        @Mock
//        private OrderMapper orderMapper;
//
//        @Mock
//        private CalculateMapper calculateMapper;
//
//        @Mock
//        private DashboardMapper dashMapper;
//
//        @Mock
//        private CouponMapper couponMapper;
//
//        @Mock
//        private ApplicationEventPublisher eventPublisher;
//
//        @InjectMocks
//        private OrderServiceImpl orderService;
//
//        private static final Role role = Role.builder()
//                        .roleName(UserRole.ROLE_ADMIN)
//                        .build();
//        private static Account account = Account.builder()
//                        .id(1L)
//                        .username("test")
//                        .email("test@example.com")
//                        .roles(List.of(role))
//                        .build();
//        private static Address address = Address.builder()
//                        .id(1L)
//                        .name("Test Address")
//                        .companyName("Test Company")
//                        .phone("0123456789")
//                        .city("Test City")
//                        .address("Test Street")
//                        .build();
//        private static Shop shop = Shop.builder()
//                        .id(1L)
//                        .name("Test Shop")
//                        .address(address)
//                        .owner(account)
//                        .build();
//        private static Book book = Book.builder()
//                        .id(1L)
//                        .title("Test Book")
//                        .price(100.0)
//                        .amount((short) 10)
//                        .discount(BigDecimal.valueOf(0.1))
//                        .shop(shop)
//                        .build();
//        private static OrderItem orderItem = OrderItem.builder()
//                        .id(1L)
//                        .book(book)
//                        .price(book.getPrice())
//                        .discount(book.getDiscount())
//                        .quantity((short) 1)
//                        .build();
//        private static OrderDetail orderDetail = OrderDetail.builder()
//                        .id(1L)
//                        .shop(shop)
//                        .status(OrderStatus.PENDING)
//                        .totalPrice(100.0)
//                        .shippingFee(10.0)
//                        .discount(10.0)
//                        .shippingDiscount(1.0)
//                        .totalQuantity(1)
//                        .items(List.of(orderItem))
//                        .build();
//        private static final OrderReceipt orderReceipt = OrderReceipt.builder()
//                        .id(1L)
//                        .user(account)
//                        .email(account.getEmail())
//                        .address(address)
//                        .shippingType(ShippingType.STANDARD)
//                        .total(110.0)
//                        .productsPrice(100.0)
//                        .shippingFee(10.0)
//                        .totalDiscount(11.0)
//                        .details(List.of(orderDetail))
//                        .build();
//        private CartDetailRequest cartDetail = CartDetailRequest.builder()
//                        .shopId(1L)
//                        .items(List.of(CartItemRequest.builder()
//                                        .id(1L)
//                                        .quantity((short) 1)
//                                        .build()))
//                        .build();
//        private OrderRequest request = OrderRequest.builder()
//                        .cart(List.of(cartDetail))
//                        .address(AddressRequest.builder()
//                                        .name("Test Address")
//                                        .companyName("Test Company")
//                                        .phone("0123456789")
//                                        .city("Test City")
//                                        .address("Test Street")
//                                        .build())
//                        .shippingType(ShippingType.STANDARD)
//                        .paymentMethod(PaymentType.CASH)
//                        .message("Test message")
//                        .build();
//
//        @BeforeAll
//        public static void setUp() {
//                orderItem.setDetail(orderDetail);
//                orderDetail.setOrder(orderReceipt);
//                orderReceipt.setLastModifiedDate(LocalDateTime.now().minusMonths(1));
//        }
//
//        @AfterEach
//        public void cleanUp() {
//                orderDetail.setStatus(OrderStatus.PENDING);
//                orderReceipt.setLastModifiedDate(LocalDateTime.now().minusMonths(1));
//                book.setAmount((short) 10);
//                account = Account.builder()
//                                .id(1L)
//                                .username("test")
//                                .email("test@example.com")
//                                .roles(List.of(role))
//                                .build();
//                SecurityContextHolder.clearContext();
//        }
//
//        @Test
//        public void whenCalculate_ThenReturnsCalculateDTO() {
//
//                // Given
//                CalculateRequest request = CalculateRequest.builder()
//                                .cart(List.of(cartDetail))
//                                .address(AddressRequest.builder()
//                                                .name("Test Address")
//                                                .companyName("Test Company")
//                                                .phone("0123456789")
//                                                .city("Test City")
//                                                .address("Test Street")
//                                                .build())
//                                .shippingType(ShippingType.STANDARD)
//                                .build();
//
//                // When
//                when(shopRepo.findShopsInIds(anyList())).thenReturn(List.of(shop));
//                when(bookRepo.findBooksInIds(anyList())).thenReturn(List.of(book));
//                when(couponRepo.findCouponInCodes(anyList())).thenReturn(new ArrayList<>());
//                when(calculateMapper.orderToDTO(any(OrderReceipt.class))).thenReturn(mock(CalculateDTO.class));
//
//                // Then
//                CalculateDTO result = orderService.calculate(request, account);
//
//                assertNotNull(result);
//
//                // Verify
//                verify(shopRepo, times(1)).findShopsInIds(anyList());
//                verify(bookRepo, times(1)).findBooksInIds(anyList());
//                verify(couponRepo, times(1)).findCouponInCodes(anyList());
//                verify(calculateMapper, times(1)).orderToDTO(any(OrderReceipt.class));
//        }
//
//        @Test
//        public void whenCheckout_ThenReturnsReceiptDTO() {
//
//                // Given
//                ReceiptDTO expected = ReceiptDTO.builder()
//                                .id(1L)
//                                .build();
//                HttpServletRequest httpRequest = mock(HttpServletRequest.class);
//
//                // When
//                when(httpRequest.getHeader("response")).thenReturn("valid-token");
//                when(httpRequest.getHeader("source")).thenReturn("web");
//                when(shopRepo.findShopsInIds(anyList())).thenReturn(List.of(shop));
//                when(bookRepo.findBooksInIds(anyList())).thenReturn(List.of(book));
//                when(couponRepo.findCouponInCodes(anyList())).thenReturn(new ArrayList<>());
//                when(addressRepo.save(any(Address.class))).thenReturn(address);
//                when(orderRepo.save(any(OrderReceipt.class))).thenReturn(orderReceipt);
//                when(orderMapper.orderToDTO(any(OrderReceipt.class))).thenReturn(expected);
//                doNothing().when(eventPublisher).publishEvent(any());
//
//                // Then
//                ReceiptDTO result = orderService.checkout(request, httpRequest, account);
//
//                assertNotNull(result);
//
//                // Verify
//                verify(captchaService, times(1)).validate(anyString(), anyString(), anyString());
//                verify(shopRepo, times(1)).findShopsInIds(anyList());
//                verify(bookRepo, times(1)).findBooksInIds(anyList());
//                verify(couponRepo, times(1)).findCouponInCodes(anyList());
//                verify(addressRepo, times(1)).save(any(Address.class));
//                verify(orderRepo, times(1)).save(any(OrderReceipt.class));
//                verify(orderMapper, times(1)).orderToDTO(any(OrderReceipt.class));
//                verify(eventPublisher, times(1)).publishEvent(any());
//        }
//
//        @Test
//        public void whenCheckoutWithUsedCoupon_ThenThrowsException() {
//
//                // Given
//                OrderRequest request = OrderRequest.builder()
//                                .cart(List.of(cartDetail))
//                                .address(AddressRequest.builder()
//                                                .name("Test Address")
//                                                .companyName("Test Company")
//                                                .phone("0123456789")
//                                                .city("Test City")
//                                                .address("Test Street")
//                                                .build())
//                                .shippingType(ShippingType.STANDARD)
//                                .paymentMethod(PaymentType.CASH)
//                                .message("Test message")
//                                .coupon("TEST")
//                                .build();
//                ICoupon projection = mock(ICoupon.class);
//                Coupon coupon = Coupon.builder().id(1L).code("TEST").build();
//                HttpServletRequest httpRequest = mock(HttpServletRequest.class);
//
//                // When
//                when(httpRequest.getHeader("response")).thenReturn("valid-token");
//                when(httpRequest.getHeader("source")).thenReturn("web");
//                when(shopRepo.findShopsInIds(anyList())).thenReturn(List.of(shop));
//                when(bookRepo.findBooksInIds(anyList())).thenReturn(List.of(book));
//                when(couponRepo.findCouponInCodes(anyList())).thenReturn(List.of(projection));
//                when(projection.getCoupon()).thenReturn(coupon);
//                when(couponRepo.hasUserUsedCoupon(anyLong(), anyLong())).thenReturn(true);
//
//                // Then
//                HttpResponseException exception = assertThrows(HttpResponseException.class,
//                                () -> orderService.checkout(request, httpRequest, account));
//                assertEquals("Coupon expired!", exception.getError());
//
//                // Verify
//                verify(captchaService, times(1)).validate(anyString(), anyString(),
//                                anyString());
//                verify(shopRepo, times(1)).findShopsInIds(anyList());
//                verify(bookRepo, times(1)).findBooksInIds(anyList());
//                verify(couponRepo, times(1)).findCouponInCodes(anyList());
//                verify(couponRepo, times(1)).hasUserUsedCoupon(anyLong(), anyLong());
//                verify(addressRepo, times(1)).save(any(Address.class));
//                verify(orderRepo, never()).save(any(OrderReceipt.class));
//                verify(orderMapper, never()).orderToDTO(any(OrderReceipt.class));
//                verify(eventPublisher, never()).publishEvent(any());
//        }
//
//        @Test
//        public void whenCheckoutWithInvalidCoupon_ThenThrowsException() {
//
//                // Given
//                OrderRequest request = OrderRequest.builder()
//                                .cart(List.of(cartDetail))
//                                .address(AddressRequest.builder()
//                                                .name("Test Address")
//                                                .companyName("Test Company")
//                                                .phone("0123456789")
//                                                .city("Test City")
//                                                .address("Test Street")
//                                                .build())
//                                .shippingType(ShippingType.STANDARD)
//                                .paymentMethod(PaymentType.CASH)
//                                .message("Test message")
//                                .coupon("TEST")
//                                .build();
//                ICoupon projection = mock(ICoupon.class);
//                Coupon coupon = Coupon.builder().id(1L).code("TEST").build();
//                HttpServletRequest httpRequest = mock(HttpServletRequest.class);
//
//                // When
//                when(httpRequest.getHeader("response")).thenReturn("valid-token");
//                when(httpRequest.getHeader("source")).thenReturn("web");
//                when(shopRepo.findShopsInIds(anyList())).thenReturn(List.of(shop));
//                when(bookRepo.findBooksInIds(anyList())).thenReturn(List.of(book));
//                when(couponRepo.findCouponInCodes(anyList())).thenReturn(List.of(projection));
//                when(projection.getCoupon()).thenReturn(coupon);
//                when(couponRepo.hasUserUsedCoupon(anyLong(), anyLong())).thenReturn(false);
//                when(couponService.applyCoupon(any(Coupon.class),
//                                any(CartStateRequest.class), any(Account.class)))
//                                .thenReturn(null);
//
//                // Then
//                HttpResponseException exception = assertThrows(HttpResponseException.class,
//                                () -> orderService.checkout(request, httpRequest, account));
//                assertEquals("Invalid coupon!", exception.getError());
//
//                // Verify
//                verify(captchaService, times(1)).validate(anyString(), anyString(),
//                                anyString());
//                verify(shopRepo, times(1)).findShopsInIds(anyList());
//                verify(bookRepo, times(1)).findBooksInIds(anyList());
//                verify(couponRepo, times(1)).findCouponInCodes(anyList());
//                verify(couponRepo, times(1)).hasUserUsedCoupon(anyLong(), anyLong());
//                verify(couponService, times(1)).applyCoupon(any(Coupon.class),
//                                any(CartStateRequest.class),
//                                any(Account.class));
//                verify(addressRepo, times(1)).save(any(Address.class));
//                verify(orderRepo, never()).save(any(OrderReceipt.class));
//                verify(orderMapper, never()).orderToDTO(any(OrderReceipt.class));
//                verify(eventPublisher, never()).publishEvent(any());
//        }
//
//        @Test
//        public void whenCheckoutWithNonExistingShop_ThenThrowsException() {
//
//                // Given
//                HttpServletRequest httpRequest = mock(HttpServletRequest.class);
//
//                // When
//                when(httpRequest.getHeader("response")).thenReturn("valid-token");
//                when(httpRequest.getHeader("source")).thenReturn("web");
//                when(shopRepo.findShopsInIds(anyList())).thenReturn(new ArrayList<>());
//                when(bookRepo.findBooksInIds(anyList())).thenReturn(List.of(book));
//                when(couponRepo.findCouponInCodes(anyList())).thenReturn(new ArrayList<>());
//
//                // Then
//                ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class,
//                                () -> orderService.checkout(request, httpRequest, account));
//                assertEquals("Shop not found!", exception.getError());
//
//                // Verify
//                verify(captchaService, times(1)).validate(anyString(), anyString(),
//                                anyString());
//                verify(shopRepo, times(1)).findShopsInIds(anyList());
//                verify(bookRepo, times(1)).findBooksInIds(anyList());
//                verify(couponRepo, times(1)).findCouponInCodes(anyList());
//                verify(addressRepo, times(1)).save(any(Address.class));
//                verify(orderRepo, never()).save(any(OrderReceipt.class));
//                verify(orderMapper, never()).orderToDTO(any(OrderReceipt.class));
//                verify(eventPublisher, never()).publishEvent(any());
//        }
//
//        @Test
//        public void whenCheckoutWithNonExistingBook_ThenThrowsException() {
//
//                // Given
//                HttpServletRequest httpRequest = mock(HttpServletRequest.class);
//
//                // When
//                when(httpRequest.getHeader("response")).thenReturn("valid-token");
//                when(httpRequest.getHeader("source")).thenReturn("web");
//                when(shopRepo.findShopsInIds(anyList())).thenReturn(List.of(shop));
//                when(bookRepo.findBooksInIds(anyList())).thenReturn(new ArrayList<>());
//                when(couponRepo.findCouponInCodes(anyList())).thenReturn(new ArrayList<>());
//
//                // Then
//                ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class,
//                                () -> orderService.checkout(request, httpRequest, account));
//                assertEquals("Product not found!", exception.getError());
//
//                // Verify
//                verify(captchaService, times(1)).validate(anyString(), anyString(),
//                                anyString());
//                verify(shopRepo, times(1)).findShopsInIds(anyList());
//                verify(bookRepo, times(1)).findBooksInIds(anyList());
//                verify(couponRepo, times(1)).findCouponInCodes(anyList());
//                verify(addressRepo, times(1)).save(any(Address.class));
//                verify(orderRepo, never()).save(any(OrderReceipt.class));
//                verify(orderMapper, never()).orderToDTO(any(OrderReceipt.class));
//                verify(eventPublisher, never()).publishEvent(any());
//        }
//
//        @Test
//        public void whenCheckoutWithOutOfStock_ThenThrowsException() {
//
//                // Given
//                book.setAmount((short) 0);
//                HttpServletRequest httpRequest = mock(HttpServletRequest.class);
//
//                // When
//                when(httpRequest.getHeader("response")).thenReturn("valid-token");
//                when(httpRequest.getHeader("source")).thenReturn("web");
//                when(shopRepo.findShopsInIds(anyList())).thenReturn(List.of(shop));
//                when(bookRepo.findBooksInIds(anyList())).thenReturn(List.of(book));
//                when(couponRepo.findCouponInCodes(anyList())).thenReturn(new ArrayList<>());
//
//                // Then
//                HttpResponseException exception = assertThrows(HttpResponseException.class,
//                                () -> orderService.checkout(request, httpRequest, account));
//                assertEquals("Product out of stock!", exception.getError());
//
//                // Verify
//                verify(captchaService, times(1)).validate(anyString(), anyString(),
//                                anyString());
//                verify(shopRepo, times(1)).findShopsInIds(anyList());
//                verify(bookRepo, times(1)).findBooksInIds(anyList());
//                verify(couponRepo, times(1)).findCouponInCodes(anyList());
//                verify(addressRepo, times(1)).save(any(Address.class));
//                verify(orderRepo, never()).save(any(OrderReceipt.class));
//                verify(orderMapper, never()).orderToDTO(any(OrderReceipt.class));
//                verify(eventPublisher, never()).publishEvent(any());
//        }
//
//        @Test
//        public void whenCheckoutWithUsedShopCoupon_ThenThrowsException() {
//
//                // Given
//                CartDetailRequest cartDetail = CartDetailRequest.builder()
//                                .shopId(1L)
//                                .coupon("TEST")
//                                .items(List.of(CartItemRequest.builder()
//                                                .id(1L)
//                                                .quantity((short) 1)
//                                                .build()))
//                                .build();
//                OrderRequest request = OrderRequest.builder()
//                                .cart(List.of(cartDetail))
//                                .address(AddressRequest.builder()
//                                                .name("Test Address")
//                                                .companyName("Test Company")
//                                                .phone("0123456789")
//                                                .city("Test City")
//                                                .address("Test Street")
//                                                .build())
//                                .shippingType(ShippingType.STANDARD)
//                                .paymentMethod(PaymentType.CASH)
//                                .message("Test message")
//                                .build();
//                ICoupon projection = mock(ICoupon.class);
//                Coupon coupon = Coupon.builder().id(1L).shop(shop).code("TEST").build();
//                HttpServletRequest httpRequest = mock(HttpServletRequest.class);
//
//                // When
//                when(httpRequest.getHeader("response")).thenReturn("valid-token");
//                when(httpRequest.getHeader("source")).thenReturn("web");
//                when(shopRepo.findShopsInIds(anyList())).thenReturn(List.of(shop));
//                when(bookRepo.findBooksInIds(anyList())).thenReturn(List.of(book));
//                when(couponRepo.findCouponInCodes(anyList())).thenReturn(List.of(projection));
//                when(projection.getCoupon()).thenReturn(coupon);
//                when(couponRepo.hasUserUsedCoupon(anyLong(), anyLong())).thenReturn(true);
//
//                // Then
//                HttpResponseException exception = assertThrows(HttpResponseException.class,
//                                () -> orderService.checkout(request, httpRequest, account));
//                assertEquals("Coupon expired!", exception.getError());
//
//                // Verify
//                verify(captchaService, times(1)).validate(anyString(), anyString(),
//                                anyString());
//                verify(shopRepo, times(1)).findShopsInIds(anyList());
//                verify(bookRepo, times(1)).findBooksInIds(anyList());
//                verify(couponRepo, times(1)).findCouponInCodes(anyList());
//                verify(couponRepo, times(1)).hasUserUsedCoupon(anyLong(), anyLong());
//                verify(addressRepo, times(1)).save(any(Address.class));
//                verify(orderRepo, never()).save(any(OrderReceipt.class));
//                verify(orderMapper, never()).orderToDTO(any(OrderReceipt.class));
//                verify(eventPublisher, never()).publishEvent(any());
//        }
//
//        @Test
//        public void whenCheckoutWithInvalidShopCoupon_ThenThrowsException() {
//
//                // Given
//                CartDetailRequest cartDetail = CartDetailRequest.builder()
//                                .shopId(1L)
//                                .coupon("TEST")
//                                .items(List.of(CartItemRequest.builder()
//                                                .id(1L)
//                                                .quantity((short) 1)
//                                                .build()))
//                                .build();
//                OrderRequest request = OrderRequest.builder()
//                                .cart(List.of(cartDetail))
//                                .address(AddressRequest.builder()
//                                                .name("Test Address")
//                                                .companyName("Test Company")
//                                                .phone("0123456789")
//                                                .city("Test City")
//                                                .address("Test Street")
//                                                .build())
//                                .shippingType(ShippingType.STANDARD)
//                                .paymentMethod(PaymentType.CASH)
//                                .message("Test message")
//                                .build();
//                ICoupon projection = mock(ICoupon.class);
//                Coupon coupon = Coupon.builder().id(1L).shop(shop).code("TEST").build();
//                HttpServletRequest httpRequest = mock(HttpServletRequest.class);
//
//                // When
//                when(httpRequest.getHeader("response")).thenReturn("valid-token");
//                when(httpRequest.getHeader("source")).thenReturn("web");
//                when(shopRepo.findShopsInIds(anyList())).thenReturn(List.of(shop));
//                when(bookRepo.findBooksInIds(anyList())).thenReturn(List.of(book));
//                when(couponRepo.findCouponInCodes(anyList())).thenReturn(List.of(projection));
//                when(projection.getCoupon()).thenReturn(coupon);
//                when(couponRepo.hasUserUsedCoupon(anyLong(), anyLong())).thenReturn(false);
//                when(couponService.applyCoupon(any(Coupon.class),
//                                any(CartStateRequest.class), any(Account.class)))
//                                .thenReturn(null);
//
//                // Then
//                HttpResponseException exception = assertThrows(HttpResponseException.class,
//                                () -> orderService.checkout(request, httpRequest, account));
//                assertEquals("Invalid coupon!", exception.getError());
//
//                // Verify
//                verify(captchaService, times(1)).validate(anyString(), anyString(),
//                                anyString());
//                verify(shopRepo, times(1)).findShopsInIds(anyList());
//                verify(bookRepo, times(1)).findBooksInIds(anyList());
//                verify(couponRepo, times(1)).findCouponInCodes(anyList());
//                verify(couponRepo, times(1)).hasUserUsedCoupon(anyLong(), anyLong());
//                verify(couponService, times(1)).applyCoupon(any(Coupon.class),
//                                any(CartStateRequest.class),
//                                any(Account.class));
//                verify(addressRepo, times(1)).save(any(Address.class));
//                verify(orderRepo, never()).save(any(OrderReceipt.class));
//                verify(orderMapper, never()).orderToDTO(any(OrderReceipt.class));
//                verify(eventPublisher, never()).publishEvent(any());
//        }
//
//        @Test
//        public void whenCancelOrder_ThenSuccess() {
//
//                // Given
//                setupSecurityContext(account);
//
//                // When
//                when(detailRepo.findDetailById(anyLong())).thenReturn(Optional.of(orderDetail));
//                when(detailRepo.save(any(OrderDetail.class))).thenReturn(orderDetail);
//                when(orderRepo.save(any(OrderReceipt.class))).thenReturn(orderReceipt);
//
//                // Then
//                orderService.cancel(1L, "Test reason", account);
//
//                // Verify
//                verify(detailRepo, times(1)).findDetailById(anyLong());
//                verify(detailRepo, times(1)).save(any(OrderDetail.class));
//                verify(orderRepo, times(1)).save(any(OrderReceipt.class));
//        }
//
//        @Test
//        public void whenCancelNonExistingOrder_ThenThrowsException() {
//
//                // When
//                when(detailRepo.findDetailById(anyLong())).thenReturn(Optional.empty());
//
//                // Then
//                ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class,
//                                () -> orderService.cancel(1L, "Test reason", account));
//                assertEquals("Order detail not found!", exception.getError());
//
//                // Verify
//                verify(detailRepo, times(1)).findDetailById(anyLong());
//                verify(detailRepo, never()).save(any(OrderDetail.class));
//                verify(orderRepo, never()).save(any(OrderReceipt.class));
//        }
//
//        @Test
//        public void whenCancelSomeoneElseOrder_ThenThrowsException() {
//
//                // Given
//                Account altAccount = Account.builder()
//                                .id(2L)
//                                .roles(List.of(Role.builder().roleName(UserRole.ROLE_SELLER).build()))
//                                .build();
//                setupSecurityContext(altAccount);
//
//                // When
//                when(detailRepo.findDetailById(anyLong())).thenReturn(Optional.of(orderDetail));
//
//                // Then
//                EntityOwnershipException exception = assertThrows(EntityOwnershipException.class,
//                                () -> orderService.cancel(1L, "Test reason", altAccount));
//                assertEquals("Invalid user!", exception.getError());
//
//                // Verify
//                verify(detailRepo, times(1)).findDetailById(anyLong());
//                verify(detailRepo, never()).save(any(OrderDetail.class));
//                verify(orderRepo, never()).save(any(OrderReceipt.class));
//        }
//
//        @Test
//        public void whenCancelInvalidStatusOrder_ThenThrowsException() {
//
//                // Given
//                setupSecurityContext(account);
//                orderDetail.setStatus(OrderStatus.COMPLETED);
//
//                // When
//                when(detailRepo.findDetailById(anyLong())).thenReturn(Optional.of(orderDetail));
//
//                // Then
//                HttpResponseException exception = assertThrows(HttpResponseException.class,
//                                () -> orderService.cancel(1L, "Test reason", account));
//                assertEquals("Invalid order status!", exception.getError());
//                assertEquals(HttpStatus.BAD_REQUEST, exception.getStatus());
//
//                // Verify
//                verify(detailRepo, times(1)).findDetailById(anyLong());
//                verify(detailRepo, never()).save(any(OrderDetail.class));
//                verify(orderRepo, never()).save(any(OrderReceipt.class));
//        }
//
//        @Test
//        public void whenRefundOrder_ThenSuccess() {
//
//                // Given
//                setupSecurityContext(account);
//                orderDetail.setStatus(OrderStatus.COMPLETED);
//
//                // When
//                when(detailRepo.findDetailById(anyLong())).thenReturn(Optional.of(orderDetail));
//                when(detailRepo.save(any(OrderDetail.class))).thenReturn(orderDetail);
//
//                // Then
//                orderService.refund(1L, "Test reason", account);
//
//                // Verify
//                verify(detailRepo, times(1)).findDetailById(anyLong());
//                verify(detailRepo, times(1)).save(any(OrderDetail.class));
//        }
//
//        @Test
//        public void whenRefundNonExistingOrder_ThenThrowsException() {
//
//                // When
//                when(detailRepo.findDetailById(anyLong())).thenReturn(Optional.empty());
//
//                // Then
//                ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class,
//                                () -> orderService.refund(1L, "Test reason", account));
//                assertEquals("Order detail not found!", exception.getError());
//
//                // Verify
//                verify(detailRepo, times(1)).findDetailById(anyLong());
//                verify(detailRepo, never()).save(any(OrderDetail.class));
//        }
//
//        @Test
//        public void whenRefundSomeoneElseOrder_ThenThrowsException() {
//
//                // Given
//                Account altAccount = Account.builder()
//                                .id(2L)
//                                .roles(List.of(Role.builder().roleName(UserRole.ROLE_SELLER).build()))
//                                .build();
//                setupSecurityContext(altAccount);
//
//                // When
//                when(detailRepo.findDetailById(anyLong())).thenReturn(Optional.of(orderDetail));
//
//                // Then
//                EntityOwnershipException exception = assertThrows(EntityOwnershipException.class,
//                                () -> orderService.refund(1L, "Test reason", altAccount));
//                assertEquals("Invalid user!", exception.getError());
//
//                // Verify
//                verify(detailRepo, times(1)).findDetailById(anyLong());
//                verify(detailRepo, never()).save(any(OrderDetail.class));
//        }
//
//        @Test
//        public void whenRefundInvalidStatusOrder_ThenThrowsException() {
//
//                // Given
//                setupSecurityContext(account);
//
//                // When
//                when(detailRepo.findDetailById(anyLong())).thenReturn(Optional.of(orderDetail));
//
//                // Then
//                HttpResponseException exception = assertThrows(HttpResponseException.class,
//                                () -> orderService.refund(1L, "Test reason", account));
//                assertEquals("Invalid order status!", exception.getError());
//                assertEquals(HttpStatus.BAD_REQUEST, exception.getStatus());
//
//                // Verify
//                verify(detailRepo, times(1)).findDetailById(anyLong());
//                verify(detailRepo, never()).save(any(OrderDetail.class));
//        }
//
//        @Test
//        public void whenRefundInvalidDate_ThenThrowsException() {
//
//                // Given
//                setupSecurityContext(account);
//                orderDetail.setStatus(OrderStatus.COMPLETED);
//                orderReceipt.setLastModifiedDate(LocalDateTime.now().plusMonths(1));
//
//                // When
//                when(detailRepo.findDetailById(anyLong())).thenReturn(Optional.of(orderDetail));
//
//                // Then
//                HttpResponseException exception = assertThrows(HttpResponseException.class,
//                                () -> orderService.refund(1L, "Test reason", account));
//                assertEquals("Invalid date!", exception.getError());
//                assertEquals(HttpStatus.BAD_REQUEST, exception.getStatus());
//
//                // Verify
//                verify(detailRepo, times(1)).findDetailById(anyLong());
//                verify(detailRepo, never()).save(any(OrderDetail.class));
//        }
//
//        @Test
//        public void whenConfirmOrder_ThenSuccess() {
//
//                // Given
//                setupSecurityContext(account);
//
//                // When
//                when(detailRepo.findDetailById(anyLong())).thenReturn(Optional.of(orderDetail));
//                when(detailRepo.save(any(OrderDetail.class))).thenReturn(orderDetail);
//
//                // Then
//                orderService.confirm(1L, account);
//
//                // Verify
//                verify(detailRepo, times(1)).findDetailById(anyLong());
//                verify(detailRepo, times(1)).save(any(OrderDetail.class));
//        }
//
//        @Test
//        public void whenConfirmNonExistingOrder_ThenThrowsException() {
//
//                // When
//                when(detailRepo.findDetailById(anyLong())).thenReturn(Optional.empty());
//
//                // Then
//                ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class,
//                                () -> orderService.confirm(1L, account));
//                assertEquals("Order detail not found!", exception.getError());
//
//                // Verify
//                verify(detailRepo, times(1)).findDetailById(anyLong());
//                verify(detailRepo, never()).save(any(OrderDetail.class));
//        }
//
//        @Test
//        public void whenConfirmSomeoneElseOrder_ThenThrowsException() {
//
//                // Given
//                Account altAccount = Account.builder()
//                                .id(2L)
//                                .roles(List.of(Role.builder().roleName(UserRole.ROLE_SELLER).build()))
//                                .build();
//                setupSecurityContext(altAccount);
//
//                // When
//                when(detailRepo.findDetailById(anyLong())).thenReturn(Optional.of(orderDetail));
//
//                // Then
//                EntityOwnershipException exception = assertThrows(EntityOwnershipException.class,
//                                () -> orderService.confirm(1L, altAccount));
//                assertEquals("Invalid user!", exception.getError());
//
//                // Verify
//                verify(detailRepo, times(1)).findDetailById(anyLong());
//                verify(detailRepo, never()).save(any(OrderDetail.class));
//        }
//
//        @Test
//        public void whenConfirmInvalidStatusOrder_ThenThrowsException() {
//
//                // Given
//                setupSecurityContext(account);
//                orderDetail.setStatus(OrderStatus.COMPLETED);
//
//                // When
//                when(detailRepo.findDetailById(anyLong())).thenReturn(Optional.of(orderDetail));
//
//                // Then
//                HttpResponseException exception = assertThrows(HttpResponseException.class,
//                                () -> orderService.confirm(1L, account));
//                assertEquals("Invalid order status!", exception.getError());
//                assertEquals(HttpStatus.BAD_REQUEST, exception.getStatus());
//
//                // Verify
//                verify(detailRepo, times(1)).findDetailById(anyLong());
//                verify(detailRepo, never()).save(any(OrderDetail.class));
//        }
//
//        @Test
//        public void whenChangeStatus_ThenSuccess() {
//
//                // Given
//                setupSecurityContext(account);
//
//                // When
//                when(detailRepo.findDetailById(anyLong())).thenReturn(Optional.of(orderDetail));
//                when(detailRepo.save(any(OrderDetail.class))).thenReturn(orderDetail);
//                when(orderRepo.save(any(OrderReceipt.class))).thenReturn(orderReceipt);
//
//                // Then
//                orderService.changeStatus(1L, OrderStatus.REFUNDED, account);
//
//                // Verify
//                verify(detailRepo, times(1)).findDetailById(anyLong());
//                verify(detailRepo, times(1)).save(any(OrderDetail.class));
//                verify(orderRepo, times(1)).save(any(OrderReceipt.class));
//        }
//
//        @Test
//        public void whenChangeStatusNonExistingOrder_ThenThrowsException() {
//
//                // When
//                when(detailRepo.findDetailById(anyLong())).thenReturn(Optional.empty());
//
//                // Then
//                ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class,
//                                () -> orderService.changeStatus(1L, OrderStatus.SHIPPING, account));
//                assertEquals("Order detail not found!", exception.getError());
//
//                // Verify
//                verify(detailRepo, times(1)).findDetailById(anyLong());
//                verify(detailRepo, never()).save(any(OrderDetail.class));
//                verify(orderRepo, never()).save(any(OrderReceipt.class));
//        }
//
//        @Test
//        public void whenChangeStatusOtherShopOrder_ThenThrowsException() {
//
//                // Given
//                Account altAccount = Account.builder()
//                                .id(2L)
//                                .roles(List.of(Role.builder().roleName(UserRole.ROLE_SELLER).build()))
//                                .build();
//                setupSecurityContext(altAccount);
//
//                // When
//                when(detailRepo.findDetailById(anyLong())).thenReturn(Optional.of(orderDetail));
//
//                // Then
//                EntityOwnershipException exception = assertThrows(EntityOwnershipException.class,
//                                () -> orderService.changeStatus(1L, OrderStatus.SHIPPING, altAccount));
//                assertEquals("Invalid ownership!", exception.getError());
//
//                // Verify
//                verify(detailRepo, times(1)).findDetailById(anyLong());
//                verify(detailRepo, never()).save(any(OrderDetail.class));
//                verify(orderRepo, never()).save(any(OrderReceipt.class));
//        }
//
//        @Test
//        public void whenGetAllReceipts_ThenReturnsPage() {
//
//                // Given
//                setupSecurityContext(account);
//                Pageable pageable = PageRequest.of(0, 10, Sort.by("id").descending());
//                IOrder projection = mock(IOrder.class);
//                Page<Long> pagedIds = new PageImpl<>(List.of(1L), pageable, 1);
//                List<IOrder> detailsList = new ArrayList<>(List.of(projection));
//                List<ReceiptDTO> expectedDTOS = List.of(mock(ReceiptDTO.class));
//
//                // When
//                when(orderRepo.findAllIds(eq(1L),
//                                isNull(),
//                                eq(OrderStatus.PENDING),
//                                eq(""),
//                                any(Pageable.class))).thenReturn(pagedIds);
//                when(detailRepo.findAllByReceiptIds(anyList())).thenReturn(detailsList);
//                when(orderMapper.detailsToReceiptDTOS(anyList())).thenReturn(expectedDTOS);
//
//                // Then
//                Page<ReceiptDTO> result = orderService.getAllReceipts(account,
//                                1L,
//                                OrderStatus.PENDING,
//                                "",
//                                0,
//                                10,
//                                "id",
//                                "desc");
//
//                assertNotNull(result);
//                assertEquals(expectedDTOS.size(), result.getContent().size());
//
//                // Verify
//                verify(orderRepo, times(1)).findAllIds(eq(1L),
//                                isNull(),
//                                eq(OrderStatus.PENDING),
//                                eq(""),
//                                any(Pageable.class));
//                verify(detailRepo, times(1)).findAllByReceiptIds(anyList());
//                verify(orderMapper, times(1)).detailsToReceiptDTOS(anyList());
//        }
//
//        @Test
//        public void whenGetSummariesWithFilter_ThenReturnsPage() {
//
//                // Given
//                setupSecurityContext(account);
//                Pageable pageable = PageRequest.of(0, 10, Sort.by("id").descending());
//                IReceiptSummary projection = mock(IReceiptSummary.class);
//                Page<IReceiptSummary> page = new PageImpl<>(List.of(projection), pageable,
//                                1);
//                Page<ReceiptSummaryDTO> expectedDTOS = new PageImpl<>(List.of(mock(ReceiptSummaryDTO.class)), pageable,
//                                1);
//
//                // When
//                when(orderRepo.findAllSummaries(eq(1L),
//                                isNull(),
//                                eq(1L),
//                                any(Pageable.class))).thenReturn(page);
//                when(orderMapper.summaryToDTO(any(IReceiptSummary.class))).thenReturn(mock(ReceiptSummaryDTO.class));
//
//                // Then
//                Page<ReceiptSummaryDTO> result = orderService.getSummariesWithFilter(account,
//                                1L,
//                                1L,
//                                0,
//                                10,
//                                "id",
//                                "desc");
//
//                assertNotNull(result);
//                assertEquals(expectedDTOS.getNumber(), result.getNumber());
//                assertEquals(expectedDTOS.getSize(), result.getSize());
//                assertEquals(expectedDTOS.getTotalElements(), result.getTotalElements());
//
//                // Verify
//                verify(orderRepo, times(1)).findAllSummaries(eq(1L),
//                                isNull(),
//                                eq(1L),
//                                any(Pageable.class));
//                verify(orderMapper, times(1)).summaryToDTO(any(IReceiptSummary.class));
//        }
//
//        @Test
//        public void whenGetSummariesWithFilterOtherShop_ThenThrowsException() {
//
//                // Given
//                Account altAccount = Account.builder()
//                                .id(2L)
//                                .roles(List.of(Role.builder().roleName(UserRole.ROLE_SELLER).build()))
//                                .build();
//                setupSecurityContext(altAccount);
//
//                // When
//                when(orderRepo.findAllSummaries(eq(1L),
//                                eq(2L),
//                                eq(1L),
//                                any(Pageable.class))).thenReturn(null);
//
//                // Then
//                EntityOwnershipException exception = assertThrows(EntityOwnershipException.class,
//                                () -> orderService.getSummariesWithFilter(altAccount,
//                                                1L,
//                                                1L,
//                                                0,
//                                                10,
//                                                "id",
//                                                "desc"));
//                assertEquals("Invalid role!", exception.getError());
//
//                // Verify
//                verify(orderRepo, times(1)).findAllSummaries(eq(1L),
//                                eq(2L),
//                                eq(1L),
//                                any(Pageable.class));
//                verify(orderMapper, never()).summaryToDTO(any(IReceiptSummary.class));
//        }
//
//        @Test
//        public void whenGetOrdersByBookId_ThenReturnsPage() {
//
//                // Given
//                Pageable pageable = PageRequest.of(0, 10, Sort.by("id").descending());
//                IOrderItem projection = mock(IOrderItem.class);
//                Page<Long> pagedIds = new PageImpl<>(List.of(1L), pageable, 1);
//                List<IOrderItem> itemsList = new ArrayList<>(List.of(projection));
//                List<OrderDTO> expectedDTOS = List.of(mock(OrderDTO.class));
//
//                // When
//                when(detailRepo.findAllIdsByBookId(anyLong(),
//                                any(Pageable.class))).thenReturn(pagedIds);
//                when(itemRepo.findAllWithDetailIds(anyList())).thenReturn(itemsList);
//                when(orderMapper.itemsToDetailDTO(anyList())).thenReturn(expectedDTOS);
//
//                // Then
//                Page<OrderDTO> result = orderService.getOrdersByBookId(1L,
//                                0,
//                                10,
//                                "id",
//                                "desc");
//
//                assertNotNull(result);
//                assertEquals(expectedDTOS.size(), result.getContent().size());
//
//                // Verify
//                verify(detailRepo, times(1)).findAllIdsByBookId(anyLong(),
//                                any(Pageable.class));
//                verify(itemRepo, times(1)).findAllWithDetailIds(anyList());
//                verify(orderMapper, times(1)).itemsToDetailDTO(anyList());
//        }
//
//        @Test
//        public void whenGetOrdersByUser_ThenReturnsPage() {
//
//                // Given
//                Pageable pageable = PageRequest.of(0, 10);
//                IOrderItem projection = mock(IOrderItem.class);
//                Page<Long> pagedIds = new PageImpl<>(List.of(1L), pageable, 1);
//                List<IOrderItem> itemsList = List.of(projection);
//                List<OrderDTO> expectedDTOS = List.of(mock(OrderDTO.class));
//
//                // When
//                when(detailRepo.findAllIdsByUserId(anyLong(), any(), anyString(),
//                                any(Pageable.class)))
//                                .thenReturn(pagedIds);
//                when(itemRepo.findAllWithDetailIds(anyList())).thenReturn(itemsList);
//                when(orderMapper.itemsToDetailDTO(anyList())).thenReturn(expectedDTOS);
//
//                // Then
//                Page<OrderDTO> result = orderService.getOrdersByUser(account,
//                                OrderStatus.PENDING, "", 0, 10);
//
//                assertNotNull(result);
//                assertEquals(expectedDTOS.size(), result.getContent().size());
//
//                // Verify
//                verify(detailRepo, times(1)).findAllIdsByUserId(anyLong(), any(),
//                                anyString(), any(Pageable.class));
//                verify(itemRepo, times(1)).findAllWithDetailIds(anyList());
//                verify(orderMapper, times(1)).itemsToDetailDTO(anyList());
//        }
//
//        @Test
//        public void whenGetReceipt_ThenReturnsReceiptDTO() {
//
//                // Given
//                ReceiptDTO expected = mock(ReceiptDTO.class);
//
//                // When
//                when(orderRepo.findById(anyLong())).thenReturn(Optional.of(orderReceipt));
//                when(orderMapper.orderToDTO(any(OrderReceipt.class))).thenReturn(expected);
//
//                // Then
//                ReceiptDTO result = orderService.getReceipt(1L);
//
//                assertNotNull(result);
//                assertEquals(expected, result);
//
//                // Verify
//                verify(orderRepo, times(1)).findById(anyLong());
//                verify(orderMapper, times(1)).orderToDTO(any(OrderReceipt.class));
//        }
//
//        @Test
//        public void whenGetNonExistingReceipt_ThenThrowsException() {
//
//                // When
//                when(orderRepo.findById(anyLong())).thenReturn(Optional.empty());
//
//                // Then
//                ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class,
//                                () -> orderService.getReceipt(1L));
//                assertEquals("Order not found!", exception.getError());
//
//                // Verify
//                verify(orderRepo, times(1)).findById(anyLong());
//                verify(orderMapper, never()).orderToDTO(any(OrderReceipt.class));
//        }
//
//        @Test
//        public void whenGetOrderDetail_ThenReturnsOrderDetailDTO() {
//
//                // Given
//                setupSecurityContext(account);
//                IOrderDetail projection = mock(IOrderDetail.class);
//                List<IOrderDetail> itemsList = List.of(projection);
//                OrderDetailDTO expected = mock(OrderDetailDTO.class);
//
//                // When
//                when(itemRepo.findOrderDetailItems(eq(1L), isNull())).thenReturn(itemsList);
//                when(orderMapper.detailItemsToDTO(anyList())).thenReturn(expected);
//
//                // Then
//                OrderDetailDTO result = orderService.getOrderDetail(1L, account);
//
//                assertNotNull(result);
//                assertEquals(expected, result);
//
//                // Verify
//                verify(itemRepo, times(1)).findOrderDetailItems(eq(1L), isNull());
//                verify(orderMapper, times(1)).detailItemsToDTO(anyList());
//        }
//
//        @Test
//        public void whenGetNonExistingOrderDetail_ThenThrowsException() {
//
//                // Given
//                setupSecurityContext(account);
//
//                // When
//                when(itemRepo.findOrderDetailItems(eq(1L), isNull())).thenReturn(new ArrayList<>());
//
//                // Then
//                ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class,
//                                () -> orderService.getOrderDetail(1L, account));
//                assertEquals("Order detail not found!", exception.getError());
//
//                // Verify
//                verify(itemRepo, times(1)).findOrderDetailItems(eq(1L), isNull());
//                verify(orderMapper, never()).detailItemsToDTO(anyList());
//        }
//
//        @Test
//        public void whenGetAnalytics_ThenReturnsStatDTO() {
//
//                // Given
//                setupSecurityContext(account);
//                StatDTO expected = mock(StatDTO.class);
//
//                // When
//                when(orderRepo.getSalesAnalytics(eq(1L),
//                                isNull())).thenReturn(mock(IStat.class));
//                when(dashMapper.statToDTO(any(IStat.class), anyString(),
//                                anyString())).thenReturn(expected);
//
//                // Then
//                StatDTO result = orderService.getAnalytics(account, 1L);
//
//                assertNotNull(result);
//                assertEquals(expected, result);
//
//                // Verify
//                verify(orderRepo, times(1)).getSalesAnalytics(eq(1L), isNull());
//                verify(dashMapper, times(1)).statToDTO(any(IStat.class), anyString(),
//                                anyString());
//        }
//
//        @Test
//        public void whenGetMonthlySales_ThenReturnsChartDTOList() {
//
//                // Given
//                setupSecurityContext(account);
//                Map<String, Object> data = new HashMap<>();
//                List<Map<String, Object>> dataList = List.of(data);
//                List<ChartDTO> expected = List.of(mock(ChartDTO.class));
//
//                // When
//                when(orderRepo.getMonthlySales(eq(1L), isNull(),
//                                eq(2024))).thenReturn(dataList);
//                when(dashMapper.dataToChartDTO(data)).thenReturn(mock(ChartDTO.class));
//
//                // Then
//                List<ChartDTO> result = orderService.getMonthlySales(account, 1L, 2024);
//
//                assertNotNull(result);
//                assertEquals(expected.size(), result.size());
//
//                // Verify
//                verify(orderRepo, times(1)).getMonthlySales(eq(1L), isNull(), eq(2024));
//                verify(dashMapper, times(1)).dataToChartDTO(data);
//        }
}