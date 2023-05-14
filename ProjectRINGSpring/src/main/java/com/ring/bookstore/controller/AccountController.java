package com.ring.bookstore.controller;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
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
	@GetMapping
	@PreAuthorize("hasAnyRole('ADMIN')")
	public Page<Account> getAllAccounts(@RequestParam(value = "pSize", defaultValue = "15") Integer pageSize,
										@RequestParam(value = "pageNo", defaultValue = "0") Integer pageNo){
		return accountService.getAllAccounts(pageNo, pageSize);
	}
	
	//Lấy acc theo {id}
	@GetMapping("{id}")
	@PreAuthorize("hasAnyRole('ADMIN')")
	public ResponseEntity<Account> getAccountById(@PathVariable("id") Integer accountId){
		return new ResponseEntity<Account>(accountService.getAccountById(accountId), HttpStatus.OK);
	}
	
	//Chỉnh sửa acc {id}
	@PostMapping("{id}")
	@PreAuthorize("hasAnyRole('ADMIN')")
	public ResponseEntity<Account> updateAccount(@PathVariable("id") Integer accountId,
			@RequestBody Account account){
		return new ResponseEntity<Account>(accountService.updateAccount(account, accountId), HttpStatus.OK);
	}
	
	//Tạo acc mới
	@PostMapping()
	@PreAuthorize("hasAnyRole('ADMIN')")
	public ResponseEntity<Account> saveAccount(@RequestBody Account account){
		return new ResponseEntity<Account>(accountService.saveAccount(account), HttpStatus.CREATED);
	}
	
	//Xoá acc {id}
	@DeleteMapping("{id}")
	@PreAuthorize("hasAnyRole('ADMIN')")
	public ResponseEntity<String> deleteAccount(@PathVariable("id") Integer accountId){
		
		//Xoá khỏi DB
		accountService.deleteAccount(accountId);
		return new ResponseEntity<String>("Account deleted successfully!", HttpStatus.OK);
	}
}
