package com.ring.bookstore.repository;

import com.ring.bookstore.dtos.projections.IBookDisplay;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.ring.bookstore.model.Review;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long>{

	@Query("""
	select r from Review r 
	where (coalesce(:userId) is null or r.user.id = :userId)
	and (coalesce(:bookId) is null or r.book.id = :bookId)
	and r.rating > :rating
	""")
	public Page<Review> findReviewsByFilter(Long bookId, Long userId, Integer rating, Pageable pageable);
	
	Page<Review> findAllByBook_IdAndRatingIsGreaterThan(Long id, Integer rating, Pageable pageable); //Get reviews from book's {id}
	
	Page<Review> findAllByUser_IdAndRatingIsGreaterThan(Long id, Integer rating, Pageable pageable); //Get reviews by user's {id}

	@Query("""
    delete from Review r where r.id in :ids
    """)
	void deleteByIds(List<Long> ids);

	@Query("""
    delete from Review r where r.id not in :ids
    """)
	void deleteInverseByIds(List<Long> ids);
	
	boolean existsByBook_IdAndUser_Id(Long bookId, Long userId); //Check if user has review this book before
}
