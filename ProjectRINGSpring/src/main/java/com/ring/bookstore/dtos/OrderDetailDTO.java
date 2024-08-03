package com.ring.bookstore.dtos;

//Order details
public record OrderDetailDTO(Integer id,
                             String sellerName,
                             Integer amount,
                             Double price,
                             Integer bookId,
                             String image,
                             String bookTitle) {

}
