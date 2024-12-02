package com.ring.bookstore.repository;

import com.ring.bookstore.dtos.shops.IShopDetail;
import com.ring.bookstore.model.Shop;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ShopRepository extends JpaRepository<Shop, Long> {

    @Query("""
	select s.owner.username as ownerUsername, s.owner.id as ownerId, s.id as id, s.name as name, s.description as description,
	 i.name as image, s.createdDate as joinedDate, count(r.id) as totalReviews, 
	 count(b.id) as totalProducts, size(s.followers) as totalFollowers 
	from Shop s left join Image i on i.id = s.image.id
	left join Book b on s.id = b.shop.id
	left join Review r on b.id = r.book.id
	where concat (s.name, s.owner.username) ilike %:keyword%
	and (coalesce(:ownerId) is null or s.owner.id = :ownerId)
	group by s.id, s.owner.username, s.owner.id, i.id
	""")
    Page<IShopDetail> findShopByFilter(String keyword, Long ownerId, Pageable pageable);

	@Query("""
		select s from Shop s
        where s.id in :ids
	""")
	List<Shop> findShopsInIds(List<Long> ids);

	@Query("""
	select s.id from Shop s
	where concat (s.name, s.owner.username) ilike %:keyword%
	and (coalesce(:ownerId) is null or s.owner.id = :ownerId)
	and s.id not in :ids
	group by s.id
	""")
	List<Long> findInverseIds(String keyword, Long ownerId, List<Long> ids);

	@Query("""
	select s.owner.username as ownerUsername, s.owner.id as ownerId,  s.id as id, 
		s.name as name, s.description as description, i.name as image, s.createdDate as joinedDate, 
		count(r.id) as totalReviews, count(b.id) as totalProducts, size(s.followers) as totalFollowers,
		case when f.id is null then false else true end as followed
	from Shop s left join Image i on i.id = s.image.id
	left join s.followers f on f.id = :userId
	left join Book b on s.id = b.shop.id
	left join Review r on b.id = r.book.id
	where s.id = :id
	group by s.id, s.owner.username, s.owner.id, i.id, f.id
	""")
    Optional<IShopDetail> findShopById(Long id, Long userId);
}
