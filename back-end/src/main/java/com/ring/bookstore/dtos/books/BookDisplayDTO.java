package com.ring.bookstore.dtos.books;

import com.ring.bookstore.dtos.images.ImageDTO;

import java.math.BigDecimal;

public record BookDisplayDTO(Long id,
                             String slug,
                             String title,
                             ImageDTO image,
                             String description,
                             Double price,
                             BigDecimal discount,
                             Short amount,
                             Long shopId,
                             String shopName,
                             Double rating,
                             Integer totalOrders) {

}
