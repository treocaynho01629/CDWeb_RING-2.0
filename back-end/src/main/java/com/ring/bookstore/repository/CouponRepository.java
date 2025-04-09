package com.ring.bookstore.repository;

import com.ring.bookstore.model.dto.projection.coupons.ICoupon;
import com.ring.bookstore.model.dto.projection.dashboard.IStat;
import com.ring.bookstore.model.entity.CouponDetail;
import com.ring.bookstore.model.enums.CouponType;
import com.ring.bookstore.model.entity.Account;
import com.ring.bookstore.model.entity.Coupon;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface named {@link CouponRepository} for managing {@link Coupon} entities.
 */
public interface CouponRepository extends JpaRepository<Coupon, Long> {

    /**
     * Checks whether a user has used a specific coupon.
     *
     * @param id     the identifier of the coupon
     * @param userId the identifier of the user
     * @return true if the user has used the coupon; false otherwise
     */
    @Query("""
                select case when count(*) > 0 then true else false end
                from OrderReceipt o
                join o.details od
                where (o.coupon.id = :id or od.coupon.id = :id)
                and o.user.id = :userId
            """)
    boolean hasUserUsedCoupon(Long id, Long userId);

    /**
     * Finds coupons based on the provided filter criteria. The method executes a query to retrieve
     * coupons along with associated shop names and shop images if applicable. Filters include
     * coupon types, specific codes, shop ID, and conditions like whether to include expired coupons
     * or coupons linked with shops.
     *
     * @param types a list of {@code CouponType} representing the types of coupons to filter by
     * @param codes a list of coupon codes to filter the results by
     * @param code a specific coupon code to filter the results by
     * @param shopId the ID of the shop to filter the associated coupons
     * @param userId the ID of the shop owner to filter the associated coupons
     * @param byShop a boolean flag to determine whether to include coupons linked with a shop
     * @param showExpired a boolean flag to include expired*/
    @Query("""
            	select c as coupon, s.name as shopName, i as image
                from Coupon c
                join fetch c.detail cd
                left join c.shop s
                left join s.image i
            	where (coalesce(:showExpired) is null or (cd.expDate > current date and cd.usage > 0))
            	and (coalesce(:codes) is null or c.code in :codes)
            	and (coalesce(:code) is null or c.code = :code)
            	and (coalesce(:types) is null or cd.type in :types)
            	and (coalesce(:shopId) is null or c.shop.id = :shopId)
            	and (coalesce(:userId) is null or c.shop.owner.id = :userId)
            	and (coalesce(:byShop) is null or case when :byShop = true
            		then c.shop.id is not null else c.shop.id is null end)
            	group by c.id, cd.id, s.name, i.id
            """)
    Page<ICoupon> findCoupons(List<CouponType> types,
                              List<String> codes,
                              String code,
                              Long shopId,
                              Long userId,
                              Boolean byShop,
                              Boolean showExpired,
                              Pageable pageable);

    /**
     * Retrieves a list of coupon IDs based on the provided coupon IDs and seller's owner ID.
     * This method filters the coupon IDs that belong to the specified seller.
     *
     * @param ids a list of coupon IDs to filter.
     * @param ownerId the ID of the seller (shop owner) to filter the coupons by.
     * @return a list of coupon IDs that match the criteria.
     */
    @Query("""
                select c.id from Coupon c
                where c.id in :ids
                and c.shop.owner.id = :ownerId
            """)
    List<Long> findCouponIdsByInIdsAndSeller(List<Long> ids, Long ownerId);

