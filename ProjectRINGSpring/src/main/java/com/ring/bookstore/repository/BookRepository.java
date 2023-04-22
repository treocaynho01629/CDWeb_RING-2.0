package com.ring.bookstore.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.ring.bookstore.model.Book;

@Repository
public interface BookRepository extends JpaRepository<Book, Long>{
	
	@Query(value = "select b.* from Book b where concat (b.title, b.author) like %?1% and b.cate_id like %?2% and b.publisher_id like %?3% and b.type like %?4% and b.price between ?5 and ?6"
			, nativeQuery = true)
	public List<Book> findBooksWithFilter(String keyword, String cateId, String pubId, String type, Double fromRange, Double toRange);

}
