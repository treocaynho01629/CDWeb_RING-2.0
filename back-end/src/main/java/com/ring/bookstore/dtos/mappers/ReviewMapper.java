package com.ring.bookstore.dtos.mappers;

import com.cloudinary.Cloudinary;
import com.cloudinary.Transformation;
import com.ring.bookstore.dtos.images.IImage;
import com.ring.bookstore.dtos.reviews.IReview;
import com.ring.bookstore.model.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.ring.bookstore.dtos.reviews.ReviewDTO;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@RequiredArgsConstructor
@Service
public class ReviewMapper {

    private final Cloudinary cloudinary;

    public ReviewDTO reviewToDTO(Review review) {

        Account user = review.getUser();
        AccountProfile profile = (profile = user.getProfile()) != null ? profile : null;
        Image image = profile != null ? profile.getImage() : null;
        String url = image != null ?
                cloudinary.url().transformation(new Transformation()
                                .aspectRatio("1.0")
                                .width(25)
                                .crop("thumb")
                                .chain()
                                .radius("max")
                                .quality("auto")
                                .fetchFormat("auto"))
                        .secure(true).generate(image.getPublicId())
                : null;
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
                url,
                book.getId(),
                book.getTitle(),
                book.getSlug());
    }

    public ReviewDTO projectionToDTO(IReview projection) {

        Review review = projection.getReview();
        IImage image = projection.getImage();
        String url = image != null ?
                cloudinary.url().transformation(new Transformation()
                                .aspectRatio("1.0")
                                .width(25)
                                .crop("thumb")
                                .chain()
                                .radius("max")
                                .quality("auto")
                                .fetchFormat("auto"))
                        .secure(true).generate(image.getPublicId())
                : null;

        return new ReviewDTO(review.getId(),
                review.getRContent(),
                review.getRating(),
                review.getCreatedDate(),
                review.getLastModifiedDate(),
                projection.getUserId(),
                projection.getUsername(),
                url,
                projection.getBookId(),
                projection.getBookTitle(),
                projection.getBookSlug());
    }
}
