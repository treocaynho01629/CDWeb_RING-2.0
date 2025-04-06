package com.ring.bookstore.model.dto.response.books;

import com.ring.bookstore.model.dto.response.categories.CategoryDTO;
import com.ring.bookstore.model.dto.response.publishers.PublisherDTO;
import com.ring.bookstore.model.enums.BookLanguage;
import com.ring.bookstore.model.enums.BookType;
import com.ring.bookstore.model.entity.Image;
import lombok.Builder;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * Represents a full book response as {@link BookDTO}.
 */
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
