package com.ring.bookstore.config;

import com.ring.bookstore.model.entity.Account;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

import java.lang.annotation.*;

/**
 * Custom annotation to inject the currently authenticated user account into method parameters.
 * <p>
 * This annotation is a specialized version of {@link AuthenticationPrincipal}, used to retrieve
 * the current authenticated user from the security context, typically for use in controller methods.
 * </p>
 *
 * <p>
 * This annotation can be applied to method parameters in Spring MVC controller methods, and Spring
 * will automatically inject the currently authenticated {@link Account} object based on the security context.
 * </p>
 *
 * <p>
 * Example usage:
 * </p>
 *
 * <pre>
 *     &#64;GetMapping("/profile")
 *     public String getProfile(&#64;CurrentAccount Account account) {
 *         // The current authenticated user will be injected into the 'account' parameter
 *         return "Welcome, " + account.getUsername();
 *     }
 * </pre>
 */
@Target({ ElementType.PARAMETER, ElementType.ANNOTATION_TYPE })
@Retention(RetentionPolicy.RUNTIME)
@Documented
@AuthenticationPrincipal
public @interface CurrentAccount {
}
