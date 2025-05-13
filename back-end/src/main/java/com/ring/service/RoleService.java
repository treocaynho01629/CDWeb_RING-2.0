package com.ring.service;

import com.ring.model.entity.PrivilegeGroup;
import com.ring.model.entity.Role;
import com.ring.model.enums.PrivilegeType;
import com.ring.model.enums.UserRole;

import java.util.List;

public interface RoleService {

    Role findRole(UserRole userRole);

    List<PrivilegeGroup> getPrivileges();

    void updateRole(List<PrivilegeType> privileges, UserRole userRole) ;
}
