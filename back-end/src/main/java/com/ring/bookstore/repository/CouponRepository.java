package com.ring.bookstore.repository;

import com.ring.bookstore.dtos.projections.IShopDetail;
import com.ring.bookstore.enums.CouponType;
import com.ring.bookstore.model.Coupon;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface CouponRepository extends JpaRepository<Coupon, Long> {

    @Query("""
	select c from Coupon c join fetch CouponDetail cd
	where c.code ilike %:keyword%
	and (coalesce(:type) is null or cd.type = :type)
	and (coalesce(:shopId) is null or c.shop.id = :shopId)
	group by c.id
	""")
    Page<Coupon> findCouponByFilter(CouponType type, String keyword, Long shopId, Pageable pageable);

    Optional<Coupon> findByCode(String code);
}
