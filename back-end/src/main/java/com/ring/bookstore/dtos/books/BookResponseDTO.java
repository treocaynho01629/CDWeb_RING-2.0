package com.ring.bookstore.dtos.books;

import java.math.BigDecimal;

public record BookResponseDTO(Long id,
                              String slug,
                              Double price,
                              BigDecimal discount,
                              String title) {

}
