package com.ring.bookstore.dtos.books;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import com.ring.bookstore.dtos.reviews.ReviewsInfoDTO;
import com.ring.bookstore.model.Category;
import com.ring.bookstore.model.Publisher;

//Book details
public record BookDetailDTO(Long id,
                            String slug,

                            String image,
                            List<String> previewImages,
                            Double price,
                            BigDecimal discount,
                            String title,
                            String description,
                            String type,
                            String author,
                            Long shopId,
                            String shopName,
                            Publisher publisher,
                            Category category,
                            String size,
                            Integer page,
                            LocalDate date,
                            String language,
                            Double weight,
                            Short amount,
                            Integer totalOrders,
                            ReviewsInfoDTO reviewsInfo) {

}
