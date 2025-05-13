package com.ring.base;

import com.ring.model.entity.Account;
import com.ring.model.enums.UserRole;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.TestingAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Collection;
import java.util.Collections;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public abstract class AbstractServiceTest {

    public static void setupSecurityContext(Account account) {

        SimpleGrantedAuthority authority = new SimpleGrantedAuthority(
                account.getRoles().stream().anyMatch(r -> r.getRoleName().equals(UserRole.ROLE_ADMIN))
                        ? UserRole.ROLE_ADMIN.toString()
                        : UserRole.ROLE_SELLER.toString());
        Collection<SimpleGrantedAuthority> authorities = Collections.singleton(authority);
        Authentication auth = new TestingAuthenticationToken(
                null, // principal
                null, // credentials
                authorities);

        SecurityContext context = mock(SecurityContext.class);
        SecurityContextHolder.setContext(context);
        when(context.getAuthentication()).thenReturn(auth);
    }
}
