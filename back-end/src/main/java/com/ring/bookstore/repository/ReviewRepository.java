package com.ring.bookstore.repository;

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
	and (coalesce(:rating) is null or  r.rating = :rating)
	""")
	public Page<Review> findReviewsByFilter(Long bookId, Long userId, Integer rating, Pageable pageable);

	@Query("""
	select r.id from Review r
	where (coalesce(:userId) is null or r.user.id = :userId)
	and (coalesce(:bookId) is null or r.book.id = :bookId)
	and (coalesce(:rating) is null or  r.rating = :rating)
	and r.id not in :ids
	group by r.id
	""")
	List<Long> findInverseIds(Long bookId, Long userId, Integer rating, List<Long> ids);

	@Query("""
	select r from Review r 
	where r.book.id = :id
	and (coalesce(:rating) is null or  r.rating = :rating)
	""")
	Page<Review> findReviewsByBookId(Long id, Integer rating, Pageable pageable); //Get reviews from book's {id}

	@Query("""
	select r from Review r 
	where r.user.id = :id
	and (coalesce(:rating) is null or  r.rating = :rating)
	""")
	Page<Review> findUserReviews(Long id, Integer rating, Pageable pageable); //Get reviews by user's {id}
	
	boolean existsByBook_IdAndUser_Id(Long bookId, Long userId); //Check if user has review this book before
}
