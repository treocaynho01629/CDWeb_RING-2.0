package com.ring.bookstore.repository;

import com.ring.bookstore.dtos.dashboard.IStat;
import com.ring.bookstore.dtos.shops.*;
import com.ring.bookstore.model.Account;
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
            	select s.owner.id as ownerId, s.id as id, s.name as name, i.name as image,
            	count(r.id) as totalReviews, count(b.id) as totalProducts, size(s.followers) as totalFollowers,
            	s.createdDate as joinedDate, case when f.id is null then false else true end as followed
            	from Shop s
            	left join s.image i
            	left join s.followers f on f.id = :userId
            	left join s.books b
            	left join b.bookReviews r
            	where concat (s.name, s.owner.username) ilike %:keyword%
            	and (coalesce(:followed) is null or case when :followed = true
                       		then f.id is not null else f.id is null end)
            	group by s.id, s.owner.id, i.name, f.id
            """)
    Page<IShopDisplay> findShopsDisplay(String keyword,
										Boolean followed,
										Long userId,
										Pageable pageable);

	@Query("""
		select s.owner.username as username, s.owner.id as ownerId, s.id as id,
		s.name as name, i.name as image, size(s.followers) as totalFollowers, s.createdDate as joinedDate,
		sum(case when od.status = com.ring.bookstore.enums.OrderStatus.COMPLETED
			then o.total - o.totalDiscount else 0 end) as sales,
		sum(case when od.status = com.ring.bookstore.enums.OrderStatus.COMPLETED
			then oi.quantity else 0 end) as totalSold
		from Shop s
		left join s.image i
		left join OrderDetail od on od.shop.id = s.id
		left join od.order o
		left join od.items oi
		where concat (s.name, s.owner.username) ilike %:keyword%
		and (coalesce(:userId) is null or s.owner.id = :userId)
		group by s.id, s.owner.id, s.owner.username, i.name
	""")
	Page<IShop> findShops(String keyword,
						  Long userId,
						  Pageable pageable);

	@Query("""
		select s.id as id, s.name as name, i.name as image
		from Shop s
		left join s.image i
		where s.owner.id = :ownerId
	""")
	List<IShopPreview> findShopsPreview(Long ownerId);

	@Query("""
		select s from Shop s
        where s.id in :ids
	""")
	List<Shop> findShopsInIds(List<Long> ids);

	@Query("""
		select s.id from Shop s
		where s.id in :ids
		and s.owner.id = :ownerId
	""")
	List<Long> findShopIdsByInIdsAndOwner(List<Long> ids,
										  Long ownerId);

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

	@Query("""
		select s.owner.username as username, s.owner.id as ownerId, s.id as id,
			s.name as name, s.description as description, i.name as image, s.createdDate as joinedDate,
			count(r.id) as totalReviews, count(b.id) as totalProducts, size(s.followers) as totalFollowers,
			case when f.id is null then false else true end as followed
		from Shop s
		left join Image i on i.id = s.image.id
		left join s.followers f on f.id = :userId
		left join Book b on s.id = b.shop.id
		left join Review r on b.id = r.book.id
		where s.id = :id
		group by s.id, s.owner.username, s.owner.id, i.id, f.id
	""")
    Optional<IShopInfo> findShopInfoById(Long id,
										 Long userId);

	@Query("""
		select s.owner.username as username, s.owner.id as ownerId, s.id as id,
			s.name as name, s.description as description, i.name as image, a as address,
			sum(case when od.status = com.ring.bookstore.enums.OrderStatus.COMPLETED
				then o.total - o.totalDiscount else 0 end) as sales,
			sum(case when od.status = com.ring.bookstore.enums.OrderStatus.COMPLETED
				then oi.quantity else 0 end) as totalSold,
			count(b.id) as totalProducts, count(r.id) as totalReviews, size(s.followers) as totalFollowers, s.createdDate as joinedDate
		from Shop s left join Image i on i.id = s.image.id
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

	void deleteAllByOwner(Account owner);

	@Query("""
        select count(s.id) as total,
        count(case when s.createdDate >= date_trunc('month', current date) then 1 end) as currentMonth,
        count(case when s.createdDate >= date_trunc('month', current date) - 1 month
            and s.createdDate < date_trunc('month', current date) then 1 end) lastMonth
        from Shop s
    """)
	IStat getShopAnalytics();
}
