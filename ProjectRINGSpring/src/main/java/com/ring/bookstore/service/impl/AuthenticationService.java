package com.ring.bookstore.service.impl;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.exc.StreamWriteException;
import com.fasterxml.jackson.databind.DatabindException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ring.bookstore.enums.RoleName;
import com.ring.bookstore.enums.TokenType;
import com.ring.bookstore.exception.HttpResponseException;
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

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
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
	    	throw new HttpResponseException(HttpStatus.BAD_REQUEST, "Người dùng với tên đăng nhập này đã tồn tại!");
	    }
	
	    //Set Role và Employee
	    Set<Role> roles = new HashSet<>();
	    roles.add(roleService.findByRoleName(RoleName.ROLE_USER).orElseThrow(() -> new HttpResponseException(HttpStatus.NOT_FOUND, "No roles has been set")));
	
	    var acc = Account.builder()
	            .userName(request.getUserName())
	            .pass(passwordEncoder.encode(request.getPass()))
	            .email(request.getEmail())
	            .roles(roles)
	            .build();
	
	    //Save user and token
	    var savedUser = accountRepo.save(acc);
	    var jwtToken = jwtService.generateToken(acc); //Token
	    var refreshToken = jwtService.generateRefreshToken(acc);
	    saveUserToken(savedUser, jwtToken);
	    
//	    Cookie cookie = new Cookie("jwt", refreshToken);
//	    cookie.setHttpOnly(true);
//	    cookie.setSecure(true);
//	    cookie.setMaxAge(7 * 24 * 60 * 60 * 1000);
//
//	    //add cookie to response
//	    response.addCookie(cookie);
	
	    return AuthenticationResponse.builder()
	            .token(jwtToken)
	            .refreshToken(refreshToken)
	            .roles(roles)
	            .build();
  }
  
  public AuthenticationResponse authenticate(AuthenticationRequest request) throws ResourceNotFoundException {
	    //Kiểm tra người dùng có tồn tại?
	    var user = accountRepo.findByUserName(request.getUserName())
	            .orElseThrow(()-> new ResourceNotFoundException("User does not exist!"));
	    
	    Set<Role> roles = user.getRoles();
	
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
	      throw new ResourceNotFoundException("Token not found!");
	    }
	    
	    //Trả về token
	    var jwtToken = jwtService.generateToken(user);
	    var refreshToken = jwtService.generateRefreshToken(user);
	    revokeAllUserTokens(user); //huỷ các token trước đó
	    saveUserToken(user, jwtToken);
	    
	    return AuthenticationResponse.builder()
	            .token(jwtToken)
	            .refreshToken(refreshToken)
	            .roles(roles)
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

  public void refreshToken(HttpServletRequest request, HttpServletResponse response) throws StreamWriteException, DatabindException, IOException {
	  	final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
		final String refreshToken;
		final String userName;
		
		if (authHeader == null || !authHeader.startsWith("Bearer ")) {
			return;
		}
		
		refreshToken = authHeader.substring(7); //Sau "Bearer "
		userName = jwtService.extractUsername(refreshToken);
		
		if (userName != null) { //Check người dùng tồn tại
			var user = this.accountRepo.findByUserName(userName).orElseThrow();
			
			Set<Role> roles = user.getRoles();
			
          if (jwtService.isTokenValid(refreshToken, user)) {
        	  var jwtToken = jwtService.generateToken(user);
        	  
        	  revokeAllUserTokens(user); //huỷ các token trước đó
        	  saveUserToken(user, jwtToken);
        	  
        	  var authResponse = AuthenticationResponse.builder()
        			  .token(jwtToken)
        			  .refreshToken(refreshToken)
        			  .roles(roles)
        			  .build();
        	  new ObjectMapper().writeValue(response.getOutputStream(), authResponse);
          }
		}
  }
}

