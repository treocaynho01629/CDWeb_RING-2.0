package com.ring.bookstore.service.impl;

import java.util.List;

import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.ring.bookstore.exception.ResourceNotFoundException;
import com.ring.bookstore.model.Account;
import com.ring.bookstore.repository.AccountRepository;
import com.ring.bookstore.service.AccountService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class AccountServiceImpl implements AccountService {
	
	private final AccountRepository accRepo;
	
	//Tạo acc
	public Account saveAccount(Account account) {
		return accRepo.save(account);
	}

	//Lấy tất cả acc
	public List<Account> getAllAccounts() {
		return accRepo.findAll();
	}

	//Lấy acc theo id
	public Account getAccountById(Integer id) {
		return accRepo.findById(id).orElseThrow(() -> 
					new ResourceNotFoundException("User does not exists!")); //exception nếu ko tồn tại
	}

	//Chỉnh sửa acc
	public Account updateAccount(Account account, Integer id) {
		
		//kiểm tra + lấy acc có tồn tại trong DB?
		Account currAcc = getAccountById(id);
		
		//set
		currAcc.setUserName(account.getUsername());
		currAcc.setPass(account.getPass());
		currAcc.setEmail(account.getEmail());
		
		//save
		accRepo.save(currAcc);
		return currAcc;
	}

	public void deleteAccount(Integer id) {
		
		//kiểm tra acc có tồn tại trong DB?
		getAccountById(id);
		
		//delete
		accRepo.deleteById(id);
	}

}
