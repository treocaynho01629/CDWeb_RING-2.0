package com.ring.bookstore.dtos;

//Order details
public record OrderDetailDTO(Integer amount, Double price, Integer bookId, String image, String bookTitle) {

}
