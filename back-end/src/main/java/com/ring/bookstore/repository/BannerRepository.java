package com.ring.bookstore.repository;

import com.ring.bookstore.dtos.banners.IBanner;
import com.ring.bookstore.model.Account;
import com.ring.bookstore.model.Banner;
import com.ring.bookstore.model.Shop;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface BannerRepository extends JpaRepository<Banner, Long> {

    @Query("""
		select b.id as id, b.shop.id as shopId, b.name as name, b.description as description, i.name as image, b.url as url 
		from Banner b left join b.image i
		where concat (b.name, b.description) ilike %:keyword%
		and (coalesce(:shopId) is null or b.shop.id = :shopId)
		and (coalesce(:byShop) is null or case when :byShop = true then b.shop.id is not null else b.shop.id is null end)
	""")
    Page<IBanner> findBanner(String keyword,
							 Long shopId,
							 Boolean byShop,
							 Pageable pageable);

	@Query("""
		select b.id from Banner b
		where b.id in :ids
		and b.shop.owner.id = :ownerId
	""")
	List<Long> findBannerIdsByInIdsAndOwner(List<Long> ids, Long ownerId);

	@Query("""
		select b.id from Banner b
		where concat (b.name, b.description) ilike %:keyword%
		and (coalesce(:shopId) is null or b.shop.id = :shopId)
		and (coalesce(:byShop) is null or case when :byShop = true then b.shop.id is not null else b.shop.id is null end)
		and (coalesce(:userId) is null or b.shop.owner.id = :userId)
		and b.id not in :ids
		group by b.id
	""")
	List<Long> findInverseIds(String keyword,
							  Long shopId,
							  Boolean byShop,
							  Long userId,
							  List<Long> ids);

	void deleteAllByShopId(Long shopId);

	void deleteAllByShop_Owner(Account owner);

	void deleteAllByShopIdAndShop_Owner(Long shopId, Account owner);
}
