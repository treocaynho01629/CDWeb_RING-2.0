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
public interface BookRepository extends JpaRepository<Book, Integer>{
	
	@Query("""
	select b.id as id, b.title as title, b.description as description, b.image.name as image,
	b.price as price, b.onSale as onSale, b.amount as amount, rv.rating as rating, od.orderTime as orderTime
	from Book b left join (select r.book.id as book_id, avg(r.rating) as rating from Review r group by r.book.id) rv on b.id = rv.book_id
	left join (select o.book.id as book_id, sum(o.amount) as orderTime from OrderDetail o group by o.book.id) od on b.id = od.book_id
	where concat (b.title, b.author) ilike %:keyword%
	and cast(b.cate.id as string) like %:cateId%
	and b.seller.userName like %:seller%
	and cast(b.publisher.id as string) not in :pubId
	and b.type like %:type%
	and b.price * (1 - b.onSale) between :fromRange and :toRange
	group by b, b.image.name, rv.rating, od.orderTime
	""")
	public Page<IBookDisplay> findBooksWithFilter(String keyword, //Get books by filtering
			String cateId, 
			String[] pubId, 
			String seller, 
			String type, 
			Double fromRange, 
			Double toRange,
			Pageable pageable);

	@Query("""
	select distinct b as book, b.image.name as image, rv.rating as rating, rv.rateTime as rateTime, od.orderTime as orderTime 
	from Book b
	left join (select r.book.id as book_id, avg(r.rating) as rating, count(r.id) as rateTime from Review r group by r.book.id) rv on b.id = rv.book_id
	left join (select o.book.id as book_id, sum(o.amount) as orderTime from OrderDetail o group by o.book.id) od on b.id = od.book_id
	join fetch BookDetail bd
	where b.id = :id
	group by b, b.image.name, bd, rv.rating, rv.rateTime, od.orderTime
	""")
	public Optional<IBookDetail> findBookDetailById(Integer id);

	@Query("""
 	select b.id as id, b.title as title, b.description as description, b.image.name as image,
	b.price as price, b.onSale as onSale, b.amount as amount, rv.rating as rating, od.orderTime as orderTime
	from Book b left join (select r.book.id as book_id, avg(r.rating) as rating from Review r group by r.book.id) rv on b.id = rv.book_id
	left join (select o.book.id as book_id, sum(o.amount) as orderTime from OrderDetail o group by o.book.id) od on b.id = od.book_id
	group by b, b.image.name, rv.rating, od.orderTime
	order by random()
	limit :amount
	""")
	public List<IBookDisplay> findRandomBooks(int amount); //Get random books

	public void deleteBySellerId(Integer id);
}
