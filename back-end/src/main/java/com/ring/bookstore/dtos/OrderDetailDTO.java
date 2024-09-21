package com.ring.bookstore.dtos;

import com.ring.bookstore.enums.OrderStatus;

//Order details
public record OrderDetailDTO(Long id,
                             Long shopId,
                             String shopName,
                             Short amount,
                             Double price,
                             Long bookId,
                             String bookSlug,
                             OrderStatus status,
                             String image,
                             String bookTitle) {

}
