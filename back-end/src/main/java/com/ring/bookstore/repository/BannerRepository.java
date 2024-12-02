package com.ring.bookstore.repository;

import com.ring.bookstore.dtos.banners.IBanner;
import com.ring.bookstore.model.Banner;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface BannerRepository extends JpaRepository<Banner, Long> {

    @Query("""
	select b.id as id, b.shop.id as shopId, b.name as name, b.description as description, i.name as image, b.url as url 
	from Banner b join b.image i
	where concat (b.name, b.description) ilike %:keyword%
	and (coalesce(:shopId) is null or b.shop.id = :shopId)
	and (coalesce(:byShop) is null or case when :byShop = true then b.shop.id is not null else b.shop.id is null end)
	""")
    Page<IBanner> findBannerByFilter(String keyword, Long shopId, Boolean byShop, Pageable pageable);
}
