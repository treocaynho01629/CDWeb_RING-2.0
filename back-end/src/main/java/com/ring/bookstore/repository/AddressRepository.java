package com.ring.bookstore.repository;

import com.ring.bookstore.dtos.accounts.IAddress;
import com.ring.bookstore.model.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AddressRepository extends JpaRepository<Address, Long>{

    @Query("""
        select a as address, (case when p.id is null then false else true end) as isDefault
        from Address a left join AccountProfile p on a.id = p.address.id
        where a.profile.id = :profileId
        order by isDefault desc
	""")
    List<IAddress> findAddressesByProfile(Long profileId);

    @Query("""
        select p.address as address, true as isDefault from AccountProfile p
        where p.id = :profileId
	""")
    IAddress findAddressByProfile(Long profileId);
}
