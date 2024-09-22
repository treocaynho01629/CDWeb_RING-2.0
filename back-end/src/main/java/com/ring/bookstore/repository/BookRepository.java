package com.ring.bookstore.repository;

import java.util.List;
import java.util.Optional;

import com.ring.bookstore.dtos.projections.IBookDetail;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.ring.bookstore.dtos.projections.IBookDisplay;
import com.ring.bookstore.model.Book;

@Repository
public interface BookRepository extends JpaRepository<Book, Long>{
	@Query("""
	select b.id as id, b.slug as slug, b.title as title, b.description as description, b.image.name as image,
	b.price as price, b.discount as discount, b.amount as amount, rv.rating as rating, od.totalOrders as totalOrders
	from Book b left join (select r.book.id as book_id, avg(r.rating) as rating from Review r group by r.book.id) rv on b.id = rv.book_id
	left join (select o.book.id as book_id, sum(o.amount) as totalOrders from OrderDetail o group by o.book.id) od on b.id = od.book_id
	where concat (b.title, b.author) ilike %:keyword%
	and (coalesce(:shopId) is null or b.shop.id = :shopId)
	and (coalesce(:sellerId) is null or b.shop.owner.id = :sellerId)
	and (coalesce(:cateId) is null or b.cate.id = :cateId or b.cate.parent.id = :cateId)
	and (coalesce(:pubIds) is null or b.publisher.id in :pubIds)
	and b.type like %:type%
	and b.price * (1 - b.discount) between :fromRange and :toRange
	and coalesce(rv.rating, 0) >= :rating
	and b.amount >= :amount
	group by b, b.image.name, rv.rating, od.totalOrders
	""")
	Page<IBookDisplay> findBooksWithFilter(String keyword, //Get books by filtering
			Integer cateId,
			List<Integer> pubIds,
			Long shopId,
			Long sellerId,
			String type,
			Double fromRange,
			Double toRange,
		  	Integer rating,
		  	Integer amount,
			Pageable pageable);

	@Query("""
	select distinct b as book, b.shop.id as shopId, b.image.name as image, od.totalOrders as totalOrders, rv.rating as rating, 
		rv.totalRates as totalRates, rv.five as five, rv.four as four, rv.three as three, rv.two as two, rv.one as one
	from Book b
	left join (select o.book.id as book_id, sum(o.amount) as totalOrders from OrderDetail o group by o.book.id) od on b.id = od.book_id
	left join (
		select r.book.id as book_id, avg(r.rating) as rating, count(r.id) as totalRates,
			sum(case when r.rating = 5 then 1 else 0 end) as five,
			sum(case when r.rating = 4 then 1 else 0 end) as four,
			sum(case when r.rating = 3 then 1 else 0 end) as three,
			sum(case when r.rating = 2 then 1 else 0 end) as two,
			sum(case when r.rating = 1 then 1 else 0 end) as one
		from Review r group by r.book.id
	) rv on b.id = rv.book_id
	join fetch BookDetail bd
	where b.id = :id
	group by b, b.image.name, bd, od.totalOrders, rv.rating, rv.totalRates, rv.five, rv.four, rv.three, rv.two, rv.one
	""")
	Optional<IBookDetail> findBookDetailById(Long id);

	@Query("""
	select distinct b as book, b.shop.id as shopId, b.image.name as image, od.totalOrders as totalOrders, rv.rating as rating, 
		rv.totalRates as totalRates, rv.five as five, rv.four as four, rv.three as three, rv.two as two, rv.one as one
	from Book b
	left join (select o.book.id as book_id, sum(o.amount) as totalOrders from OrderDetail o group by o.book.id) od on b.id = od.book_id
	left join (
		select r.book.id as book_id, avg(r.rating) as rating, count(r.id) as totalRates,
			sum(case when r.rating = 5 then 1 else 0 end) as five,
			sum(case when r.rating = 4 then 1 else 0 end) as four,
			sum(case when r.rating = 3 then 1 else 0 end) as three,
			sum(case when r.rating = 2 then 1 else 0 end) as two,
			sum(case when r.rating = 1 then 1 else 0 end) as one
		from Review r group by r.book.id
	) rv on b.id = rv.book_id
	join fetch BookDetail bd
	where b.slug = :slug
	group by b, b.image.name, bd, od.totalOrders, rv.rating, rv.totalRates, rv.five, rv.four, rv.three, rv.two, rv.one
	""")
	Optional<IBookDetail> findBookDetailBySlug(String slug);

	@Query("""
 	select b.id as id, b.slug as slug, b.title as title, b.description as description, b.image.name as image,
	b.price as price, b.discount as discount, b.amount as amount, rv.rating as rating, od.totalOrders as totalOrders
	from Book b left join (select r.book.id as book_id, avg(r.rating) as rating from Review r group by r.book.id) rv on b.id = rv.book_id
	left join (select o.book.id as book_id, sum(o.amount) as totalOrders from OrderDetail o group by o.book.id) od on b.id = od.book_id
	group by b, b.image.name, rv.rating, od.totalOrders
	order by random()
	limit :amount
	""")
	List<IBookDisplay> findRandomBooks(Integer amount); //Get random books

	@Query("""
 	delete from Book b where b.shop.owner.id = :id
	""")
	void deleteBySellerId(Long id);
}
