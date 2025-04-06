package com.ring.bookstore.model.dto.response.accounts;

import com.ring.bookstore.model.enums.Gender;

import java.time.LocalDate;
import java.time.LocalDateTime;

//Account details
public record AccountDetailDTO(Long id,
                               String username,
                               String image,
                               String email,
                               Short roles,
                               String name,
                               String phone,
                               Gender gender,
                               LocalDate dob,
                               LocalDateTime joinedDate,
                               Integer totalFollows,
                               Integer totalReviews) {

}
