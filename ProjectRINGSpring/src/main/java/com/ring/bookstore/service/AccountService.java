package com.ring.bookstore.service;

import java.util.List;

import org.springframework.data.domain.Page;

import com.ring.bookstore.dtos.AccountDetailDTO;
import com.ring.bookstore.dtos.ProfileDTO;
import com.ring.bookstore.model.Account;
import com.ring.bookstore.model.AccountProfile;
import com.ring.bookstore.request.AccountRequest;
import com.ring.bookstore.request.ChangePassRequest;
import com.ring.bookstore.request.ProfileRequest;
import com.ring.bookstore.response.IChartResponse;

public interface AccountService {
	
	Page<Account> getAllAccounts(Integer pageNo, Integer pageSize, String sortBy, String sortDir);
	Page<Account> getAllEmployees(Integer pageNo, Integer pageSize, String sortBy, String sortDir);
	AccountDetailDTO getAccountById(Integer id);
	Account saveAccount(AccountRequest request);
	Account updateAccount(AccountRequest request, Integer id);
	void deleteAccount(Integer id);
	void deleteAccounts(List<Integer> ids);
	void deleteAllAccounts();
	ProfileDTO getProfile(Account user);
	AccountProfile updateProfile(ProfileRequest request, Account user);
	Account changePassword(ChangePassRequest request, Account user);
	List<IChartResponse> getTopAccount();
	List<IChartResponse> getTopSeller();
}
