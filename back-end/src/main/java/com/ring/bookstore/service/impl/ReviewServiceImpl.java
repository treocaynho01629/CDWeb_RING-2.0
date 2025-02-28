package com.ring.bookstore.service.impl;

import java.util.List;

import com.ring.bookstore.dtos.reviews.IReview;
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

import com.ring.bookstore.dtos.reviews.ReviewDTO;
import com.ring.bookstore.dtos.mappers.ReviewMapper;
import com.ring.bookstore.exception.HttpResponseException;
import com.ring.bookstore.exception.ResourceNotFoundException;
import com.ring.bookstore.repository.BookRepository;
import com.ring.bookstore.repository.OrderReceiptRepository;
import com.ring.bookstore.repository.ReviewRepository;
import com.ring.bookstore.request.ReviewRequest;
import com.ring.bookstore.service.ReviewService;

import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepo;
    private final BookRepository bookRepo;
    private final OrderReceiptRepository orderRepo;
    private final ReviewMapper reviewMapper;

    //Review
    @Transactional
    public Review review(Long id, ReviewRequest request, Account user) {
        //Book validation
        Book book = bookRepo.findById(id).orElseThrow(()
                -> new ResourceNotFoundException("Book not found"));
        //Check if user had bought it yet
        if (!orderRepo.hasUserBoughtBook(id, user.getId())) throw new HttpResponseException(
                HttpStatus.FORBIDDEN,
                "User have not bought the product!",
                "Hãy mua sản phẩm để có thể đánh giá!"
        );
        //Check if user had reviewed it yet
        if (reviewRepo.findUserReviewOfBook(id, user.getId()).isPresent()) throw new HttpResponseException(
                HttpStatus.CONFLICT,
                "User have already reviewed this product!",
                "Bạn đã đánh giá sản phẩm rồi!"
        );

        //Create review
        var review = Review.builder()
                .book(book)
                .rating(request.getRating())
                .rContent(request.getContent())
                .user(user)
                .build();

        Review addedReview = reviewRepo.save(review); //Save to database
        return addedReview;
    }

    //Get reviews (ADMIN)
    public Page<ReviewDTO> getReviews(Long bookId,
                                      Long userId,
                                      Integer rating,
                                      String keyword,
                                      Integer pageNo,
                                      Integer pageSize,
                                      String sortBy,
                                      String sortDir) {
        Pageable pageable = PageRequest.of(pageNo, pageSize, sortDir.equals("asc") ? Sort.by(sortBy).ascending() //Pagination
                : Sort.by(sortBy).descending());
        Page<IReview> reviewsList = reviewRepo.findReviews(bookId, userId, rating, keyword, pageable); //Fetch from database
        Page<ReviewDTO> reviewDTOS = reviewsList.map(reviewMapper::projectionToDTO);
        return reviewDTOS;
    }

    //Get reviews from book's {id}
    public Page<ReviewDTO> getReviewsByBookId(Long id,
                                              Integer rating,
                                              Integer pageNo,
                                              Integer pageSize,
                                              String sortBy,
                                              String sortDir) {
        Pageable pageable = PageRequest.of(pageNo, pageSize, sortDir.equals("asc") ? Sort.by(sortBy).ascending() //Pagination
                : Sort.by(sortBy).descending());
        Page<IReview> reviewsList = reviewRepo.findReviewsByBookId(id, rating, pageable); //Fetch from database
        Page<ReviewDTO> reviewDTOS = reviewsList.map(reviewMapper::projectionToDTO);
        return reviewDTOS;
    }

    //Get current user's reviews
    public Page<ReviewDTO> getUserReviews(Account user,
                                          Integer rating,
                                          Integer pageNo,
                                          Integer pageSize,
                                          String sortBy,
                                          String sortDir) {
        Pageable pageable = PageRequest.of(pageNo, pageSize, sortDir.equals("asc") ? Sort.by(sortBy).ascending() //Pagination
                : Sort.by(sortBy).descending());
        Page<IReview> reviewsList = reviewRepo.findUserReviews(user.getId(), rating, pageable); //Fetch from database
        Page<ReviewDTO> reviewDTOS = reviewsList.map(reviewMapper::projectionToDTO);
        return reviewDTOS;
    }

    //Get review by book
    public ReviewDTO getReviewByBook(Long id, Account user) {
        if (!orderRepo.hasUserBoughtBook(id, user.getId()))
            throw new HttpResponseException(
                    HttpStatus.FORBIDDEN,
                    "User have not bought the product!",
                    "Hãy mua sản phẩm để có thể đánh giá!"
            );
        IReview projection = reviewRepo.findUserReviewOfBook(id, user.getId()).orElseThrow(()
                -> new ResourceNotFoundException(
                "Review not found",
                "Người dùng chưa đánh giá sản phẩm này!"
        ));
        return reviewMapper.projectionToDTO(projection);
    }

    //Update review
    @Transactional
    public ReviewDTO updateReview(Long id, ReviewRequest request, Account user) {
        //Check review exists
        Review review = reviewRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Review not found"));

        //Check if correct user or admin
        if (!isUserValid(review, user)) throw new HttpResponseException(HttpStatus.FORBIDDEN, "Invalid role!");

        //Set new review content
        review.setRating(request.getRating());
        review.setRContent(request.getContent());
        Review updatedReview = reviewRepo.save(review); //Save new review to database
        return reviewMapper.reviewToDTO(updatedReview); //Return added review
    }

    //Delete review by {id} (ADMIN)
    public void deleteReview(Long id) {
        reviewRepo.deleteById(id);
    }

    @Transactional
    public void deleteReviews(List<Long> ids) {
        reviewRepo.deleteAllById(ids);
    }

    @Transactional
    public void deleteReviewsInverse(Long bookId,
                                     Long userId,
                                     Integer rating,
                                     String keyword,
                                     List<Long> ids) {
        List<Long> deleteIds = reviewRepo.findInverseIds(
                bookId,
                userId,
                rating,
                keyword,
                ids);
        reviewRepo.deleteAllById(deleteIds);
    }

    //Delete all reviews (ADMIN)
    @Transactional
    public void deleteAllReviews() {
        reviewRepo.deleteAll();
    }

    @Override
    public void hideReview(Long id) {
        Review review = reviewRepo.findById(id).orElseThrow(() ->
                new ResourceNotFoundException("Review not found"));
        review.setHidden(true);
        reviewRepo.save(review);
    }

    @Override
    public void unhideReview(Long id) {
        Review review = reviewRepo.findById(id).orElseThrow(() ->
                new ResourceNotFoundException("Review not found"));
        review.setHidden(false);
        reviewRepo.save(review);
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
