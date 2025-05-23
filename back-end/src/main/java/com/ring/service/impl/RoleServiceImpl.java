package com.ring.service.impl;

import com.ring.exception.HttpResponseException;
import com.ring.exception.ResourceNotFoundException;
import com.ring.model.entity.Privilege;
import com.ring.model.entity.PrivilegeGroup;
import com.ring.model.entity.Role;
import com.ring.model.enums.PrivilegeType;
import com.ring.model.enums.UserRole;
import com.ring.repository.PrivilegeGroupRepository;
import com.ring.repository.PrivilegeRepository;
import com.ring.repository.RoleRepository;
import com.ring.service.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class RoleServiceImpl implements RoleService {

    private final RoleRepository roleRepo;
    private final PrivilegeRepository privilegeRepo;
    private final PrivilegeGroupRepository groupRepo;

    @Cacheable(cacheNames = "role", key = "#userRole")
    public Role findRole(UserRole userRole) {

        return roleRepo.findRoleWithPrivileges(userRole)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found!",
                        "Không tìm thấy chức vụ yêu cầu!"));
    }

    @Cacheable(cacheNames = "privileges")
    public List<PrivilegeGroup> getPrivileges() {

        return groupRepo.findAllWithPrivileges();
    }

    @CacheEvict(cacheNames = "role", key = "#userRole")
    public void updateRole(List<PrivilegeType> privileges, UserRole userRole) {

        if (userRole == UserRole.ROLE_ADMIN)
            throw new HttpResponseException(HttpStatus.BAD_REQUEST, "Can not edit Admin role!");
        Role role = roleRepo.findByRoleName(userRole)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found!",
                        "Không tìm thấy chức vụ yêu cầu!"));
        List<Privilege> rolePrivileges = privilegeRepo.findAllByPrivilegeTypeIn(privileges);

        role.setPrivileges(rolePrivileges);
        roleRepo.save(role);
    }
}
