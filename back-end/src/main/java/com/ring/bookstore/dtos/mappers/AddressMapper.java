package com.ring.bookstore.dtos.mappers;

import com.ring.bookstore.dtos.accounts.AddressDTO;
import com.ring.bookstore.dtos.accounts.IAddress;
import com.ring.bookstore.model.*;
import org.springframework.stereotype.Service;

@Service
public class AddressMapper {

    public AddressDTO projectionToDTO(IAddress projection) {
        Address address = projection.getAddress();

        return new AddressDTO(address.getId(),
                address.getName(),
                address.getCompanyName(),
                address.getPhone(),
                address.getCity(),
                address.getAddress(),
                address.getType(),
                projection.getIsDefault());
    }

    public AddressDTO addressToDTO(Address address) {
        return new AddressDTO(address.getId(),
                address.getName(),
                address.getCompanyName(),
                address.getPhone(),
                address.getCity(),
                address.getAddress(),
                address.getType(),
                false);
    }
}
