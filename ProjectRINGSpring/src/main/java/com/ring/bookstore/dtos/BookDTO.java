package com.ring.bookstore.dtos;

//Sách
public record BookDTO(Integer id, String title, String description, String image, Double price, int rateTotal, int rateAmount) {

}
