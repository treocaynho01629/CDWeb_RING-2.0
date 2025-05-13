package com.ring.repository;

import com.ring.dto.projection.accounts.IAddress;
import com.ring.model.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface named {@link AddressRepository} for managing {@link Address} entities.
 */
@Repository
public interface AddressRepository extends JpaRepository<Address, Long>{

    /**
     * Retrieves a list of addresses associated with a given profile, along with a flag
     * indicating whether each address is the default one. The results are ordered by
     * the default address flag in descending order.
     *
     * @param profileId the unique identifier of the profile whose addresses are to be retrieved
     * @return a list of {@link IAddress} objects containing address details and a default flag
     */
    @Query("""
        select a as address, (case when p.id is null then false else true end) as isDefault
        from Address a left join AccountProfile p on a.id = p.address.id
        where a.profile.id = :profileId
        order by isDefault desc
	""")
    List<IAddress> findAddressesByProfile(Long profileId);

    /**
     * Retrieves the address associated with the specified profile ID.
     * If the profile has an address, it will also indicate the default status.
     *
     * @param profileId the ID of the profile whose address is to be retrieved
     * @return the address and its default status wrapped in an {@link IAddress} projection
     */
    @Query("""
        select p.address as address, true as isDefault from AccountProfile p
        where p.id = :profileId
	""")
    IAddress findAddressByProfile(Long profileId);
}
