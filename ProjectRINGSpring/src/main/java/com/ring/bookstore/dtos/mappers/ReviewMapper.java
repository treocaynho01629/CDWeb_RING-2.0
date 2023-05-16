package com.ring.bookstore.dtos.mappers;

import java.util.function.Function;

import org.springframework.stereotype.Service;

import com.ring.bookstore.dtos.ReviewDTO;
import com.ring.bookstore.model.Account;
import com.ring.bookstore.model.Review;

@Service
public class ReviewMapper implements Function<Review, ReviewDTO> {
	
    @Override
    public ReviewDTO apply(Review review) {
    	
    	Account user = review.getUser();
    	String userName = "Người dùng RING!";
    	if (user != null) userName = user.getUsername();
    	
        return new ReviewDTO(review.getId()
        		,review.getRContent()
        		,review.getRating()
        		,review.getRDate()
        		,userName
        		,review.getBook().getId());
    }
}
