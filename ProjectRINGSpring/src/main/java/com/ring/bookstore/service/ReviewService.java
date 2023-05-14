package com.ring.bookstore.service;

import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import com.ring.bookstore.dtos.ReviewDTO;
import com.ring.bookstore.model.Account;
import com.ring.bookstore.model.Review;
import com.ring.bookstore.request.ReviewRequest;

@Service
public interface ReviewService {
	
	Page<ReviewDTO> getAllReviews(Integer pageNo, Integer pageSize);
	Page<ReviewDTO> getReviewsByBookId(Integer id, Integer pageNo, Integer pageSize);
	Review review(Integer id, ReviewRequest request, Account user);
}
