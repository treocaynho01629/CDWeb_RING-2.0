package com.ring.bookstore.model.dto.response.accounts;

import com.ring.bookstore.model.entity.Address;

public interface IAddress {

    Address getAddress();

    Boolean getIsDefault();
}
