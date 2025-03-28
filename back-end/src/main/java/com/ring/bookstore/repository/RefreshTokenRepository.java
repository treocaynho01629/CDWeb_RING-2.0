package com.ring.bookstore.repository;

import com.ring.bookstore.model.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long>{
    void deleteByRefreshToken(String token);
}
