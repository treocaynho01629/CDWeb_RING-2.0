package com.ring.bookstore.service;

import com.ring.bookstore.dtos.accounts.AddressDTO;
import com.ring.bookstore.model.Account;
import com.ring.bookstore.model.Address;
import com.ring.bookstore.request.AddressRequest;

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
