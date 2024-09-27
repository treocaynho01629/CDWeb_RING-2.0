package com.ring.bookstore.dtos;

import java.math.BigDecimal;

public record BookDTO(Long id,
                      String slug,
                      String title,
                      String description,
                      String image,
                      Double price,
                      BigDecimal discount,
                      Short amount,
                      Long shopId,
                      String shopName,
                      Double rating,
                      Integer totalOrders) {

}
