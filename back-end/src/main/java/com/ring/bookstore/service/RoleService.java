package com.ring.bookstore.service;

import com.ring.bookstore.model.entity.Role;
import com.ring.bookstore.model.enums.UserRole;

import java.util.Optional;

public interface RoleService {
	
    Optional<Role> findByRoleName(UserRole userRole);

    void save(Role role);
}
