package com.ring.bookstore.dtos;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import com.ring.bookstore.model.Category;
import com.ring.bookstore.model.Publisher;

//Book details
public record BookDetailDTO(Long id,
                            String image,
                            List<String> previewImages,
                            Double price,
                            BigDecimal onSale,
                            String title,
                            String description,
                            String type,
                            String author,
                            String sellerName,
                            Publisher publisher,
                            Category category,
                            String size,
                            Integer page,
                            LocalDate date,
                            String language,
                            Double weight,
                            Short amount,
                            Double rating,
                            Integer rateTime,
                            Integer orderTime) {

}
