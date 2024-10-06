package com.ring.bookstore.dtos;

import com.ring.bookstore.enums.OrderStatus;

//Order item
public record OrderItemDTO(Long id,
                           Double price,
                           Short amount,
                           OrderStatus status,

                           Long bookId,
                           String bookSlug,
                           String image,
                           String bookTitle) {

}
