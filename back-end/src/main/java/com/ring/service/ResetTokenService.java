package com.ring.service;

import com.ring.model.entity.Account;

/**
 * Service interface for managing password reset tokens associated with user accounts.
 */
public interface ResetTokenService {

    /**
     * Generates a secure reset token for the specified user account.
     *
     * @param user The account for which to generate the reset token.
     * @return The generated reset token.
     */
    String generateResetToken(Account user);

    /**
     * Verifies whether the reset token associated with the given user is valid and not expired.
     *
     * @param user The user account to verify the reset token against.
     * @return True if the reset token is valid; otherwise, false.
     */
    boolean verifyResetToken(Account user);

    /**
     * Clears or invalidates the specified reset token, preventing it from being reused.
     *
     * @param token The reset token to clear or invalidate.
     */
    void clearResetToken(String token);

}
