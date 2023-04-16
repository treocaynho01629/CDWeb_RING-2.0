package com.ring.bookstore.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ring.bookstore.exception.ResourceNotFoundException;
import com.ring.bookstore.model.Account;
import com.ring.bookstore.repository.AccountRepository;
import com.ring.bookstore.service.AccountService;

@Service
public class AccountServiceImpl implements AccountService {
	
	private AccountRepository accountRepository;
	
	//if class has only 1 constructor, autowired is not needed (use constructor instead)
	public AccountServiceImpl(AccountRepository accountRepository) {
		super();
		this.accountRepository = accountRepository;
	}

	//Tạo acc
	public Account saveAccount(Account account) {
		return accountRepository.save(account);
	}

	//Lấy tất cả acc
	public List<Account> getAllAccounts() {
		return accountRepository.findAll();
	}

	//Lấy acc theo id
	public Account getAccountById(long id) {
		return accountRepository.findById(id).orElseThrow(() -> 
					new ResourceNotFoundException("Account", "Id", id)); //exception nếu ko tồn tại
	}

	//Chỉnh sửa acc
	public Account updateAccount(Account account, long id) {
		
		//kiểm tra + lấy acc có tồn tại trong DB?
		Account currAcc = getAccountById(id);
		
		//set
		currAcc.setUserName(account.getUsername());
		currAcc.setPass(account.getPass());
		currAcc.setEmail(account.getEmail());
		
		//save
		accountRepository.save(currAcc);
		return currAcc;
	}

	public void deleteAccount(long id) {
		
		//kiểm tra acc có tồn tại trong DB?
		getAccountById(id);
		
		//delete
		accountRepository.deleteById(id);
	}

}
