package com.ring.bookstore.service.impl;

import com.ring.bookstore.exception.TokenRefreshException;
import com.ring.bookstore.model.Account;
import com.ring.bookstore.model.RefreshToken;
import com.ring.bookstore.repository.RefreshTokenRepository;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepo;

    private final JwtService jwtService;

    @Transactional
    public ResponseCookie generateRefreshToken(Account user){
        String token = jwtService.generateRefreshToken(user); //Generate refresh token
        RefreshToken refreshToken = RefreshToken.builder().refreshToken(token).user(user).build();

        //Set token
        refreshTokenRepo.save(refreshToken);
        return jwtService.generateRefreshCookie(token);
    }

    public boolean verifyRefreshToken(String token) {
        String username = jwtService.extractRefreshUsername(token); //Get username from token

        if (username != null) {
            if (!jwtService.isRefreshTokenValid(token, username)) { //Invalidate token
                //Remove token
                refreshTokenRepo.deleteByRefreshToken(token);
                throw new TokenRefreshException(token, "Refresh token expired. Please make a new sign in request!");
            }
        }

        return true;
    }

    @Transactional
    public void clearRefreshToken(String token) {
        refreshTokenRepo.deleteByRefreshToken(token);
    }
}
