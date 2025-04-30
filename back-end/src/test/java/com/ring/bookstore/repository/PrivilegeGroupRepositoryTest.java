package com.ring.bookstore.repository;

import com.ring.bookstore.base.AbstractRepositoryTest;
import com.ring.bookstore.model.entity.Privilege;
import com.ring.bookstore.model.entity.PrivilegeGroup;
import com.ring.bookstore.model.entity.Role;
import com.ring.bookstore.model.enums.PrivilegeGroupType;
import com.ring.bookstore.model.enums.PrivilegeType;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class PrivilegeGroupRepositoryTest extends AbstractRepositoryTest {

    @Autowired
    private PrivilegeRepository privilegeRepo;

    @Autowired
    private PrivilegeGroupRepository groupRepo;

    @Test
    public void givenNewGroup_whenSaveGroup_ThenReturnGroup() {

        // Given
        PrivilegeGroup group = PrivilegeGroup.builder().groupName(PrivilegeGroupType.COUPON_PRIVILEGE.getLabel()).build();

        // When
        PrivilegeGroup savedGroup = groupRepo.save(group);

        // Then
        assertNotNull(savedGroup);
        assertNotNull(savedGroup.getId());
    }

    @Test
    public void whenUpdateGroup_ThenReturnUpdatedGroup() {

        // Given
        PrivilegeGroup group = PrivilegeGroup.builder().groupName(PrivilegeGroupType.COUPON_PRIVILEGE.getLabel()).build();
        groupRepo.save(group);
        PrivilegeGroup foundGroup = groupRepo.findById(group.getId()).orElse(null);
        assertNotNull(foundGroup);

        // When
        foundGroup.setGroupName(PrivilegeGroupType.ADDRESS_PRIVILEGE.getLabel());
        PrivilegeGroup updatedGroup = groupRepo.save(foundGroup);

        // Then
        assertNotNull(updatedGroup);
        assertEquals(PrivilegeGroupType.ADDRESS_PRIVILEGE.getLabel(), updatedGroup.getGroupName());
    }

    @Test
    public void whenDeleteGroup_ThenFindNull() {

        // Given
        Privilege privilege = Privilege.builder().privilegeType(PrivilegeType.CREATE_BANNER).build();
        PrivilegeGroup group = PrivilegeGroup.builder().groupPrivileges(
                new ArrayList<>(List.of(privilege))).build();
        privilegeRepo.save(privilege);
        groupRepo.save(group);

        // When
        groupRepo.deleteById(group.getId());

        // Then
        PrivilegeGroup foundGroup = groupRepo.findById(group.getId()).orElse(null);
        Privilege foundPrivilege = privilegeRepo.findById(privilege.getId()).orElse(null);

        assertNull(foundGroup);
        assertNull(foundPrivilege);
    }
}