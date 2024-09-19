package com.ring.bookstore.dtos;

import java.math.BigDecimal;

public record BookDTO(Long id,
                      String title,
                      String description,
                      String image,
                      Double price,
                      BigDecimal onSale,
                      Short amount,
                      Double rating,
                      Integer orderTime) {

}
