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

	public Page<ReviewDTO> getReviewsByBookId(long id, int pageNo, int pageSize) {
		Pageable pageable = PageRequest.of(pageNo, pageSize);
        List<Review> reviewsList = reviewRepo.findAllByBookId(id);
        List<ReviewDTO> reviewDtos = reviewsList.stream().map(reviewMapper::apply).collect(Collectors.toList());
        Page<ReviewDTO> reviewsPage = toPage(reviewDtos, pageable);
        return reviewsPage;
	}
	
	//Trang
	private Page<ReviewDTO> toPage(List<ReviewDTO> list, Pageable pageable){
        if(pageable.getOffset() >= list.size()){
            return Page.empty();
        }
        int startIndex = (int) pageable.getOffset();
        int endIndex = ((pageable.getOffset() + pageable.getPageSize()) > list.size())
                ? list.size()
                : (int) (pageable.getOffset() + pageable.getPageSize());
        List<ReviewDTO> subList = list.subList(startIndex, endIndex);
        return new PageImpl<ReviewDTO>(subList, pageable, list.size());
    }
}
