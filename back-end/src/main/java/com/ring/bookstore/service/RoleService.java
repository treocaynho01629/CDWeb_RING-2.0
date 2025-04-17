package com.ring.bookstore.service;

import com.ring.bookstore.model.entity.PrivilegeGroup;
import com.ring.bookstore.model.entity.Role;
import com.ring.bookstore.model.enums.PrivilegeType;
import com.ring.bookstore.model.enums.UserRole;

import java.util.List;

public interface RoleService {

    Role findRole(UserRole userRole);

    List<PrivilegeGroup> getPrivileges();

    void updateRole(List<PrivilegeType> privileges, UserRole userRole) ;
}
