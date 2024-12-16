package com.ring.bookstore.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import com.ring.bookstore.dtos.reviews.ReviewDTO;
import com.ring.bookstore.model.Account;
import com.ring.bookstore.request.ReviewRequest;

@Service
public interface ReviewService {

    Page<ReviewDTO> getReviews(Long bookId,
                               Long userId,
                               Integer rating,
                               Integer pageNo,
                               Integer pageSize,
                               String sortBy,
                               String sortDir);

    Page<ReviewDTO> getUserReviews(Account user,
                                   Integer rating,
                                   Integer pageNo,
                                   Integer pageSize,
                                   String sortBy,
                                   String sortDir);

    Page<ReviewDTO> getReviewsByBookId(Long bookId,
                                       Integer rating,
                                       Integer pageNo,
                                       Integer pageSize,
                                       String sortBy,
                                       String sortDir);

    ReviewDTO getReviewByBook(Long id,
                              Account user);

    ReviewDTO review(Long id,
                     ReviewRequest request,
                     Account user);

    ReviewDTO updateReview(Long id,
                           ReviewRequest request,
                           Account user);

    void deleteReview(Long id);

    void deleteReviews(Long bookId,
                       Long userId,
                       Integer rating,
                       List<Long> ids,
                       Boolean isInverse);

    void deleteAllReviews();
}
