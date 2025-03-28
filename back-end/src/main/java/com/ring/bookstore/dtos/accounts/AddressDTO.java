package com.ring.bookstore.dtos.accounts;

import com.ring.bookstore.enums.AddressType;

public record AddressDTO(Long id,
                         String name,
                         String companyName,
                         String phone,
                         String city,
                         String address,
                         AddressType type,
                         Boolean isDefault) {

}
