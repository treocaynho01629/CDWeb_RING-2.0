package com.ring.bookstore.model.dto.response.books;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import com.ring.bookstore.model.dto.response.banners.BannerDTO;
import com.ring.bookstore.model.dto.response.categories.CategoryDTO;
import com.ring.bookstore.model.dto.response.images.ImageDTO;
import com.ring.bookstore.model.dto.response.publishers.PublisherDTO;
import com.ring.bookstore.model.dto.response.reviews.ReviewsInfoDTO;
import com.ring.bookstore.model.enums.BookLanguage;
import com.ring.bookstore.model.enums.BookType;

/**
 * Represents a book detail response as {@link BookDetailDTO}.
 */
public record BookDetailDTO(Long id,
                            String slug,
                            ImageDTO image,
                            List<ImageDTO> previews,
                            Double price,
                            BigDecimal discount,
                            String title,
                            String description,
                            BookType type,
                            String author,
                            Short amount,
                            Long shopId,
                            String shopName,
                            PublisherDTO publisher,
                            CategoryDTO category,
                            String size,
                            Integer pages,
                            LocalDate date,
                            BookLanguage language,
                            Double weight,
                            Integer totalOrders,
                            ReviewsInfoDTO reviewsInfo) {

}
