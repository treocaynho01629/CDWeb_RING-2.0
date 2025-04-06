package com.ring.bookstore.repository;

import com.ring.bookstore.model.enums.CouponType;
import com.ring.bookstore.model.entity.Coupon;
import com.ring.bookstore.model.entity.CouponDetail;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

@Testcontainers
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class CouponDetailRepositoryTest {

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine");

    @Autowired
    private CouponRepository couponRepo;

    @Autowired
    private CouponDetailRepository detailRepo;

    @Test
    public void givenNewCouponDetail_whenSaveCouponDetail_ThenReturnCouponDetail() {
        Coupon coupon = Coupon.builder()
                .code("TEST1")
                .build();
        coupon.setCreatedDate(LocalDateTime.now());
        couponRepo.save(coupon);

        CouponDetail detail = CouponDetail.builder()
                .usage((short) 99)
                .discount(BigDecimal.valueOf(0.5))
                .maxDiscount(1000.0)
                .attribute(2.0)
                .expDate(LocalDate.now().plusMonths(1))
                .type(CouponType.MIN_AMOUNT)
                .coupon(coupon)
                .build();
        CouponDetail savedDetail = detailRepo.save(detail);

        assertNotNull(savedDetail);
        assertNotNull(savedDetail.getId());
    }

    @Test
    public void whenUpdateBookDetail_ThenReturnUpdatedBookDetail() {
        Coupon coupon = Coupon.builder()
                .code("TEST1")
                .build();
        coupon.setCreatedDate(LocalDateTime.now());
        couponRepo.save(coupon);

        CouponDetail detail = CouponDetail.builder()
                .usage((short) 99)
                .discount(BigDecimal.valueOf(0.5))
                .maxDiscount(1000.0)
                .attribute(2.0)
                .expDate(LocalDate.now().plusMonths(1))
                .type(CouponType.MIN_AMOUNT)
                .coupon(coupon)
                .build();
        detailRepo.save(detail);

        CouponDetail foundDetail = detailRepo.findById(detail.getId()).orElse(null);
        assertNotNull(foundDetail);
        foundDetail.setAttribute(10000.0);
        foundDetail.setType(CouponType.MIN_VALUE);

        CouponDetail updatedDetail = detailRepo.save(foundDetail);

        assertNotNull(updatedDetail);
        assertEquals(10000.0, updatedDetail.getAttribute());
        assertEquals(CouponType.MIN_VALUE, updatedDetail.getType());
    }

    @Test
    public void whenDeleteBookDetail_ThenFindNull() {
        Coupon coupon = Coupon.builder()
                .code("TEST1")
                .build();
        coupon.setCreatedDate(LocalDateTime.now());
        couponRepo.save(coupon);

        CouponDetail detail = CouponDetail.builder()
                .usage((short) 99)
                .discount(BigDecimal.valueOf(0.5))
                .maxDiscount(1000.0)
                .attribute(2.0)
                .expDate(LocalDate.now().plusMonths(1))
                .type(CouponType.MIN_AMOUNT)
                .coupon(coupon)
                .build();
        detailRepo.save(detail);

        detailRepo.deleteById(detail.getId());

        CouponDetail foundDetail = detailRepo.findById(detail.getId()).orElse(null);

        assertNull(foundDetail);
    }

}