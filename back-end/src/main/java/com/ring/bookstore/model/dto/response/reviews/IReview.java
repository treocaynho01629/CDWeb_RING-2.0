package com.ring.bookstore.model.dto.response.reviews;

import com.ring.bookstore.model.dto.response.images.IImage;
import com.ring.bookstore.model.entity.Review;

public interface IReview {
    Review getReview();

    Long getUserId();

    String getUsername();

    IImage getImage();

    Long getBookId();

    String getBookTitle();

    String getBookSlug();
}
