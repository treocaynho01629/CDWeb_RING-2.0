package com.ring.bookstore.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.ring.bookstore.model.Review;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Integer>{
	
	Page<Review> findAllByBook_Id(Integer id, Pageable pageable);
	
	Page<Review> findAllByUser_Id(Integer id, Pageable pageable);
	
	@Query("""
    select coalesce(sum(r.rating), 0) from Review r where r.book.id = :id
    """)
	int findTotalRatingByBookId(Integer id);
	
	void deleteByBook_Id(Integer id);
	
	boolean existsByBook_IdAndUser_Id(Integer bookId, Integer userId);
}
