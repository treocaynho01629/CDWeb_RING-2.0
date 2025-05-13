package com.ring.service;

import com.ring.dto.request.ReviewRequest;
import com.ring.dto.response.PagingResponse;
import com.ring.dto.response.reviews.ReviewDTO;
import com.ring.model.entity.Account;
import com.ring.model.entity.Review;

import java.util.List;

public interface ReviewService {

    PagingResponse<ReviewDTO> getReviews(Long bookId,
            Long userId,
            Integer rating,
            String keyword,
            Integer pageNo,
            Integer pageSize,
            String sortBy,
            String sortDir);

    PagingResponse<ReviewDTO> getUserReviews(Account user,
            Integer rating,
            Integer pageNo,
            Integer pageSize,
            String sortBy,
            String sortDir);

    PagingResponse<ReviewDTO> getReviewsByBookId(Long bookId,
            Integer rating,
            Integer pageNo,
            Integer pageSize,
            String sortBy,
            String sortDir);

    ReviewDTO getReviewByBook(Long id,
            Account user);

    Review review(Long id,
            ReviewRequest request,
            Account user);

    ReviewDTO updateReview(Long id,
            ReviewRequest request,
            Account user);

    void deleteReview(Long id);

    void deleteReviews(List<Long> ids);

    void deleteReviewsInverse(Long bookId,
            Long userId,
            Integer rating,
            String keyword,
            List<Long> ids);

    void deleteAllReviews();

    void hideReview(Long id);

    void unhideReview(Long id);
}
