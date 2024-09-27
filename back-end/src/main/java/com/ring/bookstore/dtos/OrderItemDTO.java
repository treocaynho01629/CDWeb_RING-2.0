package com.ring.bookstore.dtos;

//Order item
public record OrderItemDTO(Long id,
                           Double price,
                           Short amount,
                           Long bookId,
                           String bookSlug,
                           String image,
                           String bookTitle) {

}
