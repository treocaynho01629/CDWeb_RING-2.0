package com.ring.bookstore.dtos;

import java.time.LocalDateTime;

//Đánh giá
public record ReviewDTO(Integer id, String content, Integer rating, LocalDateTime date, String userName, Integer bookId) {

}
