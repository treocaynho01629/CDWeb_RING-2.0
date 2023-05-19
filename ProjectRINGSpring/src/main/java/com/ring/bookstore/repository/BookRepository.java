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
	select b.id as id, b.title as title, b.description as description, b.images.name as image, b.price as price, 
	count(r.id) as rateAmount, isnull(sum(r.rating), 0) as rateTotal, size(b.orderDetails) as orderTime
	from Book b left join Review r on b.id = r.book.id
	where concat (b.title, b.author) like %:keyword%
	and cast(b.cate.id as string) like %:cateId%
	and b.user.userName like %:seller%
	and cast(b.publisher.id as string) not in :pubId
	and b.type like %:type%
	and b.price between :fromRange and :toRange
	group by b.id, b.title, b.description, b.images.name, b.price
	""")
	public Page<IBookDisplay> findBooksWithFilter(String keyword, String cateId, String[] pubId, String seller,String type, Double fromRange, Double toRange, Pageable pageable);
	
	@Query("select b from Book b order by newid() limit :amount")
	public List<Book> findRandomBooks(int amount);
	
	@Query("""
	select b from Book b
	""")
	List<IBookDisplay> testStuff();

}
