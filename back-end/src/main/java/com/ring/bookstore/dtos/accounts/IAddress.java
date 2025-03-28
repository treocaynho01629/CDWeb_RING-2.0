package com.ring.bookstore.dtos.accounts;

import com.ring.bookstore.model.Address;

public interface IAddress {

    Address getAddress();

    Boolean getIsDefault();
}
