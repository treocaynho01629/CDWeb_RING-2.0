package com.ring.bookstore.dtos;

//Chi tiết hoá đơn
public record OrderDetailDTO(Integer amount, Double price, Integer bookId, String image, String bookTitle) {

}
