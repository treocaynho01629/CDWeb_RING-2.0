package com.ring.bookstore.repository;

import com.ring.bookstore.model.entity.Role;
import com.ring.bookstore.model.enums.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository interface named {@link RoleRepository} for managing {@link Role} entities.
 */
@Repository
public interface RoleRepository extends JpaRepository<Role, Byte> {

    /**
     * Finds a {@link Role} entity by its role name.
     *
     * @param userRole the role name of type {@link UserRole} to search for
     * @return an {@link Optional} containing the {@link Role} if found, or empty if not found
     */
    Optional<Role> findByRoleName(UserRole userRole);
}
