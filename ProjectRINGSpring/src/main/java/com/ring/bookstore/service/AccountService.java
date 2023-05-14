package com.ring.bookstore.service;

import org.springframework.data.domain.Page;

import com.ring.bookstore.model.Account;

public interface AccountService {
	
	Account saveAccount(Account account);
	Page<Account> getAllAccounts(Integer pageNo, Integer pageSize);
	Account getAccountById(Integer id);
	Account updateAccount(Account account, Integer id);
	void deleteAccount(Integer id);
}
