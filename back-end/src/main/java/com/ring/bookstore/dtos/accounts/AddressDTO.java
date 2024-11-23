package com.ring.bookstore.dtos.accounts;

public record AddressDTO(Long id,
                         String name,
                         String companyName,
                         String phone,
                         String city,
                         String address,
                         String type,
                         Boolean isDefault) {

}
