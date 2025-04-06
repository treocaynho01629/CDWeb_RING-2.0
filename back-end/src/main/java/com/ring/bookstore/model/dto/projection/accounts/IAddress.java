package com.ring.bookstore.model.dto.projection.accounts;

import com.ring.bookstore.model.entity.Address;

/**
 * Represents an address projection as {@link IAddress}, containing the address details
 * and a flag indicating whether the address is the default one.
 */
public interface IAddress {

    Address getAddress();

    Boolean getIsDefault();
}
