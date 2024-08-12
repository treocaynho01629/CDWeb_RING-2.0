package com.ring.bookstore.controller;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.exc.StreamWriteException;
import com.fasterxml.jackson.databind.DatabindException;
import com.ring.bookstore.model.Account;
import com.ring.bookstore.request.AuthenticationRequest;
import com.ring.bookstore.request.RegisterRequest;
import com.ring.bookstore.request.ResetPassRequest;
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

	//Register
	@PostMapping("/register")
	public ResponseEntity<AuthenticationResponse> register(@RequestBody @Valid RegisterRequest request) {
		return ResponseEntity.ok(authService.register(request));
	}

	//Authenticate sign in
	@PostMapping("/authenticate")
	public ResponseEntity<AuthenticationResponse> authenticate(@RequestBody @Valid AuthenticationRequest request) {
		return ResponseEntity.ok(authService.authenticate(request));
	}

	//Refresh JWT token
	@GetMapping("/refresh-token")
	public void refreshToken(HttpServletRequest request, HttpServletResponse response)
			throws StreamWriteException, DatabindException, IOException {
		authService.refreshToken(request, response);
	}
	
	//Send forgot password email
	@PostMapping("/forgot-password")
	public ResponseEntity<?> forgotPassword(@RequestParam(value="email") String email){
		authService.forgotPassword(email);
		return new ResponseEntity< >("Đã gửi email khôi phục mật khẩu", HttpStatus.OK);
	}
	
	//Reset password
	@PutMapping("/reset-password")
	public ResponseEntity<String> resetPassword(@Valid @RequestBody ResetPassRequest request){
		Account account = authService.resetPassword(request);
		String result = "Đổi mật khẩu thất bại";
		if (account != null) result = "Thay đổi mật khẩu thành công!";
		return new ResponseEntity< >(result, HttpStatus.OK);
	}
}
