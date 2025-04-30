package com.ring.bookstore.model.dto.response.accounts;

import com.ring.bookstore.model.enums.AddressType;
import lombok.Builder;

/**
 * Represents an address response as {@link AddressDTO}.
 */
@Builder
public record AddressDTO(Long id,
                         String name,
                         String companyName,
                         String phone,
                         String city,
                         String address,
                         AddressType type,
                         Boolean isDefault) {

}
