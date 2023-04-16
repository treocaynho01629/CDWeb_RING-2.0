package com.ring.bookstore.service;

import java.util.List;

import com.ring.bookstore.model.Account;

public interface AccountService {
	
	Account saveAccount(Account account);
	List<Account> getAllAccounts();
	Account getAccountById(long id);
	Account updateAccount(Account account, long id);
	void deleteAccount(long id);
}
