package com.ring.bookstore.dtos.orders;

import com.ring.bookstore.enums.OrderStatus;

import java.math.BigDecimal;

//Order item
public record OrderItemDTO(Long id,
                           Double price,
                           BigDecimal discount,
                           Short quantity,
                           Long bookId,
                           String bookSlug,
                           String image,
                           String bookTitle) {

}
