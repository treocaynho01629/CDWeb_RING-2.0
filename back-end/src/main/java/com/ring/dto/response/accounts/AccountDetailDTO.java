package com.ring.dto.response.accounts;

import com.ring.model.enums.Gender;
import com.ring.model.enums.UserRole;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Represents an account detail response as {@link AccountDetailDTO}.
 */
public record AccountDetailDTO(Long id,
                               String username,
                               String image,
                               String email,
                               List<UserRole> roles,
                               String name,
                               String phone,
                               Gender gender,
                               LocalDate dob,
                               LocalDateTime joinedDate,
                               Integer totalFollows,
                               Integer totalReviews) {

}
