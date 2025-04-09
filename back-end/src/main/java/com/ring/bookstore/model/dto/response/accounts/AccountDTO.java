package com.ring.bookstore.model.dto.response.accounts;

import com.ring.bookstore.model.enums.UserRole;

import java.util.List;

/**
 * Represents an account response as {@link AccountDTO}.
 */
public record AccountDTO(Long id,
                         String username,
                         String email,
                         String name,
                         String phone,
                         String image,
                         List<UserRole> roles) {

}
