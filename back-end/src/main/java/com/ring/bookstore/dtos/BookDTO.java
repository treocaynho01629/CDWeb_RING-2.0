package com.ring.bookstore.dtos;

import java.math.BigDecimal;

public record BookDTO(Integer id,
                      String title,
                      String description,
                      String image,
                      Double price,
                      BigDecimal onSale,
                      Integer amount,
                      Double rating,
                      Integer orderTime) {

}
