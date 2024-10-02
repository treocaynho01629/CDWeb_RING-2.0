package com.ring.bookstore.service.impl;

import java.util.List;

import com.ring.bookstore.enums.RoleName;
import com.ring.bookstore.model.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.ring.bookstore.dtos.ReviewDTO;
import com.ring.bookstore.dtos.mappers.ReviewMapper;
import com.ring.bookstore.exception.HttpResponseException;
import com.ring.bookstore.exception.ResourceNotFoundException;
import com.ring.bookstore.repository.BookRepository;
import com.ring.bookstore.repository.OrderReceiptRepository;
import com.ring.bookstore.repository.ReviewRepository;
import com.ring.bookstore.request.ReviewRequest;
import com.ring.bookstore.service.ReviewService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class ReviewServiceImpl implements ReviewService {
	
	private final ReviewRepository reviewRepo;
	private final BookRepository bookRepo;
	private final OrderReceiptRepository orderRepo;
	private final ReviewMapper reviewMapper;
	
	//Review
	public ReviewDTO review(Long id, ReviewRequest request, Account user) {
		//Book validation
		Book book = bookRepo.findById(id).orElseThrow(()-> new ResourceNotFoundException("Book not found")); 
		//Check if user had bought it yet
		if (!orderRepo.existsByUserBuyBook(id, user.getUsername())) throw new HttpResponseException(HttpStatus.NO_CONTENT, "Hãy mua sản phẩm để có thể đánh giá!");
		//Check if user had reviewed it yet
		if (reviewRepo.existsByBook_IdAndUser_Id(id, user.getId())) throw new HttpResponseException(HttpStatus.ALREADY_REPORTED, "Bạn đã đánh giá sản phẩm rồi!");
		
		//Create review
        var review = Review.builder()
                .book(book)
                .rating(request.getRating())
                .rContent(request.getContent())
                .user(user)
                .build();
        
        Review addedReview = reviewRepo.save(review); //Save to database
		return reviewMapper.apply(addedReview); //Return added review
	}
	
	//Get reviews (ADMIN)
	public Page<ReviewDTO> getReviews(Long bookId, Long userId, Integer rating, Integer pageNo, Integer pageSize, String sortBy, String sortDir) {
		Pageable pageable = PageRequest.of(pageNo, pageSize, sortDir.equals("asc") ? Sort.by(sortBy).ascending() //Pagination
				: Sort.by(sortBy).descending());
		Page<Review> reviewsList = reviewRepo.findReviewsByFilter(bookId, userId, rating, pageable); //Fetch from database
		Page<ReviewDTO> reviewDtos = reviewsList.map(reviewMapper::apply);
		return reviewDtos;
	}

	//Get reviews from book's {id}
	public Page<ReviewDTO> getReviewsByBookId(Long id, Integer rating, Integer pageNo, Integer pageSize, String sortBy, String sortDir) {
		Pageable pageable = PageRequest.of(pageNo, pageSize, sortDir.equals("asc") ? Sort.by(sortBy).ascending() //Pagination
				: Sort.by(sortBy).descending());
		Page<Review> reviewsList = reviewRepo.findReviewsByBookId(id, rating, pageable); //Fetch from database
		Page<ReviewDTO> reviewDtos = reviewsList.map(reviewMapper::apply);
		return reviewDtos;
	}

	//Get current user's reviews
	public Page<ReviewDTO> getUserReviews(Account user, Integer rating, Integer pageNo, Integer pageSize, String sortBy, String sortDir) {
		Pageable pageable = PageRequest.of(pageNo, pageSize, sortDir.equals("asc") ? Sort.by(sortBy).ascending() //Pagination
				: Sort.by(sortBy).descending());
		Page<Review> reviewsList = reviewRepo.findUserReviews(user.getId(), rating, pageable); //Fetch from database
		Page<ReviewDTO> reviewDtos = reviewsList.map(reviewMapper::apply);
		return reviewDtos;
	}

	//Update review
	@Transactional
	public ReviewDTO updateReview(Long id, ReviewRequest request, Account user) {
		//Check review exists
		Review review = reviewRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Review not found"));

		//Check if correct user or admin
		if (!isUserValid(review, user)) throw new HttpResponseException(HttpStatus.UNAUTHORIZED, "Invalid role!");

		//Set new review content
		review.setRContent(request.getContent());
		Review updatedReview = reviewRepo.save(review); //Save new review to database
		return reviewMapper.apply(updatedReview); //Return added review
	}

	//Delete review by {id} (ADMIN)
	public void deleteReview(Long id) {
		reviewRepo.deleteById(id);
	}

	//Delete multiples reviews (ADMIN)
	@Transactional
	public void deleteReviews(Long bookId, Long userId, Integer rating, List<Long> ids, boolean isInverse) {
		List<Long> listDelete = ids;
		if (isInverse) listDelete = reviewRepo.findInverseIds(bookId, userId, rating, ids);

		//Loop and delete
		for (Long id : listDelete) {
			reviewRepo.deleteById(id); //Delete from database
		}
	}
	
	//Delete all reviews (ADMIN)
	@Transactional
	public void deleteAllReviews() {
		reviewRepo.deleteAll();
	}

	//Check valid role function
	protected boolean isAuthAdmin() {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication(); //Get current auth
		return (auth != null && auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals(RoleName.ROLE_ADMIN.toString())));
	}

	protected boolean isUserValid(Review review, Account user) {
		//Check if is admin or valid seller id
		return review.getUser().getId().equals(user.getId()) || isAuthAdmin();
	}
}
