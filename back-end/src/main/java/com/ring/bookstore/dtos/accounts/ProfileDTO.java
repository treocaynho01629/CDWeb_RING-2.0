package com.ring.bookstore.dtos.accounts;

import java.time.LocalDate;
import java.time.LocalDateTime;

//Account's profile
public record ProfileDTO(String image,
                         String name,
                         String email,
                         String phone,
                         String gender,
                         LocalDate dob,
                         LocalDateTime joinedDate,
                         Integer totalFollows,
                         Integer totalReviews) {

}
