package com.ring.bookstore.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ring.bookstore.config.CurrentAccount;
import com.ring.bookstore.model.Account;
import com.ring.bookstore.request.ReviewRequest;
import com.ring.bookstore.service.ReviewService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@CrossOrigin("http://localhost:5173")
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {
	
	private final ReviewService reviewService;
	
	//Get all reviews
	@GetMapping
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<?> getAllReviews(@RequestParam(value = "pSize", defaultValue = "5") Integer pageSize,
												@RequestParam(value = "pageNo", defaultValue = "0") Integer pageNo,
												@RequestParam(value = "sortBy", defaultValue = "id") String sortBy,
	    										@RequestParam(value = "sortDir", defaultValue = "asc") String sortDir){
		return new ResponseEntity< >(reviewService.getAllReviews(pageNo, pageSize, sortBy, sortDir), HttpStatus.OK);
	}
	
	//Get reviews for book's {id}
	@GetMapping("/{id}")
	public ResponseEntity<?> getReviewsByBookId(@PathVariable("id") Integer bookId,
												@RequestParam(value = "pSize", defaultValue = "5") Integer pageSize,
												@RequestParam(value = "pageNo", defaultValue = "0") Integer pageNo,
												@RequestParam(value = "sortBy", defaultValue = "id") String sortBy,
	    										@RequestParam(value = "sortDir", defaultValue = "asc") String sortDir){
		return new ResponseEntity< >(reviewService.getReviewsByBookId(bookId, pageNo, pageSize, sortBy, sortDir), HttpStatus.OK);
	}
	
	//Get reviews from user's {id}
	@GetMapping("/user/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<?> getReviewsByUser(@PathVariable("id") Integer userId,
												@RequestParam(value = "pSize", defaultValue = "5") Integer pageSize,
												@RequestParam(value = "pageNo", defaultValue = "0") Integer pageNo,
												@RequestParam(value = "sortBy", defaultValue = "id") String sortBy,
	    										@RequestParam(value = "sortDir", defaultValue = "asc") String sortDir){
		return new ResponseEntity< >(reviewService.getReviewsByUser(userId, pageNo, pageSize, sortBy, sortDir), HttpStatus.OK);
	}
	
	//Get current user's reviews
	@GetMapping("/user")
	@PreAuthorize("hasRole('USER')")
	public ResponseEntity<?> getReviewsByUser(@RequestParam(value = "pSize", defaultValue = "5") Integer pageSize,
												@RequestParam(value = "pageNo", defaultValue = "0") Integer pageNo,
												@RequestParam(value = "sortBy", defaultValue = "id") String sortBy,
	    										@RequestParam(value = "sortDir", defaultValue = "asc") String sortDir,
	        									@CurrentAccount Account currUser){
		return new ResponseEntity< >(reviewService.getReviewsByUser(currUser, pageNo, pageSize, sortBy, sortDir), HttpStatus.OK);
	}
	
	//Review
	@PostMapping("/{id}")
	@PreAuthorize("hasRole('USER')")
	public ResponseEntity<?> reviewBook(@PathVariable("id") Integer bookId,
										@RequestBody @Valid ReviewRequest request,
										@CurrentAccount Account currUser){
		return new ResponseEntity< >(reviewService.review(bookId, request, currUser), HttpStatus.OK);
	}
	
	//Delete review
	@DeleteMapping("/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<?> deleteReview(@PathVariable("id") Integer bookId){
		return new ResponseEntity< >(reviewService.deleteReview(bookId), HttpStatus.OK);
	}
	
	//Delete multiples reviews in a lists of {ids}
    @DeleteMapping("/delete-multiples")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteReviews(@RequestParam("ids") List<Integer> ids) {
    	reviewService.deleteReviews(ids);
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
