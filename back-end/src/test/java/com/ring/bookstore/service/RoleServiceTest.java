package com.ring.bookstore.service;

import com.ring.bookstore.base.AbstractServiceTest;
import com.ring.bookstore.exception.HttpResponseException;
import com.ring.bookstore.exception.ResourceNotFoundException;
import com.ring.bookstore.model.entity.Privilege;
import com.ring.bookstore.model.entity.PrivilegeGroup;
import com.ring.bookstore.model.entity.Role;
import com.ring.bookstore.model.enums.PrivilegeGroupType;
import com.ring.bookstore.model.enums.PrivilegeType;
import com.ring.bookstore.model.enums.UserRole;
import com.ring.bookstore.repository.PrivilegeGroupRepository;
import com.ring.bookstore.repository.PrivilegeRepository;
import com.ring.bookstore.repository.RoleRepository;
import com.ring.bookstore.service.impl.RoleServiceImpl;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.http.HttpStatus;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class RoleServiceTest extends AbstractServiceTest {

        @Mock
        private RoleRepository roleRepo;

        @Mock
        private PrivilegeRepository privilegeRepo;

        @Mock
        private PrivilegeGroupRepository groupRepo;

        @InjectMocks
        private RoleServiceImpl roleService;

        private Role userRole;
        private Role adminRole;
        private Privilege privilege1;
        private Privilege privilege2;
        private PrivilegeGroup group1;
        private PrivilegeGroup group2;

//        @BeforeAll
//        public void setUp() {
//
//                // Setup test data
//                privilege1 = Privilege.builder()
//                                .id(1)
//                                .privilegeType(PrivilegeType.READ_ADDRESS)
//                                .build();
//
//                privilege2 = Privilege.builder()
//                                .id(2)
//                                .privilegeType(PrivilegeType.WRITE_ORDER)
//                                .build();
//
//                group1 = PrivilegeGroup.builder()
//                                .id(1)
//                                .groupName("Group 1")
//                                .groupPrivileges(List.of(privilege1))
//                                .build();
//
//                group2 = PrivilegeGroup.builder()
//                                .id(2)
//                                .groupName("Group 2")
//                                .groupPrivileges(List.of(privilege2))
//                                .build();
//
//                userRole = Role.builder()
//                                .roleName(UserRole.ROLE_USER)
//                                .privileges(List.of(privilege1))
//                                .build();
//
//                adminRole = Role.builder()
//                                .roleName(UserRole.ROLE_ADMIN)
//                                .privileges(List.of(privilege1, privilege2))
//                                .build();
//        }
//
//        @Test
//        void givenValidUserRole_whenFindRole_thenReturnRole() {
//                // Given
//                when(roleRepo.findRoleWithPrivileges(UserRole.ROLE_USER))
//                                .thenReturn(Optional.of(userRole));
//
//                // When
//                Role result = roleService.findRole(UserRole.ROLE_USER);
//
//                // Then
//                assertNotNull(result);
//                assertEquals(UserRole.ROLE_USER, result.getRoleName());
//                assertEquals(1, result.getPrivileges().size());
//                verify(roleRepo).findRoleWithPrivileges(UserRole.ROLE_USER);
//        }
//
//        @Test
//        void givenNonExistingRole_whenFindRole_thenThrowException() {
//                // Given
//                when(roleRepo.findRoleWithPrivileges(UserRole.ROLE_USER))
//                                .thenReturn(Optional.empty());
//
//                // When & Then
//                ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class,
//                                () -> roleService.findRole(UserRole.ROLE_USER));
//
//                assertEquals("Role not found!", exception.getError());
//                verify(roleRepo).findRoleWithPrivileges(UserRole.ROLE_USER);
//        }
//
//        @Test
//        void whenGetPrivileges_thenReturnAllPrivilegeGroups() {
//                // Given
//                when(groupRepo.findAllWithPrivileges())
//                                .thenReturn(Arrays.asList(group1, group2));
//
//                // When
//                List<PrivilegeGroup> result = roleService.getPrivileges();
//
//                // Then
//                assertNotNull(result);
//                assertEquals(2, result.size());
//                verify(groupRepo).findAllWithPrivileges();
//        }
//
//        @Test
//        void givenValidPrivilegesAndUserRole_whenUpdateRole_thenUpdateSuccessfully() {
//                // Given
//                List<PrivilegeType> newPrivileges = Arrays.asList(PrivilegeType.READ, PrivilegeType.WRITE);
//                when(roleRepo.findByRoleName(UserRole.ROLE_USER))
//                                .thenReturn(Optional.of(userRole));
//                when(privilegeRepo.findAllByPrivilegeTypeIn(newPrivileges))
//                                .thenReturn(Arrays.asList(privilege1, privilege2));
//
//                // When
//                roleService.updateRole(newPrivileges, UserRole.ROLE_USER);
//
//                // Then
//                verify(roleRepo).findByRoleName(UserRole.ROLE_USER);
//                verify(privilegeRepo).findAllByPrivilegeTypeIn(newPrivileges);
//                verify(roleRepo).save(userRole);
//        }
//
//        @Test
//        void givenAdminRole_whenUpdateRole_thenThrowException() {
//                // Given
//                List<PrivilegeType> newPrivileges = Arrays.asList(PrivilegeType.READ, PrivilegeType.WRITE);
//
//                // When & Then
//                HttpResponseException exception = assertThrows(HttpResponseException.class,
//                                () -> roleService.updateRole(newPrivileges, UserRole.ROLE_ADMIN));
//
//                assertEquals(HttpStatus.BAD_REQUEST, exception.getStatus());
//                assertEquals("Can not edit Admin role!", exception.getError());
//                verify(roleRepo, never()).findByRoleName(any());
//                verify(privilegeRepo, never()).findAllByPrivilegeTypeIn(any());
//                verify(roleRepo, never()).save(any());
//        }
//
//        @Test
//        void givenNonExistingRole_whenUpdateRole_thenThrowException() {
//                // Given
//                List<PrivilegeType> newPrivileges = Arrays.asList(PrivilegeType.READ, PrivilegeType.WRITE);
//                when(roleRepo.findByRoleName(UserRole.ROLE_USER))
//                                .thenReturn(Optional.empty());
//
//                // When & Then
//                ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class,
//                                () -> roleService.updateRole(newPrivileges, UserRole.ROLE_USER));
//
//                assertEquals("Role not found!", exception.getError());
//                verify(roleRepo).findByRoleName(UserRole.ROLE_USER);
//                verify(privilegeRepo, never()).findAllByPrivilegeTypeIn(any());
//                verify(roleRepo, never()).save(any());
//        }
}