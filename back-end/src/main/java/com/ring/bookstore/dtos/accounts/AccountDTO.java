package com.ring.bookstore.dtos.accounts;

import com.ring.bookstore.enums.RoleName;

//Account
public record AccountDTO(Long id,
                         String username,
                         String email,
                         String name,
                         String phone,
                         String image,
                         RoleName role) {

}
