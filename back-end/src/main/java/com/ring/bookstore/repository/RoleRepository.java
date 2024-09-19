package com.ring.bookstore.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ring.bookstore.enums.RoleName;
import com.ring.bookstore.model.Role;

import java.util.Optional;


public interface RoleRepository extends JpaRepository<Role, Byte> {

    Optional<Role> findByRoleName(RoleName roleName); //Find role by {roleName}
}
