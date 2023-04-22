package com.ring.bookstore.dtos.mappers;

import java.util.function.Function;

import org.springframework.stereotype.Service;

import com.ring.bookstore.dtos.ReviewDTO;
import com.ring.bookstore.model.Review;

@Service
public class ReviewMapper implements Function<Review, ReviewDTO> {
    @Override
    public ReviewDTO apply(Review review) {
        return new ReviewDTO(review.getRContent()
        		,review.getRating()
        		,review.getRDate()
        		,review.getUser().getUsername());
    }
}
