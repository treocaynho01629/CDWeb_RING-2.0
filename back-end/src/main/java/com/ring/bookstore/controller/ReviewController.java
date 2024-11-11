package com.ring.bookstore.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.ring.bookstore.config.CurrentAccount;
import com.ring.bookstore.model.Account;
import com.ring.bookstore.request.ReviewRequest;
import com.ring.bookstore.service.ReviewService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    //Get reviews
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getReviews(
            @RequestParam(value = "bookId", required = false) Long bookId,
            @RequestParam(value = "userId", required = false) Long userId,
            @RequestParam(value = "rating", required = false) Integer rating,
            @RequestParam(value = "pSize", defaultValue = "5") Integer pageSize,
            @RequestParam(value = "pageNo", defaultValue = "0") Integer pageNo,
            @RequestParam(value = "sortBy", defaultValue = "id") String sortBy,
            @RequestParam(value = "sortDir", defaultValue = "asc") String sortDir) {
        return new ResponseEntity<>(reviewService.getReviews(bookId, userId, rating, pageNo, pageSize, sortBy, sortDir), HttpStatus.OK);
    }

    //Get reviews for book's {id}
    @GetMapping("/book/{id}")
    public ResponseEntity<?> getReviewByBook(@PathVariable("id") Long bookId,
                                             @CurrentAccount Account currUser) {
        return new ResponseEntity<>(reviewService.getReviewByBook(bookId, currUser), HttpStatus.OK);
    }

    //Get reviews for book's {id}
    @GetMapping("/books/{id}")
    public ResponseEntity<?> getReviewsByBookId(@PathVariable("id") Long bookId,
                                                @RequestParam(value = "rating", required = false) Integer rating,
                                                @RequestParam(value = "pSize", defaultValue = "5") Integer pageSize,
                                                @RequestParam(value = "pageNo", defaultValue = "0") Integer pageNo,
                                                @RequestParam(value = "sortBy", defaultValue = "id") String sortBy,
                                                @RequestParam(value = "sortDir", defaultValue = "asc") String sortDir) {
        return new ResponseEntity<>(reviewService.getReviewsByBookId(bookId, rating, pageNo, pageSize, sortBy, sortDir), HttpStatus.OK);
    }

    //Get current user's reviews
    @GetMapping("/user")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getUserReviews(@RequestParam(value = "rating", required = false) Integer rating,
                                            @RequestParam(value = "pSize", defaultValue = "5") Integer pageSize,
                                            @RequestParam(value = "pageNo", defaultValue = "0") Integer pageNo,
                                            @RequestParam(value = "sortBy", defaultValue = "id") String sortBy,
                                            @RequestParam(value = "sortDir", defaultValue = "asc") String sortDir,
                                            @CurrentAccount Account currUser) {
        return new ResponseEntity<>(reviewService.getUserReviews(currUser, rating, pageNo, pageSize, sortBy, sortDir), HttpStatus.OK);
    }

    //Review by bookId
    @PostMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> reviewBook(@PathVariable("id") Long bookId,
                                        @RequestBody @Valid ReviewRequest request,
                                        @CurrentAccount Account currUser) {
        return new ResponseEntity<>(reviewService.review(bookId, request, currUser), HttpStatus.CREATED);
    }

    //Update review by id
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> updateReview(@PathVariable("id") Long bookId,
                                          @Valid @RequestBody ReviewRequest request,
                                          @CurrentAccount Account currUser) {
        return new ResponseEntity<>(reviewService.updateReview(bookId, request, currUser), HttpStatus.OK);
    }

    //Delete review
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteReview(@PathVariable("id") Long id) {
        reviewService.deleteReview(id);
        return new ResponseEntity<>("Review deleted successfully!", HttpStatus.OK);
    }

    //Delete multiples reviews in a lists of {ids}
    @DeleteMapping("/delete-multiples")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteReviews(@RequestParam(value = "bookId", required = false) Long bookId,
                                           @RequestParam(value = "userId", required = false) Long userId,
                                           @RequestParam(value = "rating", required = false) Integer rating,
                                           @RequestParam(value = "isInverse", defaultValue = "false") Boolean isInverse,
                                           @RequestParam("ids") List<Long> ids) {
        reviewService.deleteReviews(bookId, userId, rating, ids, isInverse);
        return new ResponseEntity<>("Reviews deleted successfully!", HttpStatus.OK);
    }

    //Delete all reviews
    @DeleteMapping("/delete-all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteAllReviews() {
        reviewService.deleteAllReviews();
        return new ResponseEntity<>("All reviews deleted successfully!", HttpStatus.OK);
    }
}
