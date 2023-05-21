package com.ring.bookstore.dtos;

public record OrderDetailDTO(Integer amount, Double price, Integer bookId, String image, String bookTitle) {

}
