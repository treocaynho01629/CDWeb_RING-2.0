package com.ring.bookstore.dtos.accounts;

import com.ring.bookstore.enums.Gender;

import java.time.LocalDate;
import java.time.LocalDateTime;

//Account's profile
public record ProfileDTO(String image,
                         String name,
                         String email,
                         String phone,
                         Gender gender,
                         LocalDate dob,
                         LocalDateTime joinedDate,
                         Integer totalFollows,
                         Integer totalReviews) {

}
