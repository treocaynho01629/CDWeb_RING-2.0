package com.ring.bookstore.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.ring.bookstore.model.Review;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Integer>{
	
	Page<Review> findAllByBook_Id(Integer id, Pageable pageable); //Get reviews from book's {id}
	
	Page<Review> findAllByUser_Id(Integer id, Pageable pageable); //Get reviews by user's {id}
	
	@Query("""
    select coalesce(sum(r.rating), 0) from Review r where r.book.id = :id
    """)
	int findTotalRatingByBookId(Integer id); //Get total rating of book's {id}
	
	void deleteByBook_Id(Integer id); //Delete book's {id} reviews
	
	boolean existsByBook_IdAndUser_Id(Integer bookId, Integer userId); //Check if user has review this book before
}
