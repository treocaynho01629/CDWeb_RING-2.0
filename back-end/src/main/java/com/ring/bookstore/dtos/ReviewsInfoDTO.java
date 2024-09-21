package com.ring.bookstore.dtos;

import java.time.LocalDateTime;

public record ReviewDTO(
        Long id,
        String content,
        Integer rating,
        LocalDateTime date,
        LocalDateTime updatedDate,
        String username,
        Long userId,
        String bookTitle,
        Long bookId) {

}