    /**
     * Retrieves a list of coupon IDs that do not match the specified criteria.
     *
     * @param types        The list of {@code CouponType} to filter by, or {@code null} to ignore this filter.
     * @param codes        The list of coupon codes to filter by, or {@code null} to ignore this filter.
     * @param code         A specific coupon code to filter by, or {@code null} to ignore this filter.
     * @param shopId       The ID of the shop to filter by, or {@code null} to ignore this filter.
     * @param byShop       A {@code Boolean} determining whether to*/
    @Query("""
            	select c.id from Coupon c join c.detail cd
            	where (coalesce(:showExpired) is null or (cd.expDate > current date and cd.usage > 0))
                and (coalesce(:codes) is null or c.code in :codes)
            	and (coalesce(:code) is null or c.code = :code)
            	and (coalesce(:types) is null or cd.type in :types)
            	and (coalesce(:shopId) is null or c.shop.id = :shopId)
                and (coalesce(:userId) is null or c.shop.owner.id = :userId)
            	and (coalesce(:byShop) is null or case when :byShop = true
            		then c.shop.id is not null else c.shop.id is null end)
            	and c.id not in :ids
            	group by c.id, cd.id
            """)
    List<Long> findInverseIds(List<CouponType> types,
                              List<String> codes,
                              String code,
                              Long shopId,
                              Long userId,
                              Boolean byShop,
                              Boolean showExpired,
                              List<Long> ids);

    /**
     * Recommends a list of coupons based on the provided shop IDs. The method
     * retrieves the top-ranked coupon for each shop based on various criteria
     * such as expiration date, usage conditions, and discount attributes.
     *
     * @param shopIds the list of shop IDs for which coupons are to be recommended;
     *                can include null to retrieve coupons not associated with any shop
     * @return a list of recommended coupons, where each entry includes the coupon,
     *         the associated*/
    @Query("""
            	select c as coupon, s.name as shopName, i as image
                from Coupon c
                join fetch c.detail cd
                left join c.shop s
                left join s.image i
            	join (
            		select c2.id as id, c2.shop.id as shopId,
            		row_number() over (partition by c2.shop.id order by c2.shop.id) as rn
            		from Coupon c2 join c2.detail cd
            		where (cd.expDate > current date and cd.usage > 0)
            			and c2.shop.id in :shopIds or c2.shop.id is null
            	) t on c.id = t.id and t.rn = 1
            	order by c.detail.type asc, c.detail.attribute asc,
                        	c.detail.discount desc, c.detail.maxDiscount desc
            """)
    List<ICoupon> recommendCoupons(List<Long> shopIds);

    /**
     * Retrieves a list of coupons, along with associated shop names and shop images,
     * based on the provided codes.
     *
     * @param codes a list of coupon codes to search for
     * @return a list of ICoupon objects containing the coupon, shop name, and shop image
     */
    @Query("""
               select c as coupon, s.name as shopName, i as image
               from Coupon c
               join fetch c.detail cd
               left join c.shop s
               left join s.image i
               where c.code in :codes
            """)
    List<ICoupon> findCouponInCodes(List<String> codes);

    /**
     * Recommends a suitable coupon based on the provided parameters such as shop ID, value, and quantity.
     * The method fetches a coupon meeting the specified conditions, including availability, expiration,
     * and attribute constraints, prioritizing discount attributes.
     *
     * @param shopId   the ID of the shop to filter coupons by; if null, fetches coupons not tied to a shop
     * @param value    the value threshold to filter coupons by; can be null
     * @param quantity the quantity threshold to filter coupons by; can be null
     * @return an optional containing the recommended coupon if matching criteria exists; otherwise, an empty optional
     */
    @Query("""
            	select c as coupon, s.name as shopName, i as image
                from Coupon c
                join fetch c.detail cd
                left join c.shop s
                left join s.image i
            	where (cd.expDate > current date and cd.usage > 0)
            	and (case when coalesce(:shopId) is null then c.shop.id is null else c.shop.id = :shopId end)
            	and (coalesce(:value) is null or (cd.type in (com.ring.bookstore.model.enums.CouponType.MIN_VALUE,
            			com.ring.bookstore.model.enums.CouponType.SHIPPING) and cd.attribute < :value)
            		or (coalesce(:quantity) is null
            			or (cd.type = com.ring.bookstore.model.enums.CouponType.MIN_AMOUNT and cd.attribute < :quantity)))
            	group by c.shop.id, c.id, cd.id, cd.attribute, cd.discount, cd.maxDiscount, s.name, i.id
            	order by cd.attribute asc, cd.discount desc, cd.maxDiscount desc
            	limit 1
            """)
    Optional<ICoupon> recommendCoupon(Long shopId, Double value, Integer quantity);

