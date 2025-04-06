package com.ring.bookstore.model.dto.response.books;

import com.ring.bookstore.model.dto.response.images.ImageDTO;

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
