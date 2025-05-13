package com.ring.dto.response.orders;

import lombok.Builder;

import java.math.BigDecimal;

/**
 * Represents an order item response as {@link OrderItemDTO}.
 */
@Builder
public record OrderItemDTO(Long id,
        Double price,
        BigDecimal discount,
        Short quantity,
        Long bookId,
        String bookSlug,
        String image,
        String bookTitle) {

}
