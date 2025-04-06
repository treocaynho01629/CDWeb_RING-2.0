package com.ring.bookstore.service;

import org.springframework.stereotype.Service;

import com.ring.bookstore.model.enums.UserRole;
import com.ring.bookstore.model.entity.Role;

import java.util.Optional;

@Service
public interface RoleService {
	
    Optional<Role> findByRoleName(UserRole userRole);
    void save(Role role);
}
