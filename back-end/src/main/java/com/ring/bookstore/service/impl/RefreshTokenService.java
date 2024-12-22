package com.ring.bookstore.service.impl;

import com.ring.bookstore.exception.TokenRefreshException;
import com.ring.bookstore.model.Account;
import com.ring.bookstore.model.AccountToken;
import com.ring.bookstore.repository.AccountTokenRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private final AccountTokenRepository accTokenRepo;

    private final JwtService jwtService;

    @Transactional
    public ResponseCookie generateRefreshToken(Account user){
        String token = jwtService.generateRefreshToken(user); //Generate refresh token
        AccountToken accToken = accTokenRepo.findAccTokenByUserName(user.getUsername())
                .orElse(AccountToken.builder().user(user).build());

        accToken.setRefreshToken(token);
        AccountToken savedToken = accTokenRepo.save(accToken);
        return jwtService.generateRefreshCookie(savedToken.getRefreshToken());
    }

    public boolean verifyRefreshToken(AccountToken token) {
        String username = jwtService.extractRefreshUsername(token.getRefreshToken()); //Get username from token

        if (username != null) { //Get stored refresh token by username
            if (!jwtService.isRefreshTokenValid(token.getRefreshToken(), username)) { //Invalidate token
                String oldToken = token.getRefreshToken();
                token.setRefreshToken(null); //Set empty
                accTokenRepo.save(token);
                throw new TokenRefreshException(oldToken, "Refresh token expired. Please make a new sign in request!");
            }
        }

        return true;
    }

    @Transactional
    public void clearRefreshToken(String token) {
        accTokenRepo.clearRefreshToken(token);
    }
}
