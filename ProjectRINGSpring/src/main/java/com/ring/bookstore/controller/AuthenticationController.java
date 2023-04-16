package com.ring.bookstore.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ring.bookstore.request.AuthenticationRequest;
import com.ring.bookstore.request.RegisterRequest;
import com.ring.bookstore.response.AuthenticationResponse;
import com.ring.bookstore.service.impl.AuthenticationService;

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
	      @RequestBody AuthenticationRequest request
	  ) {
	    return ResponseEntity.ok(authService.authenticate(request));
	  }
}
