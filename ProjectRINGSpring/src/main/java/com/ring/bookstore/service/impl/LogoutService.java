package com.ring.bookstore.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.stereotype.Service;

import com.ring.bookstore.repository.TokenRepository;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Service
@RequiredArgsConstructor
public class LogoutService implements LogoutHandler {

    private final TokenRepository tokenRepo;
    @Override
    public void logout(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) {
        //Lấy token hiện tại từ header
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        if (authHeader == null ||!authHeader.startsWith("Bearer ")) return;
        jwt = authHeader.substring(7);

        //Tìm token có trong database hay ko -> trả về boolean
        var storedToken = tokenRepo.findByToken(jwt).orElse(null);

        //Expire + revoked token khi logout
        if (storedToken != null){
            storedToken.setExpired(true);
            storedToken.setRevoked(true);
            tokenRepo.save(storedToken);
        }

        SecurityContext context = SecurityContextHolder.getContext();
        context.setAuthentication(null);

        SecurityContextHolder.clearContext();
        System.out.println("Logout");
    }
}
