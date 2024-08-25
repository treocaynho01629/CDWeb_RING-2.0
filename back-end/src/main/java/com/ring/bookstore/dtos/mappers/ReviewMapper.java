package com.ring.bookstore.dtos.mappers;

import java.util.function.Function;

import com.ring.bookstore.model.Book;
import org.springframework.stereotype.Service;

import com.ring.bookstore.dtos.ReviewDTO;
import com.ring.bookstore.model.Account;
import com.ring.bookstore.model.Review;

@Service
public class ReviewMapper implements Function<Review, ReviewDTO> {
	
    @Override
    public ReviewDTO apply(Review review) {
    	
    	Account user = review.getUser();
		Book book = review.getBook();
    	String userName = "Người dùng RING!";
    	if (user != null) userName = user.getUsername();
    	
        return new ReviewDTO(review.getId()
        		,review.getRContent()
        		,review.getRating()
        		,review.getRDate()
        		,userName
				,user.getId()
				,book.getTitle()
        		,book.getId()
		);
    }
}
