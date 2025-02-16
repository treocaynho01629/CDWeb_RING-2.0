package com.ring.bookstore.config;

import com.ring.bookstore.enums.PrivilegeName;
import com.ring.bookstore.enums.RoleName;
import com.ring.bookstore.model.Account;
import com.ring.bookstore.model.Privilege;
import com.ring.bookstore.model.Role;
import com.ring.bookstore.repository.AccountRepository;
import com.ring.bookstore.repository.PrivilegeRepository;
import com.ring.bookstore.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Component
public class SetupDataLoader implements
        ApplicationListener<ContextRefreshedEvent> {

    boolean alreadySetup = false;

    @Autowired
    private AccountRepository accountRepo;

    @Autowired
    private RoleRepository roleRepo;

    @Autowired
    private PrivilegeRepository privilegeRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void onApplicationEvent(ContextRefreshedEvent event) {
        if (alreadySetup) return;

        //Create initial privileges
        final Privilege readPrivilege = createPrivilegeIfNotFound(PrivilegeName.READ_PRIVILEGE);
        final Privilege createPrivilege = createPrivilegeIfNotFound(PrivilegeName.CREATE_PRIVILEGE);
        final Privilege updatePrivilege = createPrivilegeIfNotFound(PrivilegeName.UPDATE_PRIVILEGE);
        final Privilege deletePrivilege = createPrivilegeIfNotFound(PrivilegeName.DELETE_PRIVILEGE);

        List<Privilege> fullPrivileges = Arrays.asList(readPrivilege, createPrivilege, updatePrivilege, deletePrivilege);

        //Create initial roles
        createRoleIfNotFound(RoleName.ROLE_USER, Collections.emptyList());
        createRoleIfNotFound(RoleName.ROLE_SELLER, fullPrivileges);
        final Role adminRole = createRoleIfNotFound(RoleName.ROLE_ADMIN, fullPrivileges);
        final Role guestRole = createRoleIfNotFound(RoleName.ROLE_GUEST, Arrays.asList(readPrivilege));

        //Create initial user
        createUserIfNotFound("test@test.com",
                "Test",
                "Test",
                new ArrayList<>(Arrays.asList(adminRole)));
        createUserIfNotFound("guest@guest.com",
                "Guest",
                "Guest123",
                new ArrayList<>(Arrays.asList(guestRole)));

        alreadySetup = true;
    }

    @Transactional
    public Privilege createPrivilegeIfNotFound(PrivilegeName privilegeName) {
        Privilege privilege = privilegeRepo.findByPrivilegeName(privilegeName).orElse(null);
        if (privilege == null) {
            privilege = new Privilege();
            privilege.setPrivilegeName(privilegeName);
            privilegeRepo.save(privilege);
        }
        return privilege;
    }

    @Transactional
    public Role createRoleIfNotFound(RoleName roleName, Collection<Privilege> privileges) {
        Role role = roleRepo.findByRoleName(roleName).orElse(null);
        if (role == null) {
            role = new Role();
            role.setRoleName(roleName);
            role.setPrivileges(privileges);
            roleRepo.save(role);
        }
        return role;
    }

    @Transactional
    public Account createUserIfNotFound(final String email,
                                        final String username,
                                        final String password,
                                        final Collection<Role> roles) {
        Account user = accountRepo.findByUsername(username).orElse(null);
        if (user == null) {
            user = new Account();
            user.setUsername(username);
            user.setEmail(email);
            user.setPass(passwordEncoder.encode(password));
            user.setActive(true);
            user.setRoles(roles);
            user = accountRepo.save(user);
        }
        return user;
    }
}
