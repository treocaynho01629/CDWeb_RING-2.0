package com.ring.bookstore.repository;

import com.ring.bookstore.model.RefreshToken;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import static org.junit.jupiter.api.Assertions.*;

@Testcontainers
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class RefreshTokenRepositoryTest {

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine");

    @Autowired
    private RefreshTokenRepository tokenRepo;

    @Test
    public void givenNewToken_whenSaveToken_ThenReturnToken() {
        RefreshToken token = RefreshToken.builder().refreshToken("test").build();

        RefreshToken savedToken = tokenRepo.save(token);

        assertNotNull(savedToken);
        assertNotNull(savedToken.getId());
    }

    @Test
    public void whenUpdateToken_ThenReturnUpdatedToken() {
        RefreshToken token = RefreshToken.builder().refreshToken("test").build();
        tokenRepo.save(token);
        RefreshToken foundToken = tokenRepo.findById(token.getId()).orElse(null);
        assertNotNull(foundToken);

        foundToken.setRefreshToken("tset");
        RefreshToken updatedToken = tokenRepo.save(foundToken);

        assertNotNull(updatedToken);
        assertEquals("tset", updatedToken.getRefreshToken());
    }

    @Test
    public void whenDeleteToken_ThenFindNull() {
        RefreshToken token = RefreshToken.builder().refreshToken("test").build();
        tokenRepo.save(token);

        tokenRepo.deleteById(token.getId());

        RefreshToken foundToken = tokenRepo.findById(token.getId()).orElse(null);

        assertNull(foundToken);
    }
}