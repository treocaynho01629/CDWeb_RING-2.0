package com.ring.bookstore.dtos;

import java.time.LocalDateTime;

public record ReviewDTO(String content, Integer rating, LocalDateTime date, String userName) {

}
