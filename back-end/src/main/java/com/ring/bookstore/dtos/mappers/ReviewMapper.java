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

        String username = user != null ? user.getUsername() : "Người dùng RING!";
        Long userId = user != null ? user.getId() : null;

        return new ReviewDTO(review.getId(),
                review.getRContent(),
                review.getRating(),
                review.getCreatedDate(),
                review.getLastModifiedDate(),
                username,
                userId,
                book.getTitle(),
                book.getId(),
                book.getSlug());
    }
}
