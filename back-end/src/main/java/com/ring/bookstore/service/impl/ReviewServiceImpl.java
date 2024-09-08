package com.ring.bookstore.service.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.ring.bookstore.dtos.ReviewDTO;
import com.ring.bookstore.dtos.mappers.ReviewMapper;
import com.ring.bookstore.exception.HttpResponseException;
import com.ring.bookstore.exception.ResourceNotFoundException;
import com.ring.bookstore.model.Account;
import com.ring.bookstore.model.Book;
import com.ring.bookstore.model.Review;
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
	public Review review(Integer id, ReviewRequest request, Account user) {
		
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
                .rDate(LocalDateTime.now())
                .user(user)
                .build();
        
        Review addedReview = reviewRepo.save(review); //Save to database
        return addedReview; //Return added review
	}
	
	//Get all reviews
	public Page<ReviewDTO> getAllReviews(Integer pageNo, Integer pageSize, String sortBy, String sortDir) {
		Pageable pageable = PageRequest.of(pageNo, pageSize, sortDir.equals("asc") ? Sort.by(sortBy).ascending() //Pagination
				: Sort.by(sortBy).descending());
		Page<Review> reviewsList = reviewRepo.findAll(pageable); //Fetch from database
		Page<ReviewDTO> reviewDtos = reviewsList.map(reviewMapper::apply);
		return reviewDtos;
	}

	//Get reviews from book's {id}
	public Page<ReviewDTO> getReviewsByBookId(Integer id, Integer pageNo, Integer pageSize, String sortBy, String sortDir) {
		Pageable pageable = PageRequest.of(pageNo, pageSize, sortDir.equals("asc") ? Sort.by(sortBy).ascending() //Pagination
				: Sort.by(sortBy).descending());
		Page<Review> reviewsList = reviewRepo.findAllByBook_Id(id, pageable); //Fetch from database
		Page<ReviewDTO> reviewDtos = reviewsList.map(reviewMapper::apply);
		return reviewDtos;
	}
	
	//Get reviews by user's {id}
	public Page<ReviewDTO> getReviewsByUser(Integer userId, Integer pageNo, Integer pageSize, String sortBy, String sortDir) {
		Pageable pageable = PageRequest.of(pageNo, pageSize, sortDir.equals("asc") ? Sort.by(sortBy).ascending() //Pagination
				: Sort.by(sortBy).descending());
		Page<Review> reviewsList = reviewRepo.findAllByUser_Id(userId, pageable); //Fetch from database
		Page<ReviewDTO> reviewDtos = reviewsList.map(reviewMapper::apply);
		return reviewDtos;
	}

	//Get current user's reviews
	public Page<ReviewDTO> getReviewsByUser(Account user, Integer pageNo, Integer pageSize, String sortBy, String sortDir) {
		Pageable pageable = PageRequest.of(pageNo, pageSize, sortDir.equals("asc") ? Sort.by(sortBy).ascending() //Pagination
				: Sort.by(sortBy).descending());
		Page<Review> reviewsList = reviewRepo.findAllByUser_Id(user.getId(), pageable); //Fetch from database
		Page<ReviewDTO> reviewDtos = reviewsList.map(reviewMapper::apply);
		return reviewDtos;
	}
	
	//Delete review by {id} (ADMIN)
	public Review deleteReview(Integer id) {
		Review review = reviewRepo.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Review does not exists!"));
		reviewRepo.deleteById(id); //Delete from database
		return review;
	}
	
	//Delete multiples reviews (ADMIN)
	@Transactional
	public void deleteReviews(List<Integer> ids) {
		//Loop through and delete
		for (Integer id : ids) {
			reviewRepo.findById(id)
					.orElseThrow(() -> new ResourceNotFoundException("Review does not exists!"));
			reviewRepo.deleteById(id); //Delete from database
		}
	}
	
	//Delete all reviews ADMIN)
	@Transactional
	public void deleteAllReviews() {
		reviewRepo.deleteAll();
	}
}
