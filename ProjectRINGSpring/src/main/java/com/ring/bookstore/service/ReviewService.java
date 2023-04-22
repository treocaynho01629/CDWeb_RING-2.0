package com.ring.bookstore.service;

import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import com.ring.bookstore.dtos.ReviewDTO;

@Service
public interface ReviewService {
	
	Page<ReviewDTO> getReviewsByBookId(long id, int pageNo, int pageSize);
}
