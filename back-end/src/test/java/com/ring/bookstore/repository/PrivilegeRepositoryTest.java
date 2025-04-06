package com.ring.bookstore.repository;

import com.ring.bookstore.model.enums.PrivilegeType;
import com.ring.bookstore.model.entity.Privilege;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import static org.junit.jupiter.api.Assertions.*;

@Testcontainers
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class PrivilegeRepositoryTest {

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine");

    @Autowired
    private PrivilegeRepository privilegeRepo;

//    @Test
//    public void givenNewPrivilege_whenSavePrivilege_ThenReturnPrivilege() {
//        Privilege privilege = Privilege.builder().privilegeType(PrivilegeType.READ_PRIVILEGE).build();
//
//        Privilege savedPrivilege = privilegeRepo.save(privilege);
//
//        assertNotNull(savedPrivilege);
//        assertNotNull(savedPrivilege.getId());
//    }
//
//    @Test
//    public void whenUpdatePrivilege_ThenReturnUpdatedPrivilege() {
//        Privilege privilege = Privilege.builder().privilegeType(PrivilegeType.READ_PRIVILEGE).build();
//        privilegeRepo.save(privilege);
//        Privilege foundPrivilege = privilegeRepo.findById(privilege.getId()).orElse(null);
//        assertNotNull(foundPrivilege);
//
//        foundPrivilege.setPrivilegeType(PrivilegeType.UPDATE_PRIVILEGE);
//        Privilege updatedPrivilege = privilegeRepo.save(foundPrivilege);
//
//        assertNotNull(updatedPrivilege);
//        assertEquals(PrivilegeType.UPDATE_PRIVILEGE, updatedPrivilege.getPrivilegeType());
//    }
//
//    @Test
//    public void whenDeletePrivilege_ThenFindNull() {
//        Privilege privilege = Privilege.builder().privilegeType(PrivilegeType.READ_PRIVILEGE).build();
//        privilegeRepo.save(privilege);
//
//        privilegeRepo.deleteById(privilege.getId());
//
//        Privilege foundPrivilege = privilegeRepo.findById(privilege.getId()).orElse(null);
//
//        assertNull(foundPrivilege);
//    }
}