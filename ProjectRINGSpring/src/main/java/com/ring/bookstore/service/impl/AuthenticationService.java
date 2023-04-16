package com.ring.bookstore.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.ring.bookstore.enums.RoleName;
import com.ring.bookstore.enums.TokenType;
import com.ring.bookstore.exception.ResourceNotFoundException;
import com.ring.bookstore.model.Account;
import com.ring.bookstore.model.Role;
import com.ring.bookstore.model.Token;
import com.ring.bookstore.repository.AccountRepository;
import com.ring.bookstore.repository.TokenRepository;
import com.ring.bookstore.request.AuthenticationRequest;
import com.ring.bookstore.request.RegisterRequest;
import com.ring.bookstore.response.AuthenticationResponse;
import com.ring.bookstore.service.RoleService;

import java.util.HashSet;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

  private final AccountRepository accountRepo;
  private final PasswordEncoder passwordEncoder;
  private final JwtService jwtService;
  private final RoleService roleService;
  private final AuthenticationManager authenticationManager;
  private final TokenRepository tokenRepo;

  public AuthenticationResponse register(RegisterRequest request) { //Đăng ký

	    //Kiểm tra người dùng vs username và email đã tồn tại chưa
	    if (!accountRepo.findByUserName(request.getUserName()).isEmpty()){
	    	throw new ResourceNotFoundException("User already exists", "dsad", "dsadsa");
	    }
	
	    //Set Role và Employee
	    Set<Role> roles = new HashSet<>();
	    roles.add(roleService.findByRoleName(RoleName.ROLE_USER).orElseThrow());
	
	    var acc = Account.builder()
	            .userName(request.getUserName())
	            .pass(passwordEncoder.encode(request.getPass()))
	            .email(request.getEmail())
	            .roles(roles)
	            .build();
	
	    //Save user and token
	    var savedUser = accountRepo.save(acc);
	    var jwtToken = jwtService.generateToken(acc); //Token
	    saveUserToken(savedUser, jwtToken);
	
	    return AuthenticationResponse.builder()
	            .token(jwtToken)
	            .build();
  }
  
  public AuthenticationResponse authenticate(AuthenticationRequest request) throws ResourceNotFoundException {
	    //Kiểm tra người dùng có tồn tại?
	    var user = accountRepo.findByUserName(request.getUserName())
	            .orElseThrow(()-> new ResourceNotFoundException("User not found", "dsad", "dsadsa"));
	
	    //Lấy token sử dụng username và pass
	    try {
	      Authentication authentication  = authenticationManager.authenticate(
	              new UsernamePasswordAuthenticationToken(
	                      request.getUserName(),
	                      request.getPass()
	              )
	      );
	
	      SecurityContextHolder.getContext().setAuthentication(authentication);
	    } catch (Exception e) { //Ko hợp lệ
	      throw new ResourceNotFoundException("Token not found", "dsad", "dsadsa");
	    }
	
	    //Trả về token
	    var jwtToken = jwtService.generateToken(user);
	    revokeAllUserTokens(user); //huỷ các token trước đó
	    saveUserToken(user, jwtToken);
	
	    return AuthenticationResponse.builder()
	            .token(jwtToken)
	            .build();
  }
	
  //Huỷ tất cả token của acc
  private void revokeAllUserTokens(Account acc){
		var validUserTokens = tokenRepo.findAllValidTokensByUser(acc.getUsername());
		if (validUserTokens.isEmpty()) return;
		
		validUserTokens.forEach(t -> {
		  t.setExpired(true);
		  t.setRevoked(true);
		});
		
		tokenRepo.saveAll(validUserTokens);
  }
	
  private void saveUserToken(Account acc, String jwtToken) {
	    var token = Token.builder()
	            .user(acc)
	            .token(jwtToken)
	            .tokenType(TokenType.BEARER)
	            .expired(false)
	            .revoked(false)
	            .build();
	    tokenRepo.save(token);
  }
}

