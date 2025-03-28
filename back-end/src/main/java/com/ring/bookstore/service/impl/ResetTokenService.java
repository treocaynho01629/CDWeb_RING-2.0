package com.ring.bookstore.service.impl;

import com.ring.bookstore.exception.ResetPasswordException;
import com.ring.bookstore.model.Account;
import com.ring.bookstore.repository.AccountRepository;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ResetTokenService {

    private final AccountRepository accRepo;

    private final JwtService jwtService;

    private static final long EXPIRE_TOKEN_TIME = 86400000;

    @Transactional
    public String generateResetToken(Account user) {
        String token = jwtService.generateCustomToken(user.getUsername(),
                EXPIRE_TOKEN_TIME,
                user.getPassword());

        user.setResetToken(token);
        accRepo.save(user);
        return token;
    }

    public boolean verifyResetToken(Account user) {
        String key = user.getPassword();
        String token = user.getResetToken();
        String username = jwtService.extractCustomUsername(token, key); //Verify with sign in key

        if (username != null) {
            if (!jwtService.isCustomTokenValid(token, username, key)) { //Invalidate token
                user.setResetToken(null); //Set empty
                accRepo.save(user);
                throw new ResetPasswordException(token, "Reset token expired. Please make a new request!");
            }
        }

        return true;
    }

    @Transactional
    public void clearResetToken(String token) {
        accRepo.clearResetToken(token);
    }
}
