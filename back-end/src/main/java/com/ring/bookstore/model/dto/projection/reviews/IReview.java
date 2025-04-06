package com.ring.bookstore.model.dto.projection.reviews;

import com.ring.bookstore.model.dto.projection.images.IImage;
import com.ring.bookstore.model.entity.Review;

/**
 * Represents a review projection as {@link IReview}, containing details about a specific review,
 * including the review details, user information, book information, and associated image.
 */
public interface IReview {

    Review getReview();

    Long getUserId();

    String getUsername();

    IImage getImage();

    Long getBookId();

    String getBookTitle();

    String getBookSlug();
}
