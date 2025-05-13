package com.ring.dto.response.accounts;

import com.ring.model.enums.UserRole;
import lombok.Builder;

import java.util.List;

/**
 * Represents an account response as {@link AccountDTO}.
 */
@Builder
public record AccountDTO(Long id,
                         String username,
                         String email,
                         String name,
                         String phone,
                         String image,
                         List<UserRole> roles) {

}
