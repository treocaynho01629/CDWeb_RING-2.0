package com.ring.bookstore.dtos.projections;

import com.ring.bookstore.model.Book;
import com.ring.bookstore.model.Review;

public interface IReview {
    Review getReview();

    Long getUserId();

    String getUsername();

    String getImage();

    Long getBookId();

    String getBookTitle();

    String getBookSlug();
}
