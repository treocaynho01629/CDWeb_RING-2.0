package com.ring.bookstore.controller;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.exc.StreamWriteException;
import com.fasterxml.jackson.databind.DatabindException;
import com.ring.bookstore.request.AuthenticationRequest;
import com.ring.bookstore.request.RegisterRequest;
import com.ring.bookstore.response.AuthenticationResponse;
import com.ring.bookstore.service.impl.AuthenticationService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {

	  @Autowired
	  private final AuthenticationService authService;
	  
	  @PostMapping("/register")
	  public ResponseEntity<AuthenticationResponse> register( //Tạo tài khoản
	          @RequestBody  @Valid RegisterRequest request
	  ) {
	    return ResponseEntity.ok(authService.register(request));
	  }
	  
	  @PostMapping("/authenticate")
	  public ResponseEntity<AuthenticationResponse> authenticate( //Đăng nhập
			  @RequestBody @Valid AuthenticationRequest request
	  ) {
	    return ResponseEntity.ok(authService.authenticate(request));
	  }
	  
	  @GetMapping("/refresh-token")
	  public void refreshToken( //Refresh token
			  HttpServletRequest request,
			  HttpServletResponse response
	  ) throws StreamWriteException, DatabindException, IOException {
	    authService.refreshToken(request, response);
	  }
}
