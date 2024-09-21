package com.ring.bookstore.repository;

import com.ring.bookstore.dtos.projections.IShopDetail;
import com.ring.bookstore.model.Shop;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ShopRepository extends JpaRepository<Shop, Long> {

    @Query("""
	select s.owner.username as ownerUsername, s.owner.id as ownerId, s.name as name, s.description as description,
	 s.image.name as image, s.createdDate as joinedDate, count(r.id) as totalReviews, 
	 count(b.id) as totalProducts, size(s.followers) as totalFollowers 
	from Shop s left join Book b on s.id = b.shop.id
	left join Review r on b.id = r.book.id
	where concat (s.name, s.owner.username) ilike %:keyword%
	and (coalesce(:ownerId) is null or s.owner.id = :ownerId)
	group by s.id
	""")
    public Page<IShopDetail> findShopByFilter(String keyword, Long ownerId, Pageable pageable);

	@Query("""
	select s.owner.username as ownerUsername, s.owner.id as ownerId, s.name as name, s.description as description,
	 s.image.name as image, s.createdDate as joinedDate, count(r.id) as totalReviews, 
	 count(b.id) as totalProducts, size(s.followers) as totalFollowers 
	from Shop s left join Book b on s.id = b.shop.id
	left join Review r on b.id = r.book.id
	where s.id = :id
	group by s.id
	""")
    public Optional<IShopDetail> findShopById(Long id);
}
