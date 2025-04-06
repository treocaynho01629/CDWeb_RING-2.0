package com.ring.bookstore.model.dto.response.books;

import java.math.BigDecimal;

/**
 * Represents a book response as {@link BookResponseDTO}.
 */
public record BookResponseDTO(Long id,
                              String slug,
                              Double price,
                              BigDecimal discount,
                              String title) {

}
