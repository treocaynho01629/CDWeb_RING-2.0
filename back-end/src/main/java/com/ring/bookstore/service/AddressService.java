package com.ring.bookstore.service;

import com.ring.bookstore.model.dto.response.accounts.AddressDTO;
import com.ring.bookstore.model.entity.Account;
import com.ring.bookstore.model.entity.Address;
import com.ring.bookstore.model.dto.request.AddressRequest;

import java.util.List;

public interface AddressService {
    List<AddressDTO> getMyAddresses(Account user);

    AddressDTO getMyAddress(Account user);

    Address getAddress(Long id);

    Address addAddress(AddressRequest request,
                       Account user);

    Address updateAddress(AddressRequest request,
                          Long id,
                          Account user);

    Address deleteAddress(Long id,
                          Account user);
}
