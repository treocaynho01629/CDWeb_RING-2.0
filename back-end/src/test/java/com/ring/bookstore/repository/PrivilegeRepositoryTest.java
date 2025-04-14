package com.ring.bookstore.repository;

import com.ring.bookstore.base.AbstractRepositoryTest;
import com.ring.bookstore.model.entity.Privilege;
import com.ring.bookstore.model.entity.PrivilegeGroup;
import com.ring.bookstore.model.entity.Role;
import com.ring.bookstore.model.enums.PrivilegeType;
import com.ring.bookstore.model.enums.UserRole;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class PrivilegeRepositoryTest extends AbstractRepositoryTest {

    @Autowired
    private PrivilegeRepository privilegeRepo;

    @Autowired
    private RoleRepository roleRepo;

    @Autowired
    private PrivilegeGroupRepository groupRepo;

    @Test
    public void givenNewPrivilege_whenSavePrivilege_ThenReturnPrivilege() {

        // Given
        Privilege privilege = Privilege.builder().privilegeType(PrivilegeType.CREATE_BANNER).build();

        // When
        Privilege savedPrivilege = privilegeRepo.save(privilege);

        // Then
        assertNotNull(savedPrivilege);
        assertNotNull(savedPrivilege.getId());
    }

    @Test
    public void whenUpdatePrivilege_ThenReturnUpdatedPrivilege() {

        // Given
        Privilege privilege = Privilege.builder().privilegeType(PrivilegeType.CREATE_BANNER).build();
        privilegeRepo.save(privilege);
        Privilege foundPrivilege = privilegeRepo.findById(privilege.getId()).orElse(null);
        assertNotNull(foundPrivilege);

        // When
        foundPrivilege.setPrivilegeType(PrivilegeType.UPDATE_BANNER);
        Privilege updatedPrivilege = privilegeRepo.save(foundPrivilege);

        // Then
        assertNotNull(updatedPrivilege);
        assertEquals(PrivilegeType.UPDATE_BANNER, updatedPrivilege.getPrivilegeType());
    }

    @Test
    public void whenDeletePrivilege_ThenFindNull() {

        // Given
        Privilege privilege = Privilege.builder().privilegeType(PrivilegeType.CREATE_BANNER).build();
        PrivilegeGroup group = PrivilegeGroup.builder().groupPrivileges(
                new ArrayList<>(List.of(privilege))).build();
        Role role = Role.builder().roleName(UserRole.ROLE_GUEST).privileges(new ArrayList<>(List.of(privilege))).build();
        privilegeRepo.save(privilege);
        groupRepo.save(group);
        roleRepo.save(role);

        // When
        privilegeRepo.deleteById(privilege.getId());

        // Then
        Privilege foundPrivilege = privilegeRepo.findById(privilege.getId()).orElse(null);
        PrivilegeGroup foundGroup = groupRepo.findById(group.getId()).orElse(null);
        Role foundRole = roleRepo.findById(role.getId()).orElse(null);

        assertNull(foundPrivilege);
        assertNotNull(foundGroup);
        assertNotNull(foundRole);
    }
}