package com.ring.bookstore.service.impl;

import com.ring.bookstore.exception.TokenRefreshException;
import com.ring.bookstore.model.Account;
import com.ring.bookstore.model.AccountToken;
import com.ring.bookstore.repository.RefreshTokenRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private final RefreshTokenRepository refreshRepo;

    private final JwtService jwtService;

    public Optional<AccountToken> findToken(String token, String username) {
        return refreshRepo.findToken(token, username);
    }

    @Transactional
    public ResponseCookie generateRefreshToken(Account user){
        String token = jwtService.generateRefreshToken(user); //Generate refresh token
        AccountToken refreshToken = refreshRepo.findTokenByUserName(user.getUsername())
                .orElse(AccountToken.builder().user(user).build());

        refreshToken.setRefreshToken(token);
        AccountToken savedToken = refreshRepo.save(refreshToken);
        return jwtService.generateRefreshCookie(savedToken.getRefreshToken());
    }

    public boolean verifyToken(AccountToken token) {
        String username = jwtService.extractRefreshUsername(token.getRefreshToken()); //Get username from token

        if (username != null) { //Get stored refresh token by username
            if (!jwtService.isRefreshTokenValid(token.getRefreshToken(), username)) { //Invalidate token
                String oldToken = token.getRefreshToken();
                token.setRefreshToken(""); //Set empty
                refreshRepo.save(token);
                throw new TokenRefreshException(oldToken, "Refresh token expired. Please make a new sign in request!");
            }
        }

        return true;
    }

    @Transactional
    public void clearUserRefreshToken(String username) {
        refreshRepo.clearUserRefreshToken(username);
    }
}
