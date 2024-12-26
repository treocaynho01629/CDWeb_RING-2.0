package com.ring.bookstore.dtos.accounts;

//Account
public record AccountDTO(Long id,
                         String username,
                         String email,
                         String image,
                         Short roles) {

}
