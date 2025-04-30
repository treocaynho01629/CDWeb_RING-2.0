package com.ring.bookstore.config.auditor;

import org.springframework.data.domain.AuditorAware;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;

/**
 * Implementation of {@link AuditorAware} to provide the current auditor (e.g., @CreatedDate, @LastModifiedDate).
 */
public class Auditor implements AuditorAware<String> {

    /**
     * Retrieves the current auditor (username) from the Spring Security context.
     *
     * @return An {@link Optional} containing the username of the currently authenticated user,
     *         or "system" if no authentication is available.
     */
    @Override
    public Optional<String> getCurrentAuditor() {
        SecurityContext context = SecurityContextHolder.getContext();
        Authentication authentication = context.getAuthentication();

        return authentication != null ? Optional.of((String) authentication.getName()) : Optional.of("system");
    }
}
