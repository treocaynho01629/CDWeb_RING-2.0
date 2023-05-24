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
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ring.bookstore.config.CurrentAccount;
import com.ring.bookstore.dtos.AccountDetailDTO;
import com.ring.bookstore.dtos.ProfileDTO;
import com.ring.bookstore.model.Account;
import com.ring.bookstore.model.AccountProfile;
import com.ring.bookstore.request.AccountRequest;
import com.ring.bookstore.request.ChangePassRequest;
import com.ring.bookstore.request.ProfileRequest;
import com.ring.bookstore.service.AccountService;

import jakarta.validation.Valid;

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
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<?> getAllAccounts(@RequestParam(value = "pSize", defaultValue = "10") Integer pageSize,
										@RequestParam(value = "pageNo", defaultValue = "0") Integer pageNo,
										@RequestParam(value = "sortBy", defaultValue = "id") String sortBy,
										@RequestParam(value = "sortDir", defaultValue = "asc") String sortDir){
		Page<Account> accounts = accountService.getAllAccounts(pageNo, pageSize, sortBy, sortDir);
		return new ResponseEntity< >(accounts, HttpStatus.OK);
	}
	
	//Lấy tất cả nhân viên
	@GetMapping("/employees")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<?>  getAllSellers(@RequestParam(value = "pSize", defaultValue = "10") Integer pageSize,
										@RequestParam(value = "pageNo", defaultValue = "0") Integer pageNo,
										@RequestParam(value = "sortBy", defaultValue = "id") String sortBy,
										@RequestParam(value = "sortDir", defaultValue = "asc") String sortDir){
		Page<Account> accounts = accountService.getAllEmployees(pageNo, pageSize, sortBy, sortDir);
		return new ResponseEntity< >(accounts, HttpStatus.OK);
	}
	
	//Lấy acc theo {id}
	@GetMapping("{id}")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<AccountDetailDTO> getAccountById(@PathVariable("id") Integer accountId){
		return new ResponseEntity<AccountDetailDTO>(accountService.getAccountById(accountId), HttpStatus.OK);
	}
	
	//Chỉnh sửa acc {id}
	@PutMapping("{id}")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<Account> updateAccount(@PathVariable("id") Integer accountId,
			@Valid @RequestBody AccountRequest requestt){
		return new ResponseEntity<Account>(accountService.updateAccount(requestt, accountId), HttpStatus.OK);
	}
	
	//Tạo acc mới
	@PostMapping
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<Account> saveAccount(@Valid @RequestBody AccountRequest request){
		return new ResponseEntity<Account>(accountService.saveAccount(request), HttpStatus.CREATED);
	}
	
	//Xoá acc {id}
	@DeleteMapping("{id}")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<String> deleteAccount(@PathVariable("id") Integer accountId){
		
		//Xoá khỏi DB
		accountService.deleteAccount(accountId);
		return new ResponseEntity<String>("Account deleted successfully!", HttpStatus.OK);
	}
	
	//Lấy profile
	@GetMapping("/profile")
	@PreAuthorize("hasRole('USER')")
	public ResponseEntity<ProfileDTO> getProfile(@CurrentAccount Account currUser){
		ProfileDTO profile = accountService.getProfile(currUser);
		return new ResponseEntity< >(profile, HttpStatus.OK);
	}
	
	//Update hồ sơ
	@PutMapping("/profile")
	@PreAuthorize("hasRole('USER')")
	public ResponseEntity<AccountProfile> updateProfile(@Valid @RequestBody ProfileRequest request, @CurrentAccount Account currUser){
		AccountProfile profile = accountService.updateProfile(request, currUser);
		return new ResponseEntity< >(profile, HttpStatus.OK);
	}
	
	//Đổi mật khẩu
	@PutMapping("/change-password")
	@PreAuthorize("hasRole('USER')")
	public ResponseEntity<String> changePassword(@Valid @RequestBody ChangePassRequest request, @CurrentAccount Account currUser){
		Account account = accountService.changePassword(request, currUser);
		String result = "Đổi mật khẩu thất bại";
		if (account != null) result = "Thay đổi mật khẩu thành công!";
		return new ResponseEntity< >(result, HttpStatus.OK);
	}
	
	//Lấy dữ liệu cho biểu đồ (Người dùng)
	@GetMapping("/top-accounts")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<?> getTopAccounts(){
		return new ResponseEntity< >(accountService.getTopAccount(), HttpStatus.OK);
	}
	
	//Lấy dữ liệu cho biểu đồ (Người bán)
	@GetMapping("/top-sellers")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<?> getTopSellers(){
		return new ResponseEntity< >(accountService.getTopSeller(), HttpStatus.OK);
	}
}
