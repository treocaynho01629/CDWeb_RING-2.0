package com.ring.dto.projection.accounts;

import com.ring.model.entity.Address;

/**
 * Represents an address projection as {@link IAddress}, containing the address details
 * and a flag indicating whether the address is the default one.
 */
public interface IAddress {

    Address getAddress();

    Boolean getIsDefault();
}
