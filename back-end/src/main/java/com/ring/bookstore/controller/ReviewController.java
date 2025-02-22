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
    @PreAuthorize("hasAnyRole('ADMIN','GUEST') and hasAuthority('READ_PRIVILEGE')")
    public ResponseEntity<?> getReviews(
            @RequestParam(value = "bookId", required = false) Long bookId,
            @RequestParam(value = "userId", required = false) Long userId,
            @RequestParam(value = "rating", required = false) Integer rating,
            @RequestParam(value = "keyword", defaultValue = "") String keyword,
            @RequestParam(value = "pSize", defaultValue = "5") Integer pageSize,
            @RequestParam(value = "pageNo", defaultValue = "0") Integer pageNo,
            @RequestParam(value = "sortBy", defaultValue = "id") String sortBy,
            @RequestParam(value = "sortDir", defaultValue = "desc") String sortDir) {
        return new ResponseEntity<>(reviewService.getReviews(bookId, userId, rating, keyword, pageNo, pageSize, sortBy, sortDir), HttpStatus.OK);
    }

    //Get reviews for book's {id}
    @GetMapping("/book/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getReviewByBook(@PathVariable("id") Long bookId,
                                             @CurrentAccount Account currUser) {
        return new ResponseEntity<>(reviewService.getReviewByBook(bookId, currUser), HttpStatus.OK);
    }

    //Get reviews for book's {id}
    @GetMapping("/books/{id}")
    public ResponseEntity<?> getReviewsByBook(@PathVariable("id") Long bookId,
                                              @RequestParam(value = "rating", required = false) Integer rating,
                                              @RequestParam(value = "pSize", defaultValue = "5") Integer pageSize,
                                              @RequestParam(value = "pageNo", defaultValue = "0") Integer pageNo,
                                              @RequestParam(value = "sortBy", defaultValue = "id") String sortBy,
                                              @RequestParam(value = "sortDir", defaultValue = "desc") String sortDir) {
        return new ResponseEntity<>(reviewService.getReviewsByBookId(bookId, rating, pageNo, pageSize, sortBy, sortDir), HttpStatus.OK);
    }

    //Get current user's reviews
    @GetMapping("/user")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getUserReviews(@RequestParam(value = "rating", required = false) Integer rating,
                                            @RequestParam(value = "pSize", defaultValue = "5") Integer pageSize,
                                            @RequestParam(value = "pageNo", defaultValue = "0") Integer pageNo,
                                            @RequestParam(value = "sortBy", defaultValue = "id") String sortBy,
                                            @RequestParam(value = "sortDir", defaultValue = "desc") String sortDir,
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

    //Update review by book id
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> updateReview(@PathVariable("id") Long bookId,
                                          @Valid @RequestBody ReviewRequest request,
                                          @CurrentAccount Account currUser) {
        return new ResponseEntity<>(reviewService.updateReview(bookId, request, currUser), HttpStatus.OK);
    }

    //Hide review by id
    @PutMapping("/hide/{id}")
    @PreAuthorize("hasRole('ADMIN') and hasAuthority('UPDATE_PRIVILEGE')")
    public ResponseEntity<?> hideReview(@PathVariable("id") Long id) {
        reviewService.hideReview(id);
        return new ResponseEntity<>("Review hid successfully!", HttpStatus.OK);
    }

    //Unhide
    @PutMapping("/unhide/{id}")
    @PreAuthorize("hasRole('ADMIN') and hasAuthority('UPDATE_PRIVILEGE')")
    public ResponseEntity<?> unhideReview(@PathVariable("id") Long id) {
        reviewService.unhideReview(id);
        return new ResponseEntity<>("Review unhid successfully!", HttpStatus.CREATED);
    }

    //Delete review
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') and hasAuthority('DELETE_PRIVILEGE')")
    public ResponseEntity<?> deleteReview(@PathVariable("id") Long id) {
        reviewService.deleteReview(id);
        return new ResponseEntity<>("Review deleted successfully!", HttpStatus.OK);
    }

    //Delete multiples reviews in a lists of {ids}
    @DeleteMapping("/delete-multiples")
    @PreAuthorize("hasRole('ADMIN') and hasAuthority('DELETE_PRIVILEGE')")
    public ResponseEntity<?> deleteReviews(@RequestParam("ids") List<Long> ids) {
        reviewService.deleteReviews(ids);
        return new ResponseEntity<>("Reviews deleted successfully!", HttpStatus.OK);
    }

    //Delete multiple reviews not in lists of {ids}
    @DeleteMapping("/delete-inverse")
    @PreAuthorize("hasRole('ADMIN') and hasAuthority('DELETE_PRIVILEGE')")
    public ResponseEntity<?> deleteReviewsInverse(@RequestParam(value = "bookId", required = false) Long bookId,
                                                  @RequestParam(value = "userId", required = false) Long userId,
                                                  @RequestParam(value = "rating", required = false) Integer rating,
                                                  @RequestParam(value = "keyword", defaultValue = "") String keyword,
                                                  @RequestParam("ids") List<Long> ids) {
        reviewService.deleteReviewsInverse(bookId, userId, rating, keyword, ids);
        return new ResponseEntity<>("Reviews deleted successfully!", HttpStatus.OK);
    }

    //Delete all reviews
    @DeleteMapping("/delete-all")
    @PreAuthorize("hasRole('ADMIN') and hasAuthority('DELETE_PRIVILEGE')")
    public ResponseEntity<?> deleteAllReviews() {
        reviewService.deleteAllReviews();
        return new ResponseEntity<>("All reviews deleted successfully!", HttpStatus.OK);
    }
}
