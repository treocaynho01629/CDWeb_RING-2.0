package com.ring.bookstore.repository;

import com.ring.bookstore.model.dto.projection.dashboard.IStat;
import com.ring.bookstore.model.dto.projection.shops.*;
import com.ring.bookstore.model.entity.Account;
import com.ring.bookstore.model.entity.Shop;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface named {@link ShopRepository} for managing {@link Shop} entities.
 */
@Repository
public interface ShopRepository extends JpaRepository<Shop, Long> {

    /**
	 * Finds a pageable list of shop displays based on the specified keyword, follow status,
	 * and user ID. The method returns data such as shop information, review count, product count,
	 * follower count, status of whether the user is following the shop, and other related details.
	 *
	 * @param keyword the search string used to filter shops based on their name or owner's username.
	 * @param followed a Boolean indicating whether to filter shops the user follows (true),
	 *                 does not follow (false), or both (null).
	 * @param userId the ID of the user making the request, used to determine follow status.
	 * @param pageable the pageable object specifying pagination settings.
	 * @return a paginated list of shop displays containing information such as shop ID,
	 *         name, owner ID, total reviews, total products, total followers,
	 *         join date, follow status, and shop image.
	 */
	@Query("""
            	select s.owner.id as ownerId, s.id as id, s.name as name,
            		count(r.id) as totalReviews, count(b.id) as totalProducts,
					size(s.followers) as totalFollowers, s.createdDate as joinedDate,
					case when f.id is null then false else true end as followed, i as image
            	from Shop s
            	left join s.image i
            	left join s.followers f on f.id = :userId
            	left join s.books b
            	left join b.bookReviews r
            	where concat (s.name, s.owner.username) ilike %:keyword%
            	and (coalesce(:followed) is null or case when :followed = true
                       		then f.id is not null else f.id is null end)
            	group by s.id, s.owner.id, i.id, f.id
            """)
    Page<IShopDisplay> findShopsDisplay(String keyword,
										Boolean followed,
										Long userId,
										Pageable pageable);

	/**
	 * Retrieves a paginated list of shops based on a search keyword and optional user ID.
	 *
	 * @param keyword the search keyword used to filter shops by their name or owner's username
	 * @param userId the ID of the user to filter shops by the associated owner, or null to ignore filtering by user
	 * @param pageable the pagination and sorting information
	 * @return a page of shops containing shop details such as name, ID, owner information, followers count, created date,
	 *         sales data, and an associated image
	 */
	@Query("""
		select s.owner.username as username, s.owner.id as ownerId, s.id as id,
			s.name as name, size(s.followers) as totalFollowers, s.createdDate as joinedDate,
			i as image,
			sum(case when od.status = com.ring.bookstore.model.enums.OrderStatus.COMPLETED
				then o.total - o.totalDiscount else 0 end) as sales,
			sum(case when od.status = com.ring.bookstore.model.enums.OrderStatus.COMPLETED
				then oi.quantity else 0 end) as totalSold
		from Shop s
		left join s.image i
		left join OrderDetail od on od.shop.id = s.id
		left join od.order o
		left join od.items oi
		where concat (s.name, s.owner.username) ilike %:keyword%
		and (coalesce(:userId) is null or s.owner.id = :userId)
		group by s.id, s.owner.id, s.owner.username, i.id
	""")
	Page<IShop> findShops(String keyword,
						  Long userId,
						  Pageable pageable);

	/**
	 * Retrieves a list of shops that are owned by the specified owner, providing a preview of
	 * the shop's id, name, and an optional image.
	 *
	 * @param ownerId the id of the shop owner whose shops are to be retrieved
	 * @return a list of {@code IShopPreview} projections containing the shop id, name, and image
	 */
	@Query("""
		select s.id as id, s.name as name, i as image
		from Shop s
		left join s.image i
		where s.owner.id = :ownerId
	""")
	List<IShopPreview> findShopsPreview(Long ownerId);

	/**
	 * Retrieves a list of Shop entities whose IDs match the given list of IDs.
	 *
	 * @param ids a list of IDs to be used to retrieve matching Shop entities
	 * @return a list of Shop entities corresponding to the provided IDs
	 */
	@Query("""
		select s from Shop s
        where s.id in :ids
	""")
	List<Shop> findShopsInIds(List<Long> ids);

	/**
	 * Finds the IDs of shops that match the specified list of shop IDs and belong to a specific owner.
	 *
	 * @param ids the list of shop IDs to filter by
	 * @param ownerId the ID of the owner to filter shops by
	 * @return a list of shop IDs that satisfy the criteria
	 */
	@Query("""
		select s.id from Shop s
		where s.id in :ids
		and s.owner.id = :ownerId
	""")
	List<Long> findShopIdsByInIdsAndOwner(List<Long> ids,
										  Long ownerId);

	/**
	 * Finds the IDs of shops that do not match the specified list of IDs.
	 * This query filters shops based on a concatenated keyword in the shop name
	 * and owner's username, optionally restricts results to a specific owner, and excludes specified IDs.
	 *
	 * @param keyword the keyword to search for in the shop's name and the owner's username.
	 * @param ownerId the optional ID of the owner to restrict the shops to, can be null.
	 * @param ids the list of shop IDs to exclude from the results.
	 * @return a list of shop IDs that match the criteria but are not in the excluded list.
	 */
	@Query("""
		select s.id from Shop s
		where concat (s.name, s.owner.username) ilike %:keyword%
		and (coalesce(:ownerId) is null or s.owner.id = :ownerId)
		and s.id not in :ids
		group by s.id
	""")
	List<Long> findInverseIds(String keyword,
							  Long ownerId,
							  List<Long> ids);

