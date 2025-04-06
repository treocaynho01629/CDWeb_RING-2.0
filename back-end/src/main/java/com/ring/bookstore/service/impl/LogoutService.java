package com.ring.bookstore.service.impl;

import com.ring.bookstore.service.RefreshTokenService;
import com.ring.bookstore.service.TokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.stereotype.Service;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * Service named {@link LogoutService} for handling user logout operations.
 */
@Service
@RequiredArgsConstructor
public class LogoutService implements LogoutHandler { //Logout from security context

    private final TokenService tokenService;
    private final RefreshTokenService refreshService;

    /**
     * Logs out the current user by invalidating the session and clearing any authentication details.
     * This method typically clears cookies or session attributes and performs any necessary cleanup.
     *
     * @param request        The HTTP request containing the user's session or authentication details.
     * @param response       The HTTP response used to clear session cookies or set other logout-related data.
     * @param authentication The current authentication details to be cleared or invalidated.
     */
    @Override
    public void logout(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) {
        //Overwrite refresh cookie + invalidate refresh token
        String refreshToken = tokenService.getRefreshTokenFromCookie(request);
        if (refreshToken != null) refreshService.clearRefreshToken(refreshToken);
        response.setHeader(HttpHeaders.SET_COOKIE, tokenService.clearRefreshCookie().toString());

        SecurityContext context = SecurityContextHolder.getContext(); //Delete context
        context.setAuthentication(null);
        SecurityContextHolder.clearContext();
    }
}
