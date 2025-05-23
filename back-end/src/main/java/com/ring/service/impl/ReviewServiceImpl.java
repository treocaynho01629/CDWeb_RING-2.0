package com.ring.service.impl;

import com.ring.dto.projection.reviews.IReview;
import com.ring.dto.request.ReviewRequest;
import com.ring.dto.response.PagingResponse;
import com.ring.dto.response.reviews.ReviewDTO;
import com.ring.exception.EntityOwnershipException;
import com.ring.exception.HttpResponseException;
import com.ring.exception.ResourceNotFoundException;
import com.ring.mapper.ReviewMapper;
import com.ring.model.entity.Account;
import com.ring.model.entity.Book;
import com.ring.model.entity.Review;
import com.ring.model.enums.UserRole;
import com.ring.repository.BookRepository;
import com.ring.repository.OrderReceiptRepository;
import com.ring.repository.ReviewRepository;
import com.ring.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@RequiredArgsConstructor
@Service
public class ReviewServiceImpl implements ReviewService {

        private final ReviewRepository reviewRepo;
        private final BookRepository bookRepo;
        private final OrderReceiptRepository orderRepo;
        private final ReviewMapper reviewMapper;

        @CacheEvict(cacheNames = "reviews", allEntries = true)
        @Transactional
        public Review review(Long id,
                        ReviewRequest request,
                        Account user) {

                // Book validation
                Book book = bookRepo.findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException("Product not found!",
                                                "Không tìm thấy sản phẩm yêu cầu!"));
                // Check if user had bought it yet
                if (!orderRepo.hasUserBoughtBook(id, user.getId()))
                        throw new HttpResponseException(
                                        HttpStatus.FORBIDDEN,
                                        "User have not bought the product!",
                                        "Hãy mua sản phẩm để có thể đánh giá!");
                // Check if user had reviewed it yet
                if (reviewRepo.findUserBookReview(id, user.getId()).isPresent())
                        throw new HttpResponseException(
                                        HttpStatus.CONFLICT,
                                        "User have already reviewed this product!",
                                        "Bạn đã đánh giá sản phẩm rồi!");

                // Create review
                var review = Review.builder()
                                .book(book)
                                .rating(request.getRating())
                                .rContent(request.getContent())
                                .user(user)
                                .build();

