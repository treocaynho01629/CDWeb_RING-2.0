package com.ring.bookstore.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ring.bookstore.model.Account;
import com.ring.bookstore.service.AccountService;

@RestController
@CrossOrigin("http://localhost:5173")
@RequestMapping("/api/accounts")
public class AccountController {
	
	private AccountService accountService;
	
	public AccountController(AccountService accountService) {
		super();
		this.accountService = accountService;
	}
	
	//Lấy tất cả acc
	@GetMapping()
	public List<Account> getAllAccounts(){
		return accountService.getAllAccounts();
	}
	
	//Lấy acc theo {id}
	@GetMapping("{id}")
	public ResponseEntity<Account> getEmployeeById(@PathVariable("id") Integer accountId){
		return new ResponseEntity<Account>(accountService.getAccountById(accountId), HttpStatus.OK);
	}
	
	//Chỉnh sửa acc {id}
	@PostMapping("{id}")
	public ResponseEntity<Account> updateEmployee(@PathVariable("id") Integer accountId,
			@RequestBody Account account){
		return new ResponseEntity<Account>(accountService.updateAccount(account, accountId), HttpStatus.OK);
	}
	
	//Tạo acc mới
	@PostMapping()
	public ResponseEntity<Account> saveAccount(@RequestBody Account account){
		return new ResponseEntity<Account>(accountService.saveAccount(account), HttpStatus.CREATED);
	}
	
	//Xoá acc {id}
	@DeleteMapping("{id}")
	public ResponseEntity<String> deleteAccount(@PathVariable("id") Integer accountId){
		
		//Xoá khỏi DB
		accountService.deleteAccount(accountId);
		return new ResponseEntity<String>("Account deleted successfully!", HttpStatus.OK);
	}
}
