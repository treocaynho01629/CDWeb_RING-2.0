package com.ring.bookstore.repository;

import com.ring.bookstore.model.AccountToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AccountTokenRepository extends JpaRepository<AccountToken, Long>{

    @Query("""
        select t from AccountToken t
        join fetch t.user a
        join fetch a.roles r
        where t.refreshToken = :token
        and a.username = :username
    """)
    Optional<AccountToken> findByRefreshToken(String token, String username);

    @Query("""
        select t from AccountToken t
        join fetch t.user a
        join fetch a.roles r
        where t.resetToken = :token
    """)
    Optional<AccountToken> findByResetToken(String token);

    @Query("""
        select t from AccountToken t
        join t.user a
        where a.username = :username
    """)
    Optional<AccountToken> findAccTokenByUserName(String username);

    @Modifying
    @Query("""
        update AccountToken t
        set t.refreshToken = null
        where t.refreshToken = :token
    """)
    void clearRefreshToken(String token);

    @Modifying
    @Query("""
        update AccountToken t
        set t.resetToken = null
        where t.resetToken = :token
    """)
    void clearResetToken(String token);
}
