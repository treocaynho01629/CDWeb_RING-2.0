package com.ring.bookstore.repository;

import com.ring.bookstore.dtos.reviews.IReview;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.ring.bookstore.model.Review;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long>{

	@Query("""
		select r as review, u.id as userId, u.username as username, i.name as image,
		b.id as bookId, b.title as bookTitle, b.slug as bookSlug
		from Review r
		join r.book b
		join r.user u
		left join u.profile p
		left join p.image i
		where (coalesce(:userId) is null or u.id = :userId)
		and (coalesce(:bookId) is null or r.book.id = :bookId)
		and (coalesce(:rating) is null or  r.rating = :rating)
		and concat (r.rContent, u.username) ilike %:keyword%
	""")
	Page<IReview> findReviews(Long bookId,
							  Long userId,
							  Integer rating,
							  String keyword,
							  Pageable pageable);

	@Query("""
		select r.id from Review r
		join r.user u
		where (coalesce(:userId) is null or r.user.id = :userId)
		and (coalesce(:bookId) is null or r.book.id = :bookId)
		and (coalesce(:rating) is null or  r.rating = :rating)
		and concat (r.rContent, u.username) ilike %:keyword%
		and r.id not in :ids
		group by r.id
	""")
	List<Long> findInverseIds(Long bookId,
							  Long userId,
							  Integer rating,
							  String keyword,
							  List<Long> ids);

	@Query("""
		select r as review, u.id as userId, u.username as username, i.name as image,
		b.id as bookId, b.title as bookTitle, b.slug as bookSlug
		from Review r join r.book b
		join r.user u
		left join u.profile p
		left join p.image i
		where b.id = :id
		and r.isHidden = false
		and (coalesce(:rating) is null or  r.rating = :rating)
	""")
	Page<IReview> findReviewsByBookId(Long id, Integer rating, Pageable pageable); //Get reviews from book's {id}

	@Query("""
		select r as review, u.id as userId, u.username as username, i.name as image,
		b.id as bookId, b.title as bookTitle, b.slug as bookSlug
		from Review r join r.book b
		join r.user u
		left join u.profile p
		left join p.image i
		where r.user.id = :id
		and (coalesce(:rating) is null or  r.rating = :rating)
	""")
	Page<IReview> findUserReviews(Long id, Integer rating, Pageable pageable); //Get reviews by user's {id}

	@Query("""
		select r as review, u.id as userId, u.username as username, i.name as image,
		b.id as bookId, b.title as bookTitle, b.slug as bookSlug
		from Review r join r.book b
		join r.user u
		left join u.profile p
		left join p.image i
		where r.user.id = :userId and b.id = :bookId
	""")
	Optional<IReview> findUserReviewOfBook(Long bookId, Long userId); //Get user's review of this book
}
