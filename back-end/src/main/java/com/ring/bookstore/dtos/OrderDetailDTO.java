package com.ring.bookstore.dtos;

import com.ring.bookstore.enums.OrderStatus;

//Order details
public record OrderDetailDTO(Long id,
                             String sellerName,
                             Integer amount,
                             Double price,
                             Long bookId,
                             OrderStatus status,
                             String image,
                             String bookTitle) {

}
