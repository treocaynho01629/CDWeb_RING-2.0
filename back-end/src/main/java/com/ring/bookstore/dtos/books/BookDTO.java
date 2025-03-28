package com.ring.bookstore.dtos.books;

import com.ring.bookstore.dtos.categories.CategoryDTO;
import com.ring.bookstore.dtos.publishers.PublisherDTO;
import com.ring.bookstore.enums.BookLanguage;
import com.ring.bookstore.enums.BookType;
import com.ring.bookstore.model.Image;
import lombok.Builder;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Builder
public record BookDTO(Long id,
                      String slug,
                      Image image,
                      List<Image> previews,
                      Double price,
                      BigDecimal discount,
                      String title,
                      String description,
                      BookType type,
                      String author,
                      String size,
                      Integer pages,
                      LocalDate date,
                      BookLanguage language,
                      Double weight,
                      Short amount,
                      PublisherDTO publisher,
                      CategoryDTO category,
                      Long shopId,
                      String shopName) {

}
