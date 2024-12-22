package com.ring.bookstore.service.impl;

import com.ring.bookstore.exception.ResetPasswordException;
import com.ring.bookstore.model.Account;
import com.ring.bookstore.model.AccountToken;
import com.ring.bookstore.repository.AccountTokenRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ResetTokenService {

    private final AccountTokenRepository accTokenRepo;

    private final JwtService jwtService;

    private static final long EXPIRE_TOKEN_TIME = 86400000;

    @Transactional
    public String generateResetToken(Account user) {
        String token = jwtService.generateCustomToken(user.getUsername(),
                EXPIRE_TOKEN_TIME,
                user.getPassword());
        AccountToken accTokens = accTokenRepo.findAccTokenByUserName(user.getUsername())
                .orElse(AccountToken.builder().user(user).build());

        accTokens.setResetToken(token);
        accTokenRepo.save(accTokens);
        return token;
    }

    public boolean verifyResetToken(AccountToken accToken) {
        String key = accToken.getUser().getPassword();
        String token = accToken.getResetToken();
        String username = jwtService.extractCustomUsername(token, key); //Verify with sign in key

        if (username != null) {
            if (!jwtService.isCustomTokenValid(token, username, key)) { //Invalidate token
                accToken.setResetToken(null); //Set empty
                accTokenRepo.save(accToken);
                throw new ResetPasswordException(token, "Reset token expired. Please make a new request!");
            }
        }

        return true;
    }

    @Transactional
    public void clearResetToken(String token) {
        accTokenRepo.clearResetToken(token);
    }
}
