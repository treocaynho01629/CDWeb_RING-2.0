package com.ring.repository;

import com.ring.base.AbstractRepositoryTest;
import com.ring.model.entity.Account;
import com.ring.model.entity.RefreshToken;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

class RefreshTokenRepositoryTest extends AbstractRepositoryTest {

    @Autowired
    private RefreshTokenRepository tokenRepo;

    @Autowired
    private AccountRepository accountRepo;

    @Test
    public void givenNewToken_whenSaveToken_ThenReturnToken() {

        // Given
        RefreshToken token = RefreshToken.builder().refreshToken("test").build();

        // When
        RefreshToken savedToken = tokenRepo.save(token);

        // Then
        assertNotNull(savedToken);
        assertNotNull(savedToken.getId());
    }

    @Test
    public void whenUpdateToken_ThenReturnUpdatedToken() {

        // Given
        RefreshToken token = RefreshToken.builder().refreshToken("test").build();
        tokenRepo.save(token);
        RefreshToken foundToken = tokenRepo.findById(token.getId()).orElse(null);
        assertNotNull(foundToken);

        // When
        foundToken.setRefreshToken("tset");
        RefreshToken updatedToken = tokenRepo.save(foundToken);

        // Then
        assertNotNull(updatedToken);
        assertEquals("tset", updatedToken.getRefreshToken());
    }

    @Test
    public void whenDeleteToken_ThenFindNull() {

        // Given
        Account account = Account.builder()
                .username("initial")
                .pass("asd")
                .email("initialEmail@initial.com")
                .resetToken("reset123")
                .build();
        account.setCreatedDate(LocalDateTime.now());
        accountRepo.save(account);
        RefreshToken token = RefreshToken.builder().refreshToken("test").user(account).build();
        tokenRepo.save(token);

        // When
        tokenRepo.deleteById(token.getId());

        // Then
        RefreshToken foundToken = tokenRepo.findById(token.getId()).orElse(null);
        Account foundAccount = accountRepo.findById(account.getId()).orElse(null);

        assertNull(foundToken);
        assertNotNull(foundAccount);
    }
}