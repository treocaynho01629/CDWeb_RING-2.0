package com.ring.bookstore.repository;

import com.ring.bookstore.dtos.coupons.ICoupon;
import com.ring.bookstore.dtos.dashboard.IStat;
import com.ring.bookstore.enums.CouponType;
import com.ring.bookstore.enums.OrderStatus;
import com.ring.bookstore.model.*;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import static org.junit.jupiter.api.Assertions.*;

@Testcontainers
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class CouponRepositoryTest {

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine");

    @Autowired
    private CouponRepository couponRepo;

    @Autowired
    private CouponDetailRepository detailRepo;

    @Autowired
    private ShopRepository shopRepo;

    @Autowired
    private AccountRepository accountRepo;

    @Autowired
    private OrderReceiptRepository receiptRepo;

    @Autowired
    private OrderDetailRepository orderDetailRepo;

    @PersistenceContext
    private EntityManager entityManager;

    private Coupon coupon;
    private Account account;
    private Shop shop;

    @BeforeEach
    void setUp() {
        account = Account.builder()
                .username("initial")
                .pass("asd")
                .email("initialEmail@initial.com")
                .build();
        account.setCreatedDate(LocalDateTime.now());
        Account savedAccount = accountRepo.save(account);

        shop = Shop.builder().name("shop").owner(savedAccount).build();
        shop.setCreatedDate(LocalDateTime.now());
        Shop savedShop = shopRepo.save(shop);

        coupon = Coupon.builder()
                .code("TEST1")
                .shop(savedShop)
                .build();
        Coupon coupon2 = Coupon.builder()
                .code("TEST2")
                .build();
        Coupon coupon3 =  Coupon.builder()
                .code("TEST3")
                .build();
        coupon.setCreatedDate(LocalDateTime.now().minusMonths(1));
        coupon2.setCreatedDate(LocalDateTime.now().minusMonths(1));
        coupon3.setCreatedDate(LocalDateTime.now());
        List<Coupon> coupons = List.of(coupon, coupon2, coupon3);
        couponRepo.saveAll(coupons);

        CouponDetail detail = CouponDetail.builder()
                .usage((short) 99)
                .discount(BigDecimal.valueOf(0.5))
                .maxDiscount(1000.0)
                .attribute(2.0)
                .expDate(LocalDate.now().plusMonths(1))
                .type(CouponType.MIN_AMOUNT)
                .coupon(coupon)
                .build();
        CouponDetail detail2 = CouponDetail.builder()
                .usage((short) 12)
                .discount(BigDecimal.valueOf(0.9))
                .maxDiscount(20000.0)
                .attribute(20000.0)
                .expDate(LocalDate.now().plusMonths(1))
                .type(CouponType.MIN_VALUE)
                .coupon(coupon2)
                .build();
        CouponDetail detail3 = CouponDetail.builder()
                .usage((short) 32)
                .discount(BigDecimal.valueOf(1))
                .maxDiscount(100000.0)
                .attribute(20000.0)
                .expDate(LocalDate.now().plusMonths(1))
                .type(CouponType.SHIPPING)
                .coupon(coupon3)
                .build();
        List<CouponDetail> details = List.of(detail, detail2, detail3);
        detailRepo.saveAll(details);

        OrderReceipt receipt = OrderReceipt.builder()
                .coupon(coupon)
                .user(account)
                .build();
        receipt.setCreatedDate(LocalDateTime.now());
        receiptRepo.save(receipt);

        OrderDetail orderDetail = OrderDetail.builder()
                .order(receipt)
                .status(OrderStatus.PENDING)
                .build();
        orderDetailRepo.save(orderDetail);
    }

    @Test
    public void givenNewCoupon_whenSaveCoupon_ThenReturnCoupon() {
        Coupon coupon = Coupon.builder()
                .code("DISCOUNT10")
                .build();

        Coupon savedCoupon = couponRepo.save(coupon);

        assertNotNull(savedCoupon);
        assertNotNull(savedCoupon.getId());
    }

    @Test
    public void whenUpdateCoupon_ThenReturnCoupon() {
        Coupon foundCoupon = couponRepo.findById(coupon.getId()).orElse(null);

        assertNotNull(foundCoupon);
        foundCoupon.setCode("TEST29");

        Coupon updatedCoupon = couponRepo.save(foundCoupon);

        assertNotNull(updatedCoupon);
        assertEquals("TEST29", updatedCoupon.getCode());
    }

    @Test
    public void whenDeleteCoupon_ThenFindNull() {
        couponRepo.deleteById(coupon.getId());

        Coupon foundCoupon = couponRepo.findById(coupon.getId()).orElse(null);

        assertNull(foundCoupon);
    }

    @Test
    public void whenCheckHasUserUsedCoupon_ThenReturnBoolean() {
        boolean check = couponRepo.hasUserUsedCoupon(coupon.getId(), account.getId());

        assertTrue(check);
    }

    @Test
    public void whenFindCoupons_ThenReturnCoupons() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<ICoupon> foundCoupons = couponRepo.findCoupons(
                null,
                null,
                null,
                null,
                false,
                true,
                pageable);

        assertNotNull(foundCoupons);
        assertEquals(2, foundCoupons.getContent().size());
    }

    @Test
    public void whenFindCouponIdsBySeller_ThenReturnIds() {
        List<Coupon> foundCoupons = couponRepo.findAll();
        List<Long> foundIds = foundCoupons.stream().map(Coupon::getId).collect(Collectors.toList());

        List<Long> couponIds = couponRepo.findCouponIdsByInIdsAndSeller(foundIds, account.getId());

        assertNotNull(couponIds);
        assertEquals(1, couponIds.size());
    }

    @Test
    public void whenFindInverseIds_ThenReturnIds() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<ICoupon> foundCoupons = couponRepo.findCoupons(
                null,
                null,
                null,
                null,
                null,
                true,
                pageable);
        List<Long> foundIds = foundCoupons.getContent().stream().map(projection -> projection.getCoupon().getId()).collect(Collectors.toList());
        foundIds.remove(0);

        List<Long> inverseIds = couponRepo.findInverseIds(
                null,
                null,
                null,
                null,
                null,
                true,
                null,
                foundIds);

        assertNotNull(inverseIds);
        assertEquals(foundCoupons.getTotalElements() - foundIds.size(), inverseIds.size());
    }

    @Test
    public void whenFindRecommendCoupons_ThenReturnCoupons() {
        List<ICoupon> foundCoupons = couponRepo.recommendCoupons(List.of(shop.getId()));

        assertNotNull(foundCoupons);
        assertEquals(2, foundCoupons.size());
    }

    @Test
    public void whenFindCouponsInCodes_ThenReturnCoupons() {
        List<ICoupon> foundCoupons = couponRepo.findCouponInCodes(List.of("TEST1", "TEST2"));

        assertNotNull(foundCoupons);
        assertEquals(2, foundCoupons.size());
    }

    @Test
    public void whenFindRecommendCoupon_ThenReturnCoupon() {
        ICoupon foundCoupon = couponRepo.recommendCoupon(shop.getId(), 1000000.0, 99).orElse(null);

        assertNotNull(foundCoupon);
    }

    @Test
    public void whenFindCouponByCode_ThenReturnCoupon() {
        ICoupon foundCoupon = couponRepo.findCouponByCode("TEST1").orElse(null);

        assertNotNull(foundCoupon);
        assertEquals("TEST1", foundCoupon.getCoupon().getCode());
    }

    @Test
    public void whenFindCouponById_ThenReturnCoupon() {
        ICoupon foundCoupon = couponRepo.findCouponById(coupon.getId()).orElse(null);

        assertNotNull(foundCoupon);
        assertEquals(coupon.getId(), foundCoupon.getCoupon().getId());
    }

    @Test
    public void whenGetCouponAnalytics_ThenReturnStats() {
        IStat foundData = couponRepo.getCouponAnalytics(null);

        assertNotNull(foundData);
        assertEquals(3, foundData.getTotal());
        assertEquals(2, foundData.getLastMonth());
        assertEquals(1, foundData.getCurrentMonth());
    }

    @Test
    public void whenDecreaseUsage_ThenUsageDecreases() {
        couponRepo.decreaseUsage(coupon.getId());
        entityManager.flush();
        entityManager.clear();

        Coupon foundCoupon = couponRepo.findById(coupon.getId()).orElse(null);

        assertNotNull(foundCoupon);
        assertEquals(98, (short) foundCoupon.getDetail().getUsage());
    }
}