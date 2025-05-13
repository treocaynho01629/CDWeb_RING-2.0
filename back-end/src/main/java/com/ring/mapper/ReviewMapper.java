package com.ring.mapper;

import com.cloudinary.Cloudinary;
import com.cloudinary.Transformation;
import com.ring.dto.projection.images.IImage;
import com.ring.dto.projection.reviews.IReview;
import com.ring.dto.response.reviews.ReviewDTO;
import com.ring.model.entity.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

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

        return new ReviewDTO(review.getId(),
                review.getRContent(),
                review.getRating(),
                review.getCreatedDate(),
                review.getLastModifiedDate(),
                user.getId(),
                user.getUsername(),
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
