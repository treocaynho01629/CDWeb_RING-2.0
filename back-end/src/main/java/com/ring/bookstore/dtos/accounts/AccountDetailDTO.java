package com.ring.bookstore.dtos.accounts;

import java.time.LocalDate;

//Account details
public record AccountDetailDTO(Long id,
                               String username,
                               String image,
                               String email,
                               Integer roles,
                               String name,
                               String phone,
                               String gender,
                               String address,
                               LocalDate dob) {

}