                Review addedReview = reviewRepo.save(review); // Save to database
                return addedReview;
        }

        @Cacheable(cacheNames = "reviews")
        public PagingResponse<ReviewDTO> getReviews(Long bookId,
                        Long userId,
                        Integer rating,
                        String keyword,
                        Integer pageNo,
                        Integer pageSize,
                        String sortBy,
                        String sortDir) {

                Pageable pageable = PageRequest.of(pageNo, pageSize, sortDir.equals("asc") ? Sort.by(sortBy).ascending() // Pagination
                                : Sort.by(sortBy).descending());
                Page<IReview> reviewsList = reviewRepo.findReviews(bookId, userId, rating, keyword, pageable); // Fetch
                                                                                                               // from
                                                                                                               // database
                List<ReviewDTO> reviewDTOS = reviewsList.map(reviewMapper::projectionToDTO).toList();
                return new PagingResponse<>(
                                reviewDTOS,
                                reviewsList.getTotalPages(),
                                reviewsList.getTotalElements(),
                                reviewsList.getSize(),
                                reviewsList.getNumber(),
                                reviewsList.isEmpty());
        }

        @Cacheable(cacheNames = "reviews")
        public PagingResponse<ReviewDTO> getReviewsByBookId(Long id,
                        Integer rating,
                        Integer pageNo,
                        Integer pageSize,
                        String sortBy,
                        String sortDir) {

                Pageable pageable = PageRequest.of(pageNo, pageSize, sortDir.equals("asc") ? Sort.by(sortBy).ascending() // Pagination
                                : Sort.by(sortBy).descending());
                Page<IReview> reviewsList = reviewRepo.findReviewsByBookId(id, rating, pageable); // Fetch from database
                List<ReviewDTO> reviewDTOS = reviewsList.map(reviewMapper::projectionToDTO).toList();
                return new PagingResponse<>(
                                reviewDTOS,
                                reviewsList.getTotalPages(),
                                reviewsList.getTotalElements(),
                                reviewsList.getSize(),
                                reviewsList.getNumber(),
                                reviewsList.isEmpty());
        }

        @Cacheable(cacheNames = "reviews")
        public PagingResponse<ReviewDTO> getUserReviews(Account user,
                        Integer rating,
                        Integer pageNo,
                        Integer pageSize,
                        String sortBy,
                        String sortDir) {

                Pageable pageable = PageRequest.of(pageNo, pageSize, sortDir.equals("asc") ? Sort.by(sortBy).ascending() // Pagination
                                : Sort.by(sortBy).descending());
                Page<IReview> reviewsList = reviewRepo.findUserReviews(user.getId(), rating, pageable); // Fetch from
                                                                                                        // database
                List<ReviewDTO> reviewDTOS = reviewsList.map(reviewMapper::projectionToDTO).toList();
                return new PagingResponse<>(
                                reviewDTOS,
                                reviewsList.getTotalPages(),
                                reviewsList.getTotalElements(),
                                reviewsList.getSize(),
                                reviewsList.getNumber(),
                                reviewsList.isEmpty());
        }

        @Cacheable(cacheNames = "reviews")
        public ReviewDTO getReviewByBook(Long id, Account user) {

                if (!orderRepo.hasUserBoughtBook(id, user.getId()))
                        throw new HttpResponseException(
                                        HttpStatus.FORBIDDEN,
                                        "User have not bought the product!",
                                        "Hãy mua sản phẩm để có thể đánh giá!");
                IReview projection = reviewRepo.findUserBookReview(id, user.getId())
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Review not found!",
                                                "Người dùng chưa đánh giá sản phẩm này!"));
                return reviewMapper.projectionToDTO(projection);
        }

        @CacheEvict(cacheNames = "reviews", allEntries = true)
        @Transactional
        public ReviewDTO updateReview(Long id, ReviewRequest request, Account user) {

                // Check review exists
                Review review = reviewRepo.findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException("Review not found!",
                                                "Không tìm thấy đánh giá yêu cầu!"));

                // Check if correct user or admin
                if (!isUserValid(review, user))
                        throw new EntityOwnershipException("Invalid ownership!",
                                        "Người dùng không có quyền chỉnh sửa đánh giá này!");

                // Set new review content
                review.setRating(request.getRating());
                review.setRContent(request.getContent());
                Review updatedReview = reviewRepo.save(review); // Save new review to database
                return reviewMapper.reviewToDTO(updatedReview); // Return added review
        }

        @CacheEvict(cacheNames = "reviews", allEntries = true)
        @Transactional
        public void deleteReview(Long id) {
                reviewRepo.deleteById(id);
        }

        @CacheEvict(cacheNames = "reviews", allEntries = true)
        @Transactional
        public void deleteReviews(List<Long> ids) {
                reviewRepo.deleteAllById(ids);
        }

        @CacheEvict(cacheNames = "reviews", allEntries = true)
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

        @CacheEvict(cacheNames = "reviews", allEntries = true)
        @Transactional
        public void deleteAllReviews() {
                reviewRepo.deleteAll();
        }

        @CacheEvict(cacheNames = "reviews", allEntries = true)
        @Transactional
        public void hideReview(Long id) {
                Review review = reviewRepo.findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException("Review not found!",
                                                "Không tìm thấy đánh giá yêu cầu!"));
                review.setHidden(true);
                reviewRepo.save(review);
        }

        @CacheEvict(cacheNames = "reviews", allEntries = true)
        @Transactional
        public void unhideReview(Long id) {
                Review review = reviewRepo.findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException("Review not found!",
                                                "Không tìm thấy đánh giá yêu cầu!"));
                review.setHidden(false);
                reviewRepo.save(review);
        }

        @Cacheable(cacheNames = "reviews")
        protected boolean isAuthAdmin() {
                Authentication auth = SecurityContextHolder.getContext().getAuthentication(); // Get current auth
                return (auth != null && auth.getAuthorities().stream()
                                .anyMatch(a -> a.getAuthority().equals(UserRole.ROLE_ADMIN.toString())));
        }

        protected boolean isUserValid(Review review, Account user) {
                // Check if is admin or valid seller id
                return review.getUser().getId().equals(user.getId()) || isAuthAdmin();
        }
}
