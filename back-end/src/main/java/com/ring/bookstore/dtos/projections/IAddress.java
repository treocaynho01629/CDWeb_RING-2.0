package com.ring.bookstore.dtos.projections;

import com.ring.bookstore.model.Address;

public interface IAddress {

    Address getAddress();

    Boolean getIsDefault();
}
