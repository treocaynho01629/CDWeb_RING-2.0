package com.ring.bookstore.repository;

import com.ring.bookstore.base.AbstractRepositoryTest;
import com.ring.bookstore.model.entity.Role;
import com.ring.bookstore.model.enums.UserRole;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;

class RoleRepositoryTest extends AbstractRepositoryTest {

    @Autowired
    private RoleRepository roleRepo;

    @Autowired
    private PrivilegeRepository privilegeRepo;

    @Test
    public void givenNewRole_whenSaveRole_ThenReturnRole() {
        Role role = Role.builder().roleName(UserRole.ROLE_GUEST).build();

        Role savedRole = roleRepo.save(role);

        assertNotNull(savedRole);
        assertNotNull(savedRole.getId());
    }

//    @Test
//    public void whenUpdateRole_ThenReturnUpdatedRole() {
//        Role role = Role.builder().roleName(UserRole.ROLE_GUEST).build();
//        roleRepo.save(role);
//
//        Privilege privilege = Privilege.builder().privilegeType(PrivilegeType.READ_PRIVILEGE).build();
//        privilegeRepo.save(privilege);
//
//        Role foundRole = roleRepo.findById(role.getId()).orElse(null);
//        assertNotNull(foundRole);
//
//        foundRole.setRoleName(UserRole.ROLE_USER);
//        foundRole.setPrivileges(List.of(privilege));
//
//        Role updatedRole = roleRepo.save(foundRole);
//
//        assertNotNull(updatedRole);
//        assertFalse(updatedRole.getPrivileges().isEmpty());
//        assertEquals(UserRole.ROLE_USER, updatedRole.getRoleName());
//    }

    @Test
    public void whenDeleteRole_ThenFindNull() {
        Role role = Role.builder().roleName(UserRole.ROLE_GUEST).build();
        roleRepo.save(role);

        roleRepo.deleteById(role.getId());

        Role foundRole = roleRepo.findById(role.getId()).orElse(null);

        assertNull(foundRole);
    }
}