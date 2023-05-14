package com.ring.bookstore.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
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
	
	//Lấy Review theo sách
	@GetMapping("/{id}")
	public ResponseEntity<?> getReviewByBookId(@PathVariable("id") Integer bookId,
												@RequestParam(value = "pSize", defaultValue = "5") Integer pageSize,
												@RequestParam(value = "pageNo", defaultValue = "0") Integer pageNo){
		return new ResponseEntity< >(reviewService.getReviewsByBookId(bookId, pageNo, pageSize), HttpStatus.OK);
	}
	
	//Review sách
	@PostMapping("/{id}")
	public ResponseEntity<?> reviewBook(@PathVariable("id") Integer bookId,
										@RequestBody @Valid ReviewRequest request,
										@CurrentAccount Account currUser){
		return new ResponseEntity< >(reviewService.review(bookId, request, currUser), HttpStatus.OK);
	}
}
