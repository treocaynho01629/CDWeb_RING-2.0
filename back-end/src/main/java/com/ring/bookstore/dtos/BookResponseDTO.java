package com.ring.bookstore.dtos;

import com.ring.bookstore.model.Category;
import com.ring.bookstore.model.Publisher;

import java.math.BigDecimal;
import java.time.LocalDate;

public record BookResponseDTO(Long id,
                              Double price,
                              BigDecimal onSale,
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
