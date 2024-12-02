package com.ring.bookstore.controller;

import java.io.IOException;

import com.ring.bookstore.service.CaptchaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ring.bookstore.model.Account;
import com.ring.bookstore.request.AuthenticationRequest;
import com.ring.bookstore.request.RegisterRequest;
import com.ring.bookstore.request.ResetPassRequest;
import com.ring.bookstore.response.AuthenticationResponse;
import com.ring.bookstore.service.impl.AuthenticationService;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthenticationController {

	private final AuthenticationService authService;
	private final CaptchaService captchaService;

	//Register
	@PostMapping("/register")
	public ResponseEntity<AuthenticationResponse> register(@RequestBody @Valid RegisterRequest request) {
//		String response = request.getParameter("response");
//		captchaService.processResponse(response, CaptchaService.REGISTER_ACTION);
		return ResponseEntity.ok(authService.register(request));
	}

	//Authenticate sign in
	@PostMapping("/authenticate")
	public ResponseEntity<AuthenticationResponse> authenticate(@RequestBody @Valid AuthenticationRequest request) {
		return ResponseEntity.ok(authService.authenticate(request));
	}

	//Refresh JWT token
	@GetMapping("/refresh-token")
	public void refreshToken(HttpServletResponse response,
							 @CookieValue(value = "refreshToken") String refreshToken)
			throws IOException {
		authService.refreshToken(response, refreshToken);
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
