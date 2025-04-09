package com.ring.bookstore.repository;

import com.ring.bookstore.model.entity.Privilege;
import com.ring.bookstore.model.enums.PrivilegeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

/**
 * Repository interface named {@link PrivilegeRepository} for managing {@link Privilege} entities.
 */
@Repository
public interface PrivilegeRepository extends JpaRepository<Privilege, Integer> {

    /**
     * Retrieves a privilege based on its privilege type.
     *
     * @param type the privilege type to search for
     * @return an Optional containing the Privilege associated with the provided privilege type, or an empty Optional if no matching Privilege is found
     */
    Optional<Privilege> findByPrivilegeType(PrivilegeType type);


    /**
     * Retrieves a list of privileges that match any of the specified privilege types.
     *
     * @param types a list of privilege types to filter the privileges
     * @return a list of {@link Privilege} entities that correspond to the specified privilege types
     */
    List<Privilege> findAllByPrivilegeTypeIn(Collection<PrivilegeType> types);
}
