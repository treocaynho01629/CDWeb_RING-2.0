package com.ring.bookstore.service.impl;

import java.util.HashSet;
import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.ring.bookstore.enums.RoleName;
import com.ring.bookstore.exception.HttpResponseException;
import com.ring.bookstore.exception.ResourceNotFoundException;
import com.ring.bookstore.model.Account;
import com.ring.bookstore.model.Role;
import com.ring.bookstore.repository.AccountRepository;
import com.ring.bookstore.repository.BookRepository;
import com.ring.bookstore.repository.OrderReceiptRepository;
import com.ring.bookstore.repository.ReviewRepository;
import com.ring.bookstore.request.AccountRequest;
import com.ring.bookstore.service.AccountService;
import com.ring.bookstore.service.RoleService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class AccountServiceImpl implements AccountService {
	
	private final AccountRepository accountRepo;
	private final PasswordEncoder passwordEncoder;
	private final RoleService roleService;
	private final OrderReceiptRepository orderRepo;
	private final ReviewRepository reviewRepo;
	private final BookRepository bookRepo;
	
	//Lấy tất cả acc
	public Page<Account> getAllAccounts(Integer pageNo, Integer pageSize, String sortBy, String sortDir) {
		Pageable pageable = PageRequest.of(pageNo, pageSize, sortDir.equals("asc") ? Sort.by(sortBy).ascending()
				: Sort.by(sortBy).descending());
		return accountRepo.findAll(pageable);
	}
	
	//Lấy tất cả nhân viên
	public Page<Account> getAllEmployees(Integer pageNo, Integer pageSize, String sortBy, String sortDir) {
		Pageable pageable = PageRequest.of(pageNo, pageSize, sortDir.equals("asc") ? Sort.by(sortBy).ascending()
				: Sort.by(sortBy).descending());
		return accountRepo.findEmployees(pageable);
	}

	//Lấy acc theo id
	public Account getAccountById(Integer id) {
		return accountRepo.findById(id).orElseThrow(() -> 
					new ResourceNotFoundException("User does not exists!")); //exception nếu ko tồn tại
	}
	
	//Tạo acc
	public Account saveAccount(AccountRequest request) {
		
		//Kiểm tra người dùng vs username và email đã tồn tại chưa
	    if (!accountRepo.findByUserName(request.getUserName()).isEmpty()){
	    	throw new HttpResponseException(HttpStatus.BAD_REQUEST, "Người dùng với tên đăng nhập này đã tồn tại!");
	    }
	
	    //Set Role và Employee
	    Set<Role> roles = new HashSet<>();
	    roles.add(roleService.findByRoleName(RoleName.ROLE_USER).orElseThrow(() -> new HttpResponseException(HttpStatus.NOT_FOUND, "No roles has been set")));
	
	    if (request.getRoles() >= 2) {
		    roles.add(roleService.findByRoleName(RoleName.ROLE_SELLER).orElseThrow(() -> new HttpResponseException(HttpStatus.NOT_FOUND, "Role not found")));
	    } else if (request.getRoles() >= 3) {
		    roles.add(roleService.findByRoleName(RoleName.ROLE_ADMIN).orElseThrow(() -> new HttpResponseException(HttpStatus.NOT_FOUND, "Role not found")));
	    }
		
		var acc = Account.builder()
		            .userName(request.getUserName())
		            .pass(passwordEncoder.encode(request.getPass()))
		            .email(request.getEmail())
		            .roles(roles)
		            .build();
		
		 //Save user
	    Account savedAccount = accountRepo.save(acc);
		return savedAccount;
	}

	//Chỉnh sửa acc
	public Account updateAccount(AccountRequest request, Integer id) {
		
		//Kiểm tra người dùng vs username và email đã tồn tại chưa
		if (!accountRepo.findByUserName(request.getUserName()).isEmpty()){
			throw new HttpResponseException(HttpStatus.BAD_REQUEST, "Người dùng với tên đăng nhập này đã tồn tại!");
		}
		
		//Kiểm tra người dùng có tồn tại?
	    Account currUser = accountRepo.findById(id)
	            .orElseThrow(()-> new ResourceNotFoundException("User does not exist!"));
	    
		
	    //Set Role và Employee
		Set<Role> roles = new HashSet<>();
		roles.add(roleService.findByRoleName(RoleName.ROLE_USER).orElseThrow(() -> new HttpResponseException(HttpStatus.NOT_FOUND, "No roles has been set")));
		
		if (request.getRoles() >= 2) {
		    roles.add(roleService.findByRoleName(RoleName.ROLE_SELLER).orElseThrow(() -> new HttpResponseException(HttpStatus.NOT_FOUND, "Role not found")));
		} else if (request.getRoles() >= 3) {
		    roles.add(roleService.findByRoleName(RoleName.ROLE_ADMIN).orElseThrow(() -> new HttpResponseException(HttpStatus.NOT_FOUND, "Role not found")));
		}
		
		currUser.setUserName(request.getUserName());
		currUser.setPass(passwordEncoder.encode(request.getPass()));
		currUser.setEmail(request.getEmail());
		currUser.setRoles(roles);
		
		 //Save user
	    Account updatedAccount = accountRepo.save(currUser);
		return updatedAccount;
	}

	public void deleteAccount(Integer id) {
		//Kiểm tra người dùng có tồn tại?
	    Account account = accountRepo.findById(id).orElseThrow(()-> new ResourceNotFoundException("User does not exist!"));
	    
	    //Gỡ quan hệ
	    account.removeAllOrders();
	    account.removeAllBooks();
	    account.removeAllReviews();
	    account.removeAllRoles();
	    
	    Account savedAccount = accountRepo.save(account);
		
		//delete
		accountRepo.delete(savedAccount);
	}

}
