package com.ring.bookstore.dtos.books;

import com.ring.bookstore.model.Category;
import com.ring.bookstore.model.Publisher;

import java.math.BigDecimal;
import java.time.LocalDate;

public record BookResponseDTO(Long id,
                              String slug,

                              Double price,
                              BigDecimal discount,
                              String title,
                              String description,
                              String type,
                              String author,
                              String size,
                              Integer page,
                              LocalDate date,
                              String language,
                              Double weight,
                              Short amount) {

}
