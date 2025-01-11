package com.ring.bookstore.dtos.books;

import java.math.BigDecimal;

public record BookDisplayDTO(Long id,
                             String slug,
                             String title,
                             String image,
                             String description,
                             Double price,
                             BigDecimal discount,
                             Short amount,
                             Long shopId,
                             String shopName,
                             Double rating,
                             Integer totalOrders) {

}
