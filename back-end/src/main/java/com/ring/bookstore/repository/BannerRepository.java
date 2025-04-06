package com.ring.bookstore.repository;

import com.ring.bookstore.model.dto.projection.banners.IBanner;
import com.ring.bookstore.model.entity.Account;
import com.ring.bookstore.model.entity.Address;
import com.ring.bookstore.model.entity.Banner;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface named {@link BannerRepository} for managing {@link Banner} entities.
 */
@Repository
public interface BannerRepository extends JpaRepository<Banner, Integer> {

    /**
	 * Retrieves a paginated list of banners based on the provided search criteria.
	 *
	 * @param keyword a string used to search banners by their name or description using a case-insensitive match.
	 * @param shopId an optional shop ID to filter banners belonging to a specific shop. If null, this filter is ignored.
	 * @param byShop a boolean value specifying whether to include banners that are associated with a shop (true)
	 *               or banners not associated with any shop (false). If null, this condition is ignored.
	 * @param pageable a {@link Pageable} object to define pagination and sorting options.
	 * @return a {@link Page} containing a list of banners as {@link IBanner} projections matching the criteria.
	 */
	@Query("""
		select b.id as id, b.shop.id as shopId, b.name as name,
			b.description as description, b.url as url, i as image
		from Banner b left join b.image i
		where concat (b.name, b.description) ilike %:keyword%
		and (coalesce(:shopId) is null or b.shop.id = :shopId)
		and (coalesce(:byShop) is null or case when :byShop = true then b.shop.id is not null else b.shop.id is null end)
	""")
    Page<IBanner> findBanners(String keyword,
							  Long shopId,
							  Boolean byShop,
							  Pageable pageable);

	/**
	 * Retrieves a list of banner IDs that match the given list of IDs and belong to the specified owner.
	 *
	 * @param ids the list of banner IDs to be checked.
	 * @param ownerId the ID of the owner for whom the banners should belong.
	 * @return a list of banner IDs that satisfy the criteria, or an empty list if no match is found.
	 */
	@Query("""
		select b.id from Banner b
		where b.id in :ids
		and b.shop.owner.id = :ownerId
	""")
	List<Integer> findBannerIdsByInIdsAndOwner(List<Integer> ids,
											Long ownerId);

	/**
	 * Finds a list of banner IDs that match the specified search criteria and are not included in the provided list of IDs.
	 * The method uses query parameters to filter banners based on their name, description, associated shop, ownership,
	 * and whether they are linked to any shop.
	 *
	 * @param keyword the keyword to search for in the name and description of banners
	 * @param shopId the ID of the shop to which the banners should belong; can be null for no shop-specific filtering
	 * @param byShop a flag indicating whether to filter based on banners being associated with a shop (true) or not (false)
	 * @param userId the ID of the user who owns the shop associated with the banners; can be null for no owner-specific filtering
	 * @param ids a list of IDs to exclude from the search results
	 * @return a list of banner IDs that meet the filtering criteria
	 */
	@Query("""
		select b.id from Banner b left join b.shop s
		where concat (b.name, b.description) ilike %:keyword%
		and (coalesce(:shopId) is null or s.id = :shopId)
		and (coalesce(:byShop) is null or case when :byShop = true then s.id is not null else s.id is null end)
		and (coalesce(:userId) is null or s.owner.id = :userId)
		and b.id not in :ids
		group by b.id
	""")
	List<Integer> findInverseIds(String keyword,
							  Long shopId,
							  Boolean byShop,
							  Long userId,
							  List<Integer> ids);

	/**
	 * Deletes all {@link Banner} entities associated with the specified shop ID.
	 *
	 * @param shopId the ID of the shop whose banners are to be deleted
	 */
	void deleteAllByShopId(Long shopId);

	/**
	 * Deletes all {@link Banner} entities associated with the shop owned by the specified shop owner.
	 *
	 * @param owner the {@link Account} representing the owner of the shops whose banners should be deleted
	 */
	void deleteAllByShop_Owner(Account owner);

	/**
	 * Deletes all {@link Banner} entities that belong to a specific shop and are associated with a specific shop owner.
	 *
	 * @param shopId the ID of the shop whose banners are to be deleted
	 * @param owner the account of the shop owner associated with the shop
	 */
	void deleteAllByShopIdAndShop_Owner(Long shopId, Account owner);
}
