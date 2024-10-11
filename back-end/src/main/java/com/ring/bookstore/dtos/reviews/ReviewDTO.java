package com.ring.bookstore.dtos.reviews;

import java.time.LocalDateTime;

public record ReviewDTO(Long id,
                        String content,
                        Integer rating,
                        LocalDateTime date,
                        LocalDateTime updatedDate,
                        Long userId,
                        String username,
                        String userImage,
                        Long bookId,
                        String bookTitle,
                        String bookSlug) {

}
