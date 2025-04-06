package com.ring.bookstore.repository;

import com.ring.bookstore.model.entity.CouponDetail;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CouponDetailRepository extends JpaRepository<CouponDetail, Long> {
}
