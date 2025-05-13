package com.ring.service.impl;

import com.ring.dto.request.AuthenticationRequest;
import com.ring.model.entity.Account;
import com.ring.service.AuthenticationService;
import com.ring.service.CaptchaService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;

/**
 * Service interface named {@link AuthenticationService} for handling user authentication operations.
 */
@Service
@RequiredArgsConstructor
public class AuthenticationServiceImpl implements AuthenticationService {

	private final LoginProtectionService loginProtectionService;
	private final CaptchaService captchaService;
	private final AuthenticationManager authenticationManager;

	/**
	 * Performs user login based on the provided login request.
	 *
	 * @param authRequest 	The login request containing user credentials.
	 * @param request 		The HTTP request containing reCAPTCHA score in the header.
	 * @return The authed user entity.
	 */
	public Account authenticate(AuthenticationRequest authRequest, HttpServletRequest request) {
		//Recaptcha (only after x amount of failed attempts)
		if (loginProtectionService.isSuspicious()) {
			final String recaptchaToken = request.getHeader("response");
			final String source = request.getHeader("source");
			captchaService.validate(recaptchaToken, source, CaptchaServiceImpl.LOGIN_ACTION);
		}

		if (loginProtectionService.isBlocked()) {
			throw new HttpClientErrorException(HttpStatus.TOO_MANY_REQUESTS, "Authentication blocked due to too many failed login attempts!");
		}

		//Validate token
		Account user;
		try {
			Authentication authentication = authenticationManager
					.authenticate(new UsernamePasswordAuthenticationToken(
							authRequest.getUsername(),
							authRequest.getPass())
					);
			SecurityContextHolder.getContext().setAuthentication(authentication); //All good >> security context
			user = (Account) authentication.getPrincipal();
		} catch (Exception e) {
			e.printStackTrace();
			throw new BadCredentialsException("Invalid Username or Password!");
		}

		return user;
	}
}