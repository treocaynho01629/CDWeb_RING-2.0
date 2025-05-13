package com.ring.mapper;

import com.ring.dto.projection.accounts.IAddress;
import com.ring.dto.response.accounts.AddressDTO;
import com.ring.model.entity.Address;
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
