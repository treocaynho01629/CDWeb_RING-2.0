package com.ring.bookstore.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.ring.bookstore.dtos.IBookDisplay;
import com.ring.bookstore.model.Book;

@Repository
public interface BookRepository extends JpaRepository<Book, Integer>{
	
	@Query("""
	select b.id as id, b.title as title, b.description as description, b.image.name as image, b.price as price, b.amount as amount,
	count(r.id) as rateAmount, coalesce(sum(r.rating), 0) as rateTotal, coalesce(sum(o.amount), 0) as orderTime
	from Book b left join Review r on b.id = r.book.id left join OrderDetail o on b.id = o.book.id
	where concat (b.title, b.author) ilike %:keyword%
	and cast(b.cate.id as string) like %:cateId%
	and b.seller.userName like %:seller%
	and cast(b.publisher.id as string) not in :pubId
	and b.type like %:type%
	and b.price between :fromRange and :toRange
	group by b.id, b.title, b.description, b.image.name, b.price
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
	select b.id as id, b.title as title, b.description as description, b.image.name as image, b.price as price, b.amount as amount,
	count(r.id) as rateAmount, coalesce(sum(r.rating), 0) as rateTotal, coalesce(sum(o.amount) , 0) as orderTime
	from Book b left join Review r on b.id = r.book.id left join OrderDetail o on b.id = o.book.id
	group by b.id, b.title, b.description, b.image.name, b.price
	order by random()
	limit :amount
	""")
	public List<IBookDisplay> findRandomBooks(int amount); //Get random books

	public void deleteBySellerId(Integer id);
}
