package com.ring.bookstore.repository;

import com.ring.bookstore.enums.CouponType;
import com.ring.bookstore.model.Coupon;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface CouponRepository extends JpaRepository<Coupon, Long> {

    @Query("""
	select c from Coupon c join fetch CouponDetail cd
	where c.code ilike %:keyword%
	and (coalesce(:type) is null or cd.type = :type)
	and (coalesce(:shopId) is null or c.shop.id = :shopId)
	and (coalesce(:byShop) is null or case when :byShop = true then c.shop.id is not null else c.shop.id is null end)
	group by c.id
	""")
    Page<Coupon> findCouponByFilter(CouponType type, String keyword, Long shopId, Boolean byShop, Pageable pageable);

	@Query("""
	select c.id from Coupon c join CouponDetail cd on c.id = cd.coupon.id 
	where c.code ilike %:keyword%
	and (coalesce(:type) is null or cd.type = :type)
	and (coalesce(:shopId) is null or c.shop.id = :shopId)
	and (coalesce(:byShop) is null or case when :byShop = true then c.shop.id is not null else c.shop.id is null end)
	and c.id not in :ids
	group by c.id
	""")
	List<Long> findInverseIds(CouponType type, String keyword, Long shopId, Boolean byShop, List<Long> ids);

    Optional<Coupon> findByCode(String code);
}
