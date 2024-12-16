package com.ring.bookstore.repository;

import com.ring.bookstore.enums.CouponType;
import com.ring.bookstore.model.Coupon;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface CouponRepository extends JpaRepository<Coupon, Long> {

    @Query("""
		select c from Coupon c join fetch c.detail cd
		where (coalesce(:showExpired) is null or (cd.expDate > current date and cd.usage > 0))
		and (coalesce(:keyword) is null or c.code = :keyword)
		and (coalesce(:types) is null or cd.type in :types)
		and (coalesce(:shopId) is null or c.shop.id = :shopId)
		and (coalesce(:byShop) is null or case when :byShop = true
			then c.shop.id is not null else c.shop.id is null end)
		group by c.id, cd.id
	""")
    Page<Coupon> findCouponByFilter(List<CouponType> types, String keyword, Long shopId,
									Boolean byShop, Boolean showExpired, Pageable pageable);

	@Query("""
		select c.id from Coupon c join c.detail cd 
		where (coalesce(:showExpired) is null or (cd.expDate > current date and cd.usage > 0))
		and (coalesce(:keyword) is null or c.code = :keyword)
		and (coalesce(:types) is null or cd.type in :types)
		and (coalesce(:shopId) is null or c.shop.id = :shopId)
		and (coalesce(:byShop) is null or case when :byShop = true 
			then c.shop.id is not null else c.shop.id is null end)
		and c.id not in :ids
		group by c.id, cd.id
	""")
	List<Long> findInverseIds(List<CouponType> types, String keyword, Long shopId,
							  Boolean byShop, Boolean showExpired, List<Long> ids);


	@Query("""
		select c from Coupon c join fetch c.detail cd
		join (
			select c2.id as id, c2.shop.id as shopId,
			row_number() over (partition by c2.shop.id order by c2.shop.id) as rn
			from Coupon c2 join c2.detail cd
			where (cd.expDate > current date and cd.usage > 0)
				and c2.shop.id in :shopIds or c2.shop.id is null
		) t on c.id = t.id and t.rn = 1
		order by c.detail.attribute asc, c.detail.discount desc, c.detail.maxDiscount desc
	""")
	List<Coupon> recommendCoupons(List<Long> shopIds);

	@Query("""
		select c from Coupon c join fetch c.detail cd
        where c.code in :codes
	""")
	List<Coupon> findCouponInCodes(List<String> codes);

	@Query("""
		select c from Coupon c join fetch c.detail cd
		where (cd.expDate > current date and cd.usage > 0)
		and (case when coalesce(:shopId) is null then c.shop.id is null else c.shop.id = :shopId end)
		and (coalesce(:value) is null or (cd.type in (com.ring.bookstore.enums.CouponType.MIN_VALUE, 
				com.ring.bookstore.enums.CouponType.SHIPPING) and cd.attribute < :value)
			or (coalesce(:quantity) is null 
				or (cd.type = com.ring.bookstore.enums.CouponType.MIN_AMOUNT and cd.attribute < :quantity))) 
		group by c.shop.id, c.id, cd.id, cd.attribute, cd.discount, cd.maxDiscount
		order by cd.attribute asc, cd.discount desc, cd.maxDiscount desc
		limit 1
	""")
	Optional<Coupon> recommendCoupon(Long shopId, Double value, Integer quantity);

	@Query("""
		select c from Coupon c join fetch c.detail cd
		where c.code = :code
	""")
    Optional<Coupon> findCouponByCode(String code);

	@Query("""
		select c from Coupon c join fetch c.detail cd
		where c.id = :id
	""")
	Optional<Coupon> findCouponById(Long id);

	@Modifying
	@Query("""
        update CouponDetail c set c.usage = c.usage - cast(1 as short) where c.coupon.id = :id
    """)
	void decreaseUsage(Long id);
}
