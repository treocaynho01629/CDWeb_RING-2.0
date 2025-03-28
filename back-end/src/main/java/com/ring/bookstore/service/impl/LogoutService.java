package com.ring.bookstore.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.stereotype.Service;


import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
public class LogoutService implements LogoutHandler { //Logout from security context

    private final JwtService jwtService;
    private final RefreshTokenService refreshService;

    @Override
    public void logout(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) {
        //Overwrite refresh cookie + invalidate refresh token
        String refreshToken = jwtService.getRefreshTokenFromCookie(request);
        if (refreshToken != null) refreshService.clearRefreshToken(refreshToken);
        response.setHeader(HttpHeaders.SET_COOKIE, jwtService.clearRefreshCookie().toString());

        SecurityContext context = SecurityContextHolder.getContext(); //Delete context
        context.setAuthentication(null);
        SecurityContextHolder.clearContext();
    }

    private String parseJwt(HttpServletRequest request) {
        String headerAuth = request.getHeader("Authorization");
        if (StringUtils.hasText(headerAuth) && headerAuth.startsWith("Bearer ")) {
            return headerAuth.substring(7);
        }
        return null;
    }
}
