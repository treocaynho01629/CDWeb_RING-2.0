package com.ring.bookstore.dtos.reviews;

import com.ring.bookstore.dtos.images.IImage;
import com.ring.bookstore.model.Review;

public interface IReview {
    Review getReview();

    Long getUserId();

    String getUsername();

    IImage getImage();

    Long getBookId();

    String getBookTitle();

    String getBookSlug();
}
