package com.ring.bookstore.dtos;

import java.time.LocalDateTime;

public record ReviewDTO(
        Integer id,
        String content,
        Integer rating,
        LocalDateTime date,
        String userName,
        Integer userId,
        String bookTitle,
        Integer bookId) {

}
