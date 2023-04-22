package com.ring.bookstore.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.ring.bookstore.model.Review;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long>{
	
	@Query("""
    select r from Review r inner join Book b on r.book.id = b.id
    where b.id = :id
    """)
	List<Review> findAllByBookId(long id);
}
