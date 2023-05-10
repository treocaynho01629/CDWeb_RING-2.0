package com.ring.bookstore.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.ring.bookstore.dtos.ReviewDTO;
import com.ring.bookstore.dtos.mappers.ReviewMapper;
import com.ring.bookstore.model.Review;
import com.ring.bookstore.repository.ReviewRepository;
import com.ring.bookstore.service.ReviewService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class ReviewServiceImpl implements ReviewService {
	
	private final ReviewRepository reviewRepo;
	
	@Autowired
	private ReviewMapper reviewMapper;

	public Page<ReviewDTO> getReviewsByBookId(Integer id, Integer pageNo, Integer pageSize) {
		Pageable pageable = PageRequest.of(pageNo, pageSize);
		Page<Review> reviewsList = reviewRepo.findAllByBook_Id(id, pageable);
        List<ReviewDTO> reviewDtos = reviewsList.stream().map(reviewMapper::apply).collect(Collectors.toList());
        return new PageImpl<ReviewDTO>(reviewDtos, pageable, reviewsList.getTotalElements());
	}
}
