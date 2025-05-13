package com.ring.repository;

import com.ring.model.entity.CouponDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository interface named {@link CouponDetailRepository} for managing {@link CouponDetail} entities.
 */
@Repository
public interface CouponDetailRepository extends JpaRepository<CouponDetail, Long> {
}
