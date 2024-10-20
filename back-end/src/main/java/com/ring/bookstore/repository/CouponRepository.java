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
		where (coalesce(:showExpired) is null or (cd.expDate > now() and cd.usage > 0))
		and (coalesce(:keyword) is null or c.code = :keyword)
		and (coalesce(:type) is null or cd.type = :type)
		and (coalesce(:shopId) is null or c.shop.id = :shopId)
		and (coalesce(:byShop) is null or case when :byShop = true 
			then c.shop.id is not null else c.shop.id is null end)
		group by c.id, c.detail.discount
	""")
    Page<Coupon> findCouponByFilter(CouponType type, String keyword, Long shopId,
									Boolean byShop, Boolean showExpired, Pageable pageable);

	@Query("""
		select c.id from Coupon c join c.detail cd 
		where (coalesce(:showExpired) is null or (cd.expDate > now() and cd.usage > 0))
		and (coalesce(:keyword) is null or c.code = :keyword)
		and (coalesce(:type) is null or cd.type = :type)
		and (coalesce(:shopId) is null or c.shop.id = :shopId)
		and (coalesce(:byShop) is null or case when :byShop = true 
			then c.shop.id is not null else c.shop.id is null end)
		and c.id not in :ids
		group by c.id
	""")
	List<Long> findInverseIds(CouponType type, String keyword, Long shopId,
							  Boolean byShop, Boolean showExpired, List<Long> ids);

	@Query("""
		select c 
		from Coupon c
		join (
			select c.id as id, c.shop.id as shopId, 
			row_number() over (partition by c.shop.id order by c.shop.id) as rn
			from Coupon c2 join CouponDetail cd on c2.detail.id = cd.id
			where (cd.expDate > now() and cd.usage > 0)
				and c2.shop.id in :shopIds or c2.shop.id is null
		) t on c.id = t.id and t.rn = 1
		order by c.detail.discount desc
	""")
	List<Coupon> recommendCoupons(List<Long> shopIds);

	@Query("""
		select c from Coupon c join fetch CouponDetail cd
		where (cd.expDate > now() and cd.usage > 0)
		and (case when coalesce(:shopId) is null then c.shop.id is null else c.shop.id = :shopId end)
		and (coalesce(:value) is null or (cd.type in (com.ring.bookstore.enums.CouponType.MIN_VALUE, 
				com.ring.bookstore.enums.CouponType.SHIPPING) and cd.attribute < :value)
			or (coalesce(:quantity) is null 
				or (cd.type = com.ring.bookstore.enums.CouponType.MIN_AMOUNT and cd.attribute < :quantity))) 
		group by c.shop.id, c.id, cd.discount
		order by cd.discount desc
		limit 1
	""")
	Optional<Coupon> recommendCoupon(Long shopId, Double value, Integer quantity);

    Optional<Coupon> findByCode(String code);
}
