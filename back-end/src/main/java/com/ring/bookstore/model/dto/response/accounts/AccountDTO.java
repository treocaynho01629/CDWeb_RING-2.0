package com.ring.bookstore.model.dto.response.accounts;

import com.ring.bookstore.model.enums.UserRole;

//Account
public record AccountDTO(Long id,
                         String username,
                         String email,
                         String name,
                         String phone,
                         String image,
                         UserRole role) {

}
