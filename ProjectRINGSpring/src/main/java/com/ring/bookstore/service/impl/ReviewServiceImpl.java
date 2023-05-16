package com.ring.bookstore.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.ring.bookstore.dtos.ReviewDTO;
import com.ring.bookstore.dtos.mappers.ReviewMapper;
import com.ring.bookstore.exception.HttpResponseException;
import com.ring.bookstore.exception.ResourceNotFoundException;
import com.ring.bookstore.model.Account;
import com.ring.bookstore.model.Book;
import com.ring.bookstore.model.Review;
import com.ring.bookstore.repository.BookRepository;
import com.ring.bookstore.repository.OrderReceiptRepository;
import com.ring.bookstore.repository.ReviewRepository;
import com.ring.bookstore.request.ReviewRequest;
import com.ring.bookstore.service.ReviewService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class ReviewServiceImpl implements ReviewService {
	
	private final ReviewRepository reviewRepo;
	private final BookRepository bookRepo;
	private final OrderReceiptRepository orderRepo;
	
	@Autowired
	private ReviewMapper reviewMapper;
	
	//review sản phẩm
	public Review review(Integer id, ReviewRequest request, Account user) {
		
		//Kiểm tra sách
		Book book = bookRepo.findById(id).orElseThrow(()-> new ResourceNotFoundException("Book not found"));
		if (!orderRepo.existsByUserBuyBook(id, user.getUsername())) throw new HttpResponseException(HttpStatus.UNAUTHORIZED, "User have not bought the product!");
		
		//Thêm review cho sách
        var review = Review.builder()
                .book(book)
                .rating(request.getRating())
                .rContent(request.getContent())
                .rDate(LocalDateTime.now())
                .user(user)
                .build();
        Review addedReview = reviewRepo.save(review);

        return addedReview;
	}
	
	public Page<ReviewDTO> getAllReviews(Integer pageNo, Integer pageSize, String sortBy, String sortDir) {
		Pageable pageable = PageRequest.of(pageNo, pageSize, sortDir.equals("asc") ? Sort.by(sortBy).ascending()
				: Sort.by(sortBy).descending());
		Page<Review> reviewsList = reviewRepo.findAll(pageable);
		List<ReviewDTO> reviewDtos = reviewsList.stream().map(reviewMapper::apply).collect(Collectors.toList());
        return new PageImpl<ReviewDTO>(reviewDtos, pageable, reviewsList.getTotalElements());
	}

	public Page<ReviewDTO> getReviewsByBookId(Integer id, Integer pageNo, Integer pageSize) {
		Pageable pageable = PageRequest.of(pageNo, pageSize);
		Page<Review> reviewsList = reviewRepo.findAllByBook_Id(id, pageable);
        List<ReviewDTO> reviewDtos = reviewsList.stream().map(reviewMapper::apply).collect(Collectors.toList());
        return new PageImpl<ReviewDTO>(reviewDtos, pageable, reviewsList.getTotalElements());
	}
	
	public Page<ReviewDTO> getReviewsByUser(Integer userId, Integer pageNo, Integer pageSize, String sortBy, String sortDir) {
		Pageable pageable = PageRequest.of(pageNo, pageSize, sortDir.equals("asc") ? Sort.by(sortBy).ascending()
				: Sort.by(sortBy).descending());
		Page<Review> reviewsList = reviewRepo.findAllByUser_Id(userId, pageable);
	    List<ReviewDTO> reviewDtos = reviewsList.stream().map(reviewMapper::apply).collect(Collectors.toList());
	    return new PageImpl<ReviewDTO>(reviewDtos, pageable, reviewsList.getTotalElements());
	}

	public Page<ReviewDTO> getReviewsByUser(Account user, Integer pageNo, Integer pageSize, String sortBy, String sortDir) {
		Pageable pageable = PageRequest.of(pageNo, pageSize, sortDir.equals("asc") ? Sort.by(sortBy).ascending()
				: Sort.by(sortBy).descending());
		Page<Review> reviewsList = reviewRepo.findAllByUser_Id(user.getId(), pageable);
	    List<ReviewDTO> reviewDtos = reviewsList.stream().map(reviewMapper::apply).collect(Collectors.toList());
	    return new PageImpl<ReviewDTO>(reviewDtos, pageable, reviewsList.getTotalElements());
	}
	
	public Review deleteReview(Integer id) {
		Review review = reviewRepo.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Review does not exists!"));
		reviewRepo.deleteById(id);
		return review;
	}
}
