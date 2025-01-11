package com.ring.bookstore.dtos.books;

import com.ring.bookstore.dtos.categories.CategoryDTO;
import com.ring.bookstore.dtos.images.ImageInfoDTO;
import com.ring.bookstore.dtos.publishers.PublisherDTO;
import com.ring.bookstore.enums.BookType;
import lombok.Builder;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Builder
public record BookDTO(Long id,
                      String slug,
                      ImageInfoDTO image,
                      List<ImageInfoDTO> previews,
                      Double price,
                      BigDecimal discount,
                      String title,
                      String description,
                      BookType type,
                      String author,
                      String size,
                      Integer pages,
                      LocalDate date,
                      String language,
                      Double weight,
                      Short amount,
                      PublisherDTO publisher,
                      CategoryDTO category,
                      Long shopId,
                      String shopName) {

}
