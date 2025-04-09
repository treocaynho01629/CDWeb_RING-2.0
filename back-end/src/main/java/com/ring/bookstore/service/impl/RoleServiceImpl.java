package com.ring.bookstore.service.impl;

import com.ring.bookstore.exception.HttpResponseException;
import com.ring.bookstore.exception.ResourceNotFoundException;
import com.ring.bookstore.model.entity.Privilege;
import com.ring.bookstore.model.entity.PrivilegeGroup;
import com.ring.bookstore.model.enums.PrivilegeType;
import com.ring.bookstore.repository.PrivilegeGroupRepository;
import com.ring.bookstore.repository.PrivilegeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.ring.bookstore.model.enums.UserRole;
import com.ring.bookstore.model.entity.Role;
import com.ring.bookstore.repository.RoleRepository;
import com.ring.bookstore.service.RoleService;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class RoleServiceImpl implements RoleService {

    private final RoleRepository roleRepo;
    private final PrivilegeRepository privilegeRepo;
    private final PrivilegeGroupRepository groupRepo;

    @Transactional
    public Role findRole(UserRole userRole) {
        return roleRepo.findRoleWithPrivileges(userRole).orElseThrow(() ->
                new ResourceNotFoundException("Role not found!"));
    }

    @Override
    public List<PrivilegeGroup> getPrivileges() {
        return groupRepo.findAllWithPrivileges();
    }

    @Override
    public void updateRole(List<PrivilegeType> privileges, UserRole userRole) {
        if (userRole == UserRole.ROLE_ADMIN) throw new HttpResponseException(HttpStatus.BAD_REQUEST, "Can not edit Admin role!");
        Role role = roleRepo.findByRoleName(userRole).orElseThrow(() ->
                new ResourceNotFoundException("Role not found!"));
        List<Privilege> rolePrivileges = privilegeRepo.findAllByPrivilegeTypeIn(privileges);

        role.setPrivileges(rolePrivileges);
        roleRepo.save(role);
    }
}
