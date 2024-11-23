package com.ring.bookstore.dtos.mappers;

import com.ring.bookstore.dtos.accounts.AddressDTO;
import com.ring.bookstore.dtos.projections.IAddress;
import com.ring.bookstore.model.Address;
import org.springframework.stereotype.Service;

import java.util.function.Function;

@Service
public class AddressMapper implements Function<IAddress, AddressDTO> {

    @Override
    public AddressDTO apply(IAddress projection) {
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
}
