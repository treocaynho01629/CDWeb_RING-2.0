package com.ring.bookstore.dtos;

import com.ring.bookstore.enums.OrderStatus;

import java.math.BigDecimal;

//Order item
public record OrderItemDTO(Long id,
                           Double price,
                           BigDecimal discount,
                           Short amount,
                           OrderStatus status,
                           Long bookId,
                           String bookSlug,
                           String image,
                           String bookTitle) {

}
