package com.ring.bookstore.dtos.orders;

import lombok.Builder;

import java.math.BigDecimal;

//Order item
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
