package com.ring.bookstore.dtos.mappers;

import com.ring.bookstore.dtos.reviews.IReview;
import com.ring.bookstore.model.*;
import org.springframework.stereotype.Service;

import com.ring.bookstore.dtos.reviews.ReviewDTO;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@Service
public class ReviewMapper {

    public ReviewDTO reviewToDTO(Review review) {

        Account user = review.getUser();
        AccountProfile profile = (profile = user.getProfile()) != null ? profile : null;
        Image image = profile != null ? profile.getImage() : null;
        String fileDownloadUri = image != null ? image.getFileDownloadUri() : null;
        Book book = review.getBook();

        String username = (username = user.getUsername()) != null ? username  : "Người dùng RING!";
        Long userId = user.getId();

        return new ReviewDTO(review.getId(),
                review.getRContent(),
                review.getRating(),
                review.getCreatedDate(),
                review.getLastModifiedDate(),
                userId,
                username,
                fileDownloadUri,
                book.getId(),
                book.getTitle(),
                book.getSlug());
    }

    public ReviewDTO projectionToDTO(IReview projection) {

        Review review = projection.getReview();
        String fileDownloadUri = projection.getImage() != null ?
                ServletUriComponentsBuilder
                .fromCurrentContextPath()
                .path("/api/images/")
                .path(projection.getImage())
                .toUriString()
                : null;

        return new ReviewDTO(review.getId(),
                review.getRContent(),
                review.getRating(),
                review.getCreatedDate(),
                review.getLastModifiedDate(),
                projection.getUserId(),
                projection.getUsername(),
                fileDownloadUri,
                projection.getBookId(),
                projection.getBookTitle(),
                projection.getBookSlug());
    }
}
