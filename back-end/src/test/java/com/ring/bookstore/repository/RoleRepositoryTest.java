package com.ring.bookstore.repository;

import com.ring.bookstore.base.AbstractRepositoryTest;
import com.ring.bookstore.model.entity.Account;
import com.ring.bookstore.model.entity.Privilege;
import com.ring.bookstore.model.entity.Role;
import com.ring.bookstore.model.enums.PrivilegeType;
import com.ring.bookstore.model.enums.UserRole;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class RoleRepositoryTest extends AbstractRepositoryTest {

    @Autowired
    private RoleRepository roleRepo;

    @Autowired
    private PrivilegeRepository privilegeRepo;

    @Autowired
    private AccountRepository accountRepo;

    @Test
    public void givenNewRole_whenSaveRole_ThenReturnRole() {

        // Given
        Role role = Role.builder().roleName(UserRole.ROLE_GUEST).build();

        // When
        Role savedRole = roleRepo.save(role);

        // Then
        assertNotNull(savedRole);
        assertNotNull(savedRole.getId());
    }

    @Test
    public void whenUpdateRole_ThenReturnUpdatedRole() {

        // Given
        Role role = Role.builder().roleName(UserRole.ROLE_GUEST).build();
        roleRepo.save(role);

        Privilege privilege = Privilege.builder().privilegeType(PrivilegeType.UPDATE_BANNER).build();
        privilegeRepo.save(privilege);

        Role foundRole = roleRepo.findById(role.getId()).orElse(null);
        assertNotNull(foundRole);

        // When
        foundRole.setRoleName(UserRole.ROLE_USER);
        foundRole.setPrivileges(new ArrayList<>(List.of(privilege)));

        Role updatedRole = roleRepo.save(foundRole);

        // Then
        assertNotNull(updatedRole);
        assertFalse(updatedRole.getPrivileges().isEmpty());
        assertEquals(UserRole.ROLE_USER, updatedRole.getRoleName());
    }

    @Test
    public void whenDeleteRole_ThenFindNull() {

        // Given
        Privilege privilege = Privilege.builder().privilegeType(PrivilegeType.UPDATE_BANNER).build();
        privilegeRepo.save(privilege);
        Role role = Role.builder().roleName(UserRole.ROLE_GUEST).privileges(List.of(privilege)).build();
        roleRepo.save(role);
        Account account = Account.builder()
                .username("initial")
                .pass("asd")
                .email("initialEmail@initial.com")
                .roles(List.of(role))
                .resetToken("reset123")
                .build();
        accountRepo.save(account);

        // When
        roleRepo.deleteById(role.getId());

        // Then
        Role foundRole = roleRepo.findById(role.getId()).orElse(null);
        Privilege foundPrivilege = privilegeRepo.findById(privilege.getId()).orElse(null);
        Account foundAccount = accountRepo.findById(account.getId()).orElse(null);

        assertNull(foundRole);
        assertNotNull(foundPrivilege);
        assertNotNull(foundAccount);
    }
}