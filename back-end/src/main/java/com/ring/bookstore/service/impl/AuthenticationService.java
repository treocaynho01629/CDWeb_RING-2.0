package com.ring.bookstore.service.impl;

import com.ring.bookstore.dtos.images.IImageInfo;
import com.ring.bookstore.exception.ResetPasswordException;
import com.ring.bookstore.exception.TokenRefreshException;
import com.ring.bookstore.listener.forgot.OnResetTokenCreatedEvent;
import com.ring.bookstore.listener.registration.OnRegistrationCompleteEvent;
import com.ring.bookstore.listener.reset.OnResetPasswordCompletedEvent;
import com.ring.bookstore.model.*;
import com.ring.bookstore.repository.ImageRepository;
import com.ring.bookstore.service.CaptchaService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.ring.bookstore.enums.RoleName;
import com.ring.bookstore.exception.HttpResponseException;
import com.ring.bookstore.exception.ResourceNotFoundException;
import com.ring.bookstore.repository.AccountRepository;
import com.ring.bookstore.request.AuthenticationRequest;
import com.ring.bookstore.request.RegisterRequest;
import com.ring.bookstore.request.ResetPassRequest;
import com.ring.bookstore.service.RoleService;

import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.*;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

	private final AccountRepository accountRepo;
	private final ImageRepository imageRepo;

	private final RoleService roleService;
	private final JwtService jwtService;
	private final RefreshTokenService refreshService;
	private final ResetTokenService resetService;
	private final LoginProtectionService loginProtectionService;
	private final CaptchaService captchaService;

	private final PasswordEncoder passwordEncoder;
	private final AuthenticationManager authenticationManager;
    private final ApplicationEventPublisher eventPublisher;

	//Register
	public Account register(RegisterRequest registerRequest, HttpServletRequest request) {
		//Recaptcha
		final String recaptchaToken = request.getHeader("response");
		final String source = request.getHeader("source");
		captchaService.validate(recaptchaToken, source, CaptchaServiceImpl.REGISTER_ACTION);

		//Check if user with this username already exists
		if (accountRepo.existsByUsernameOrEmail(registerRequest.getUsername(), registerRequest.getEmail())) {
			throw new HttpResponseException(
					HttpStatus.CONFLICT,
					"User already existed!",
					"Người dùng với tên đăng nhập hoặc email này đã tồn tại!"
			);
		} else {
			//Set role for USER
			Set<Role> roles = new HashSet<>();
			roles.add(roleService.findByRoleName(RoleName.ROLE_USER)
					.orElseThrow(() -> new ResourceNotFoundException("No roles has been set!")));

			//Create and set new Account info
			var user = Account.builder()
					.username(registerRequest.getUsername())
					.pass(passwordEncoder.encode(registerRequest.getPass()))
					.email(registerRequest.getEmail())
					.roles(roles)
					.build();

			user.setProfile(new AccountProfile());
			accountRepo.save(user); //Save to database

            //Trigger email event
            eventPublisher.publishEvent(new OnRegistrationCompleteEvent(
                    registerRequest.getUsername(),
                    registerRequest.getEmail()));
			return user;
		}
	}

	//Authenticate
	public Account authenticate(AuthenticationRequest authRequest, HttpServletRequest request) throws ResourceNotFoundException {
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
			System.out.println(authentication);

			SecurityContextHolder.getContext().setAuthentication(authentication); //All good >> security context
			user = (Account) authentication.getPrincipal();
		} catch (Exception e) {
			throw new BadCredentialsException("Invalid Username or Password!");
		}

		return user;
	}

	//Refresh JWT
	public Account refreshToken(HttpServletRequest request) {
		String token = jwtService.getRefreshTokenFromCookie(request);

		//Find token
		String username = jwtService.extractRefreshUsername(token);
		Account user = accountRepo.findByRefreshTokenAndUsername(token, username).orElseThrow(()
				-> new TokenRefreshException(token, "Refresh token not found!"));

		//Verify >> return new jwt token
		if (refreshService.verifyRefreshToken(token)) {
			return user;
		} else {
			throw new TokenRefreshException(token, "Refresh token failed!");
		}
	}

	//Forgot password
	public String forgotPassword(String email, HttpServletRequest request) {
		//Recaptcha
		final String recaptchaToken = request.getHeader("response");
		final String source = request.getHeader("source");
		captchaService.validate(recaptchaToken, source, CaptchaServiceImpl.FORGOT_ACTION);

		//Get all accounts with this email
		Account user = accountRepo.findByEmail(email).orElseThrow(()
				-> new ResourceNotFoundException("User with this email does not exist!"));

        //Generate reset password token
		String token = resetService.generateResetToken(user);

        //Email event
        eventPublisher.publishEvent(new OnResetTokenCreatedEvent(
                user.getUsername(),
                user.getEmail(),
                token));
        return token;
	}

	//Change password with {resetToken}
	public Account resetPassword(String token, ResetPassRequest resetRequest, HttpServletRequest request) {
		//Recaptcha
		final String recaptchaToken = request.getHeader("response");
		final String source = request.getHeader("source");
		captchaService.validate(recaptchaToken, source, CaptchaServiceImpl.RESET_ACTION);

		//Find token
		Account user = accountRepo.findByResetToken(token).orElseThrow(()
				-> new ResetPasswordException(token, "Reset token not found!"));

		//Verify >> return new jwt token
		if (!resetService.verifyResetToken(user)) {
			throw new ResetPasswordException(token, "Reset token not valid!");
		}

		//Validate new password
		if (!resetRequest.getPassword().equals(resetRequest.getReInputPassword())) throw new HttpResponseException(
				HttpStatus.BAD_REQUEST,
				"Re input password does not match!",
				"Mật khẩu không trùng khớp!"
		);

		//Change password and save to database
		user.setPass(passwordEncoder.encode(resetRequest.getPassword()));
		resetService.clearResetToken(token);
		accountRepo.save(user);

        //Email event
        eventPublisher.publishEvent(new OnResetPasswordCompletedEvent(
                user.getUsername(),
                user.getEmail()));
		return user;
	}

	//Create refresh token cookie
	@Transactional
	public ResponseCookie generateRefreshCookie(Account user) {
		return refreshService.generateRefreshToken(user);
	}

	public ResponseCookie clearRefreshCookie() {
		return jwtService.clearRefreshCookie();
	}

	//Generate token with avatar
	public String generateToken(Account user) {
		Map<String, Object> extraClaims = new HashMap<>();
		extraClaims.put("id", user.getId());
		IImageInfo image = imageRepo.findInfoByProfileId(user.getProfile().getId()).orElse(null);

		if (image != null) {
			String fileDownloadUri = ServletUriComponentsBuilder
					.fromCurrentContextPath()
					.path("/api/images/")
					.path(image.getName())
					.toUriString();
			extraClaims.put("image", fileDownloadUri);
		}

		return jwtService.generateToken(extraClaims, user);
	}
}