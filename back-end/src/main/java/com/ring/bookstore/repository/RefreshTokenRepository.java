package com.ring.bookstore.repository;

import com.ring.bookstore.model.AccountToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<AccountToken, Long>{

    @Query("""
        select t from AccountToken t
        join fetch t.user a
        join fetch a.roles r
        where t.refreshToken = :token
        and a.username = :username
    """)
    Optional<AccountToken> findToken(String token, String username);

    @Query("""
        select t from AccountToken t
        join t.user a
        where a.username = :username
    """)
    Optional<AccountToken> findTokenByUserName(String username);

    @Modifying
    @Query("""
        update AccountToken t
        set t.refreshToken = ''
        where t.user.username = :username
    """)
    void clearUserRefreshToken(String username);
}
