package com.ring.bookstore.dtos.accounts;

import com.ring.bookstore.model.Address;

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
                               Address address,
                               LocalDate dob) {

}
