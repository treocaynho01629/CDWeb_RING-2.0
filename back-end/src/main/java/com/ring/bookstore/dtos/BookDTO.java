package com.ring.bookstore.dtos;

public record BookDTO(Integer id,
                      String title,
                      String description,
                      String image,
                      Double price,
                      Integer amount,
                      int rateTotal,
                      int rateAmount) {

}
