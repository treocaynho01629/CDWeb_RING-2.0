package com.ring.bookstore.repository;

import com.ring.bookstore.model.Coupon;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;


public interface CouponRepository extends JpaRepository<Coupon, Long> {
}
