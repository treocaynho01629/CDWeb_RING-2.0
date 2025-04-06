package com.ring.bookstore.repository;

import com.ring.bookstore.model.entity.Privilege;
import com.ring.bookstore.model.enums.PrivilegeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

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
}
