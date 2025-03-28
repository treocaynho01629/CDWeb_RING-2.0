package com.ring.bookstore.repository;

import com.ring.bookstore.enums.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;

import com.ring.bookstore.model.Role;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Byte> {

    Optional<Role> findByRoleName(UserRole userRole); //Find role by {roleName}
}
