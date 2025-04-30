package com.ring.bookstore.model.dto.response.accounts;

import com.ring.bookstore.model.enums.Gender;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Represents a profile response as {@link ProfileDTO}.
 */
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
