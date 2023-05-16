package com.ring.bookstore.service;

import org.springframework.data.domain.Page;

import com.ring.bookstore.model.Account;
import com.ring.bookstore.request.AccountRequest;

public interface AccountService {
	
	Page<Account> getAllAccounts(Integer pageNo, Integer pageSize, String sortBy, String sortDir);
	Page<Account> getAllEmployees(Integer pageNo, Integer pageSize, String sortBy, String sortDir);
	Account getAccountById(Integer id);
	Account saveAccount(AccountRequest request);
	Account updateAccount(AccountRequest request, Integer id);
	void deleteAccount(Integer id);
}
