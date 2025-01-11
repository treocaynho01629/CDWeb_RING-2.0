package com.ring.bookstore.dtos.books;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import com.ring.bookstore.dtos.categories.CategoryDTO;
import com.ring.bookstore.dtos.publishers.PublisherDTO;
import com.ring.bookstore.dtos.reviews.ReviewsInfoDTO;
import com.ring.bookstore.enums.BookType;

//Book details
public record BookDetailDTO(Long id,
                            String slug,
                            String image,
                            List<String> previews,
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
                            String language,
                            Double weight,
                            Integer totalOrders,
                            ReviewsInfoDTO reviewsInfo) {

}
