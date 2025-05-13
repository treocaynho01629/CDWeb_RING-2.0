package com.ring.repository;

import com.ring.model.entity.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository interface named {@link RefreshTokenRepository} for managing {@link RefreshToken} entities.
 */
@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {

    /**
     * Deletes a {@link RefreshToken} entity based on the provided refresh token.
     *
     * @param token the refresh token used to identify the {@link RefreshToken} to be deleted
     */
    void deleteByRefreshToken(String token);
}
