package com.ring.bookstore.config;

import com.ring.bookstore.enums.RoleName;
import com.ring.bookstore.model.Account;
import com.ring.bookstore.model.Role;
import com.ring.bookstore.repository.AccountRepository;
import com.ring.bookstore.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;

@Component
public class SetupDataLoader implements
        ApplicationListener<ContextRefreshedEvent> {

    boolean alreadySetup = false;

    @Autowired
    private AccountRepository accountRepo;

    @Autowired
    private RoleRepository roleRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void onApplicationEvent(ContextRefreshedEvent event) {
        if (alreadySetup) return;

        //Create initial roles
        final Role adminRole = createRoleIfNotFound(RoleName.ROLE_ADMIN);
        final Role sellerRole = createRoleIfNotFound(RoleName.ROLE_SELLER);
        final Role userRole = createRoleIfNotFound(RoleName.ROLE_USER);

        //Create initial user
        createUserIfNotFound("test@test.com",
                "Test",
                "Test",
                new ArrayList<>(Arrays.asList(adminRole, sellerRole, userRole)));

        alreadySetup = true;
    }

    @Transactional
    public Role createRoleIfNotFound(RoleName roleName) {
        Role role = roleRepo.findByRoleName(roleName).orElse(null);
        if (role == null) {
            role = new Role();
        }
        role.setRoleName(roleName);
        roleRepo.save(role);
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
        }
        user.setRoles(roles);
        user = accountRepo.save(user);
        return user;
    }
}
