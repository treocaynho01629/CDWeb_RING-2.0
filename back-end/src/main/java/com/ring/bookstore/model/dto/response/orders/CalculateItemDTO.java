package com.ring.bookstore.model.dto.response.orders;

import java.math.BigDecimal;

/**
 * Represents a cart item response as {@link CalculateItemDTO}.
 */
public record CalculateItemDTO(Double price,
                               BigDecimal discount,
                               Short amount,
                               Short quantity,
                               Long id,
                               String slug,
                               String title) {

}
