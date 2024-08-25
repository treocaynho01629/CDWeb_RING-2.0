package com.ring.bookstore.dtos;

import com.ring.bookstore.enums.OrderStatus;

//Order details
public record OrderDetailDTO(Integer id,
                             String sellerName,
                             Integer amount,
                             Double price,
                             Integer bookId,
                             OrderStatus status,
                             String image,
                             String bookTitle) {

}
