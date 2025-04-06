package com.ring.bookstore.repository;

import com.ring.bookstore.model.entity.PrivilegeGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository interface named {@link PrivilegeGroupRepository} for managing {@link PrivilegeGroup} entities.
 */
@Repository
public interface PrivilegeGroupRepository extends JpaRepository<PrivilegeGroup, Integer> {

    /**
     * Retrieves an optional {@link PrivilegeGroup} entity based on the specified group name.
     *
     * @param name the name of the privilege group to find
     * @return an {@code Optional} containing the {@code PrivilegeGroup} if found, or an empty {@code Optional} if not found
     */
    Optional<PrivilegeGroup> findByGroupName(String name);
}
