package com.ring.bookstore.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ring.bookstore.model.Account;
import com.ring.bookstore.request.AuthenticationRequest;
import com.ring.bookstore.request.RegisterRequest;
import com.ring.bookstore.request.ResetPassRequest;
import com.ring.bookstore.response.AuthenticationResponse;
import com.ring.bookstore.service.impl.AuthenticationService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthenticationController {

	private final AuthenticationService authService;

	//Register
	@PostMapping("/register")
	public ResponseEntity<?> register(@RequestBody @Valid RegisterRequest registerRequest,
									  HttpServletRequest request) {
		final String recaptchaToken = request.getHeader("response");
		Account newUser = authService.register(registerRequest, recaptchaToken);
		return ResponseEntity.ok("Đăng ký thành công!");
	}

	//Authenticate sign in
	@PostMapping("/authenticate")
	public ResponseEntity<AuthenticationResponse> authenticate(
			@RequestParam(value = "persist", defaultValue = "true") Boolean persist,
			@RequestBody @Valid AuthenticationRequest request) {
		//Generate new JWT & refresh token
		Account auth = authService.authenticate(request);
		String jwtToken = authService.generateToken(auth);

		//Set refresh token
		ResponseCookie refreshCookie;
		if (persist) {
			refreshCookie = authService.generateRefreshCookie(auth);
		} else {
			refreshCookie = authService.clearRefreshCookie();
		}

		return ResponseEntity.ok()
				.header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
				.body(new AuthenticationResponse(jwtToken));
	}

	//Refresh JWT token
	@GetMapping("/refresh-token")
	public ResponseEntity<AuthenticationResponse> refreshToken(HttpServletRequest request) {
		//Generate new token
		Account auth = authService.refreshToken(request);
		String jwtToken = authService.generateToken(auth);

		return ResponseEntity.ok().body(new AuthenticationResponse(jwtToken));
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
