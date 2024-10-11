package com.ring.bookstore.dtos.accounts;

import java.time.LocalDate;

//Account's profile
public record ProfileDTO(String username,
                         String image,
                         String email,
                         String name,
                         String phone,
                         String gender,
                         LocalDate dob,
                         String address) {

}
