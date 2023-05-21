package com.ring.bookstore.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ring.bookstore.model.AccountProfile;

@Repository
public interface AccountProfileRepository extends JpaRepository<AccountProfile, Integer>{
	
}
