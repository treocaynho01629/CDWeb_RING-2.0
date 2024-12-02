package com.ring.bookstore.repository;

import com.ring.bookstore.model.CouponDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface CouponDetailRepository extends JpaRepository<CouponDetail, Long> {
}
