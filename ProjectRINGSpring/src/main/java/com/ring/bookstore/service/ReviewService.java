package com.ring.bookstore.service;

import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import com.ring.bookstore.dtos.ReviewDTO;
import com.ring.bookstore.model.Account;
import com.ring.bookstore.model.Review;
import com.ring.bookstore.request.ReviewRequest;

@Service
public interface ReviewService {
	
	Page<ReviewDTO> getAllReviews(Integer pageNo, Integer pageSize, String sortBy, String sortDir);
	Page<ReviewDTO> getReviewsByUser(Integer userId, Integer pageNo, Integer pageSize, String sortBy, String sortDir);
	Page<ReviewDTO> getReviewsByUser(Account user, Integer pageNo, Integer pageSize, String sortBy, String sortDir);
	Page<ReviewDTO> getReviewsByBookId(Integer id, Integer pageNo, Integer pageSize, String sortBy, String sortDir);
	Review review(Integer id, ReviewRequest request, Account user);
	Review deleteReview(Integer id);
}
