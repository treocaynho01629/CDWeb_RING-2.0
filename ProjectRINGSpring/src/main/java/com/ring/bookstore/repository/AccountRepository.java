package com.ring.bookstore.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ring.bookstore.model.Account;

@Repository
public interface AccountRepository extends JpaRepository<Account, Integer>{
	
	Optional<Account> findByUserName(String userName);
}