    /**
     * Finds a coupon by its unique code.
     * This method retrieves the coupon details, the associated shop name,
     * and the shop's linked image (if any).
     *
     * @param code The unique code of the coupon to retrieve.
     * @return An {@code Optional} containing {@code ICoupon} details including the coupon,
     *         shop name, and shop image, or an empty {@code Optional} if no coupon matches the code.
     */
    @Query("""
            	select c as coupon, s.name as shopName, i as image
                from Coupon c
                join fetch c.detail cd
                left join c.shop s
                left join s.image i
            	where c.code = :code
            """)
    Optional<ICoupon> findCouponByCode(String code);

    /**
     * Finds a Coupon by its unique identifier and retrieves associated details,
     * including the shop name and shop image, if available.
     *
     * @param id the unique identifier of the coupon to be retrieved
     * @return an {@link Optional} containing a custom projection {@link ICoupon}
     *         representing the coupon details, shop name, and shop image,
     *         or an empty {@link Optional*/
    @Query("""
            	select c as coupon, s.name as shopName, i as image
                from Coupon c
                join fetch c.detail cd
                left join c.shop s
                left join s.image i
            	where c.id = :id
            """)
    Optional<ICoupon> findCouponById(Long id);

    /**
     * Retrieves coupon analytics data for a specific shop or all shops.
     * The analytics includes the total count of coupons, the count of coupons created in the current month,
     * and the count of coupons created in the last month.
     *
     * @param shopId the ID of the shop for which the coupon analytics should be retrieved. If null, analytics
     *               for all shops will be retrieved.
     * @param userId the identifier of the shop owner which analytics is to be retrieved;
     *               if null, analytics is calculated for all owners
     *
     * @return an object implementing the {@code IStat} interface containing analytics data such as total coupons,
     *         coupons created in the current month, and coupons created in the last month.
     */
    @Query("""
                select count(c.id) as total,
                count(case when c.createdDate >= date_trunc('month', current date) then 1 end) as currentMonth,
                count(case when c.createdDate >= date_trunc('month', current date) - 1 month
                    and c.createdDate < date_trunc('month', current date) then 1 end) lastMonth
                from Coupon c
                left join c.shop s
                where (coalesce(:shopId) is null or s.id = :shopId)
                and (coalesce(:userId) is null or s.owner.id = :userId)
            """)
    IStat getCouponAnalytics(Long shopId,
                             Long userId);

    /**
     * Decreases the usage count of a coupon by 1 based on the coupon's ID.
     *
     * @param id the ID of the coupon for which the usage count needs to be decreased
     */
    @Modifying
    @Query("""
                update CouponDetail c set c.usage = c.usage - cast(1 as short) where c.coupon.id = :id
            """)
    void decreaseUsage(Long id);

    /**
     * Deletes all coupon entities associated with the specified shop ID.
     *
     * @param shopId the ID of the shop whose associated coupons should be deleted
     */
    void deleteAllByShopId(Long shopId);

    /**
     * Deletes all entities associated with the specified shop owner.
     *
     * @param owner the owner of the shop for whom all associated entities will be deleted
     */
    void deleteAllByShop_Owner(Account owner);

    /**
     * Deletes all entities associated with the given shop ID and its corresponding owner.
     *
     * @param shopId the unique identifier for the shop whose entities are to be deleted
     * @param owner the account representing the owner of the shop
     */
    void deleteAllByShopIdAndShop_Owner(Long shopId, Account owner);
}
