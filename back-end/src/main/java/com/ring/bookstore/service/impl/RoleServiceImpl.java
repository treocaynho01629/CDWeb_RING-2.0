package com.ring.bookstore.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.ring.bookstore.enums.RoleName;
import com.ring.bookstore.model.Role;
import com.ring.bookstore.repository.RoleRepository;
import com.ring.bookstore.service.RoleService;

import java.util.Optional;


@RequiredArgsConstructor
@Service
public class RoleServiceImpl implements RoleService {
	
    private final RoleRepository roleRepo;
    
    //Find by role {name}
    @Override
    public Optional<Role> findByRoleName(RoleName roleName) {
        return roleRepo.findByRoleName(roleName);
    }

    //Create new role
    @Override
    public void save(Role role) {
        roleRepo.save(role);
    }

}
