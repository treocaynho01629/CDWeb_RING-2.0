package com.ring.bookstore.service;

import com.ring.bookstore.dtos.ReviewDTO;
import com.ring.bookstore.model.Account;
import com.ring.bookstore.model.Review;
import com.ring.bookstore.request.ReviewRequest;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface CouponService {
	
	Page<ReviewDTO> getAllCoupons(Integer pageNo, Integer pageSize, String sortBy, String sortDir);
	Page<ReviewDTO> getCouponsBySeller(Long userId, Integer pageNo, Integer pageSize, String sortBy, String sortDir);
	Page<ReviewDTO> getReviewsByUser(Account user, Integer pageNo, Integer pageSize, String sortBy, String sortDir);
	Page<ReviewDTO> getReviewsByBookId(Long id, Integer pageNo, Integer pageSize, String sortBy, String sortDir);
	Review review(Long id, ReviewRequest request, Account user);
	Review deleteReview(Long id);
	void deleteReviews(List<Long> ids);
	void deleteAllReviews();
}
