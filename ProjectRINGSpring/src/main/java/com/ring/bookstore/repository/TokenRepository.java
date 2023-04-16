package com.ring.bookstore.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.ring.bookstore.model.Token;

import java.util.List;
import java.util.Optional;


public interface TokenRepository extends JpaRepository<Token, Integer> {

    @Query("""
    select t from Token t inner join Account a on t.user.userName = a.userName 
    where a.userName = :userName and (t.expired = false or t.revoked = false)
    """)
    List<Token> findAllValidTokensByUser(String userName);

    Optional<Token> findByToken(String token);
}
