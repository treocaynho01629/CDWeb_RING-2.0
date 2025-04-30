package com.ring.bookstore.repository;

import com.ring.bookstore.model.dto.projection.reviews.IReview;
import com.ring.bookstore.model.entity.RefreshToken;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.ring.bookstore.model.entity.Review;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface named {@link ReviewRepository} for managing {@link Review} entities.
 */
@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

	/**
	 * Retrieves a pageable list of reviews based on various filter criteria.
	 *
	 * @param bookId the ID of the book to filter reviews by; if null,*/
	@Query("""
		select r as review, u.id as userId, u.username as username, i as image,
		b.id as bookId, b.title as bookTitle, b.slug as bookSlug
		from Review r
		join r.book b
		left join r.user u
		left join u.profile p
		left join p.image i
		where (coalesce(:userId) is null or u.id = :userId)
		and (coalesce(:bookId) is null or r.book.id = :bookId)
		and (coalesce(:rating) is null or r.rating = :rating)
		and concat (r.rContent, u.username) ilike %:keyword%
	""")
	Page<IReview> findReviews(Long bookId,
							  Long userId,
							  Integer rating,
							  String keyword,
							  Pageable pageable);

	/**
	 * Retrieves a list of review IDs that meet the specified filtering criteria and are not included in the given list of IDs.
	 *
	 * @param bookId   the ID of the book to filter reviews by; null if the filter is not applied.
	 */
	@Query("""
		select r.id from Review r
		left join r.user u
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

	/**
	 * Retrieves reviews for a specific book based on its ID, optionally filtered by rating.
	 *
	 * @param id the ID of the book for which reviews are to be retrieved
	 * @param rating the optional rating value to filter reviews; if null, all ratings are included*/
	@Query("""
		select r as review, u.id as userId, u.username as username, i as image,
		b.id as bookId, b.title as bookTitle, b.slug as bookSlug
		from Review r join r.book b
		left join r.user u
		left join u.profile p
		left join p.image i
		where b.id = :id
		and r.isHidden = false
		and (coalesce(:rating) is null or  r.rating = :rating)
	""")
	Page<IReview> findReviewsByBookId(Long id, Integer rating, Pageable pageable);

	/**
	 * Retrieves a paginated list of reviews submitted by a specific user, optionally filtered by rating.
	 *
	 * @param id the unique identifier of the user whose reviews are being retrieved
	 * @param rating the rating filter to apply; if null, reviews of all ratings are included
	 * @*/
	@Query("""
		select r as review, u.id as userId, u.username as username, i as image,
		b.id as bookId, b.title as bookTitle, b.slug as bookSlug
		from Review r join r.book b
		left join r.user u
		left join u.profile p
		left join p.image i
		where r.user.id = :id
		and (coalesce(:rating) is null or  r.rating = :rating)
	""")
	Page<IReview> findUserReviews(Long id, Integer rating, Pageable pageable);

	/**
	 * Retrieves a review for a specific book by a specific user.
	 *
	 * @param bookId the ID of the book for which the review is being retrieved
	 * @param userId the ID of the user who wrote the review
	 * @return an Optional containing the user's review for the specified book, or an empty Optional if no review is found
	 */
	@Query("""
		select r as review, u.id as userId, u.username as username, i as image,
		b.id as bookId, b.title as bookTitle, b.slug as bookSlug
		from Review r join r.book b
		left join r.user u
		left join u.profile p
		left join p.image i
		where r.user.id = :userId and b.id = :bookId
	""")
	Optional<IReview> findUserBookReview(Long bookId, Long userId);
}
