package com.ring.bookstore.service.impl;

import com.ring.bookstore.exception.ResetPasswordException;
import com.ring.bookstore.model.entity.Account;
import com.ring.bookstore.repository.AccountRepository;
import com.ring.bookstore.service.ResetTokenService;
import com.ring.bookstore.service.TokenService;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

/**
 * Service implementation for managing password reset tokens associated with user accounts.
 */
@Service
@RequiredArgsConstructor
public class ResetTokenServiceImpl implements ResetTokenService {

    private final AccountRepository accRepo;
    private final TokenService tokenService;

    private static final long EXPIRE_TOKEN_TIME = 86400000;

    /**
     * Generates a secure reset token for the specified user account.
     *
     * @param user The account for which to generate the reset token.
     * @return The generated reset token.
     */
    @Transactional
    public String generateResetToken(Account user) {
        String token = tokenService.generateCustomToken(user.getUsername(),
                EXPIRE_TOKEN_TIME,
                user.getPassword());

        user.setResetToken(token);
        accRepo.save(user);
        return token;
    }

    /**
     * Verifies whether the reset token associated with the given user is valid and not expired.
     *
     * @param user The user account to verify the reset token against.
     * @return True if the reset token is valid; otherwise, false.
     */
    public boolean verifyResetToken(Account user) {
        String key = user.getPassword();
        String token = user.getResetToken();
        String username = tokenService.extractCustomUsername(token, key); //Verify with sign in key

        if (username != null) {
            if (!tokenService.isCustomTokenValid(token, username, key)) { //Invalidate token
                user.setResetToken(null); //Set empty
                accRepo.save(user);
                throw new ResetPasswordException(token, "Reset token expired. Please make a new request!");
            }
        }

        return true;
    }

    /**
     * Clears or invalidates the specified reset token, preventing it from being reused.
     *
     * @param token The reset token to clear or invalidate.
     */
    @Transactional
    public void clearResetToken(String token) {
        accRepo.clearResetToken(token);
    }
}