	/**
	 * Retrieves shop information by its ID for a specific user.
	 * The query fetches details such as owner information, shop details,
	 * total reviews, total products, total followers, and whether the user follows the shop.
	 *
	 * @param id the ID of the shop to retrieve.
	 * @param userId the ID of the user to check the follow status for the shop.
	 * @return an {@code Optional<IShopInfo>} containing the shop information if found, or {@code Optional.empty()} if not found.
	 */
	@Query("""
		select s.owner.username as username, s.owner.id as ownerId, s.id as id,
			s.name as name, s.createdDate as joinedDate, i as image,
			count(distinct r.id) as totalReviews, count(distinct b.id) as totalProducts,
			size(s.followers) as totalFollowers,
			case when f.id is null then false else true end as followed
		from Shop s
		left join s.image i
		left join s.followers f on f.id = :userId
		left join s.books b
		left join b.bookReviews r
		where s.id = :id
		group by s.id, s.owner.username, s.owner.id, i.id, f.id
	""")
    Optional<IShopInfo> findShopInfoById(Long id,
										 Long userId);

	/**
	 * Retrieves the detailed display information of a shop based on its ID and a user's ID.
	 * The details include shop owner information, shop details, statistics, and user-specific data such as follow status.
	 *
	 * @param id    the unique identifier of the shop whose details are to be fetched.
	 * @param userId the unique identifier of the user requesting the shop details, used for determining follow status.
	 * @return an {@link Optional} containing the {@link IShopDisplayDetail} with the shop's display details if found,
	 *         or an empty {@link Optional} if no shop with the specified ID exists.
	 */
	@Query("""
		select s.owner.username as username, s.owner.id as ownerId, s.id as id,
			s.name as name, s.description as description, a as address,
			sum(case when od.status = com.ring.bookstore.model.enums.OrderStatus.COMPLETED
				then oi.quantity else 0 end) as totalSold,
			coalesce(
				sum (case when od.status = com.ring.bookstore.model.enums.OrderStatus.CANCELED
					or od.status = com.ring.bookstore.model.enums.OrderStatus.REFUNDED then 1 else 0 end)
				/ nullif(
					coalesce(
						sum(case when od.status = com.ring.bookstore.model.enums.OrderStatus.COMPLETED
					then 1 else 0 end), 0), 0), 0) as canceledRate,
			count(distinct b.id) as totalProducts, avg(r.rating) as rating, count(distinct r.id) as totalReviews,
			size(s.followers) as totalFollowers, i as image,
			s.createdDate as joinedDate, case when f.id is null then false else true end as followed
		from Shop s left join s.image i
		left join s.address a
		left join OrderDetail od on od.shop.id = s.id
		left join od.items oi
		left join s.books b
		left join b.bookReviews r
		left join s.followers f on f.id = :userId
		where s.id = :id
		group by s.id, s.owner.username, s.owner.id, i.id, a.id, f.id
	""")
	Optional<IShopDisplayDetail> findShopDisplayDetailById(Long id,
														   Long userId);

	/**
	 * Retrieves detailed information about a shop based on its ID and optionally a user ID.
	 * The method returns shop details including owner information, shop metadata, sales data,
	 * total sold products, total reviews, total followers, and other related details.
	 *
	 * @param id the unique identifier of the shop to fetch details for
	 * @param userId the optional user ID to filter results based on ownership, can be null
	 * @return an {@link Optional} containing an {@link IShopDetail} with the shop details if found, otherwise empty
	 */
	@Query("""
		select s.owner.username as username, s.owner.id as ownerId, s.id as id,
			s.name as name, s.description as description, a as address,
			sum(case when od.status = com.ring.bookstore.model.enums.OrderStatus.COMPLETED
				then o.total - o.totalDiscount else 0 end) as sales,
			sum(case when od.status = com.ring.bookstore.model.enums.OrderStatus.COMPLETED
				then oi.quantity else 0 end) as totalSold,
			count(b.id) as totalProducts, count(r.id) as totalReviews, i as image,
			size(s.followers) as totalFollowers, s.createdDate as joinedDate
		from Shop s left join s.image i
		left join s.address a
		left join OrderDetail od on od.shop.id = s.id
		left join od.order o
		left join od.items oi
		left join Book b on s.id = b.shop.id
		left join Review r on b.id = r.book.id
		where s.id = :id
		and (coalesce(:userId) is null or s.owner.id = :userId)
		group by s.id, s.owner.username, s.owner.id, i.id, a.id
	""")
	Optional<IShopDetail> findShopDetailById(Long id,
											 Long userId);

	/**
	 * Retrieves shop analytics, including the total number of shops,
	 * the number of shops created in the current month, and the number
	 * of shops created in the previous month.
	 *
	 * @param userId the identifier of the shop owner which analytics is to be retrieved;
	 *               if null, analytics is calculated for all owners
	 *
	 * @return an {@link IStat} instance containing the analytics data,
	 * including the total count of shops, the count for the current month,
	 * and the count for the previous month.
	 */
	@Query("""
        select count(s.id) as total,
        count(case when s.createdDate >= date_trunc('month', current date) then 1 end) as currentMonth,
        count(case when s.createdDate >= date_trunc('month', current date) - 1 month
            and s.createdDate < date_trunc('month', current date) then 1 end) lastMonth
        from Shop s
		where (coalesce(:userId) is null or s.owner.id = :userId)
    """)
	IStat getShopAnalytics(Long userId);

	/**
	 * Deletes all entities associated with the specified owner.
	 *
	 * @param owner the owner whose related entities are to be deleted
	 */
	void deleteAllByOwner(Account owner);
}
