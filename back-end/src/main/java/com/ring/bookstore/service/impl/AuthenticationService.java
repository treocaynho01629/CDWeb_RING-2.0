package com.ring.bookstore.service.impl;

import com.ring.bookstore.dtos.images.IImageInfo;
import com.ring.bookstore.exception.TokenRefreshException;
import com.ring.bookstore.model.*;
import com.ring.bookstore.repository.ImageRepository;
import com.ring.bookstore.service.CaptchaService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
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
import com.ring.bookstore.service.EmailService;
import com.ring.bookstore.service.RoleService;

import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

	private final AccountRepository accountRepo;
	private final ImageRepository imageRepo;

	private final RoleService roleService;
	private final EmailService emailService;
	private final JwtService jwtService;
	private final RefreshTokenService refreshService;
	private final LoginProtectionService loginProtectionService;
	private final CaptchaService captchaService;

	private final PasswordEncoder passwordEncoder;
	private final AuthenticationManager authenticationManager;
	private static final long EXPIRE_TOKEN_AFTER_MINUTES = 30;

	@Value("${ring.client-url}")
	private String clientUrl;

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
					.profile(new AccountProfile())
					.build();

			accountRepo.save(user); //Save to database

			//Create and send email
			String subject = "RING! - BOOKSTORE: Đăng ký thành công! ";
			String content = "<h1><b style=\"color: #63e399;\">RING!</b> - BOOKSTORE</h1>\n"
					+ "<h2 style=\"background-color: #63e399; padding: 10px; color: white;\" >\r\n"
					+ "Tài khoản của bạn đã được đăng ký thành công!\r\n"
					+ "</h2>\n"
					+ "<h3>Tài khoản RING!:</h3>\n"
					+ "<p><b>- Tên đăng nhập: </b>" + registerRequest.getUsername() + " đã đăng ký thành công</p>\n"
					+ "<p>- Chúc bạn có trả nghiệm vui vẻ khi mua sách tại RING! - BOOKSTORE</p>\n"
					+ "<br><p>Liên hệ hỗ trợ khi cần thiết: <b>ringbookstore@ring.email</b></p>\n"
					+ "<br><br><h3>Cảm ơn đã tham gia!</h3>\n";
			emailService.sendHtmlMessage(registerRequest.getEmail(), subject, content); //Send

			return user;
		}
	}

	//Authenticate
	public Account authenticate(AuthenticationRequest authRequest, HttpServletRequest request) throws ResourceNotFoundException {
		//Recaptcha
		final String recaptchaToken = request.getHeader("response");
		final String source = request.getHeader("source");
		captchaService.validate(recaptchaToken, source, CaptchaServiceImpl.LOGIN_ACTION);

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
			throw new BadCredentialsException("Invalid Username or Password!");
		}

		return user;
	}

	//Refresh JWT
	public Account refreshToken(HttpServletRequest request) {
		String refreshToken = jwtService.getRefreshTokenFromCookie(request);

		//Find token
		String username = jwtService.extractRefreshUsername(refreshToken);
		AccountToken token = refreshService.findToken(refreshToken, username).orElseThrow(()
				-> new TokenRefreshException(refreshToken, "Refresh token not found!"));

		//Verify >> return new jwt token
		if (refreshService.verifyToken(token)) {
			return token.getUser();
		} else {
			throw new TokenRefreshException(refreshToken, "Refresh token failed!");
		}
	}

	//Forgot password
	public void forgotPassword(String email, HttpServletRequest request) {
		//Recaptcha
		final String recaptchaToken = request.getHeader("response");
		final String source = request.getHeader("source");
		captchaService.validate(recaptchaToken, source, CaptchaServiceImpl.FORGOT_ACTION);

		//Get all accounts with this email
		List<Account> accounts = accountRepo.findByEmail(email);

		if (accounts.isEmpty()) throw new ResourceNotFoundException("User with this email not found!");
		String resetContent = ""; //Email content

		//Loop through all and send email
		for (Account a : accounts) {
			String token = updateResetToken(a); //Generate reset password token
			String url = clientUrl + "/reset-password?token=" + token; //Put url + parameter with reset token

			//Put in email content
			resetContent +=
					"<div style=\"display: flex; padding: 5px 15px; border: 0.5px solid lightgray;\">\r\n"
							+ "	   <div style=\"margin-left: 15px; margin-bottom: 15px;\">\r\n"
							+ "      <h3>Tài khoản: "+ a.getUsername() +"</h3>\r\n"
							+ "      <a style=\"font-size: 14px;\" href=\"" + url + "\">Nhấp vào đây để đổi mật khẩu mới</a>\r\n"
							+ "    </div>\r\n"
							+ "</div><br><br>";
		}

		//Create and send email
		String subject = "RING! - BOOKSTORE: Yêu cầu khôi phục mật khẩu! ";
		String content = "<h1><b style=\"color: #63e399;\">RING!</b> - BOOKSTORE</h1>\n"
				+ "<h2 style=\"background-color: #63e399; padding: 10px; color: white;\" >\r\n"
				+ "Tài khoản của bạn đã được yêu cầu đổi mật khẩu!\r\n"
				+ "</h2>\n"
				+ "<h3>Tài khoản RING!:</h3>\n"
				+ resetContent
				+ "<p>- Chúc bạn có trả nghiệm vui vẻ khi mua sách tại RING! - BOOKSTORE</p>\n"
				+ "<br><p>Không phải bạn thực hiện thay đổi trên? Liên hệ và yêu cầu xử lý tại: <b>ringbookstore@ring.email</b></p>\n"
				+ "<br><br><h3>Cảm ơn đã sử dụng dịch vụ!</h3>\n";
		emailService.sendHtmlMessage(email, subject, content); //Send
	}

	//Change password with {resetToken}
	public Account resetPassword(ResetPassRequest resetRequest, HttpServletRequest request) {
		//Recaptcha
		final String recaptchaToken = request.getHeader("response");
		final String source = request.getHeader("source");
		captchaService.validate(recaptchaToken, source, CaptchaServiceImpl.RESET_ACTION);

		//Check if user with username exists
		var user = accountRepo.findByResetPassToken(resetRequest.getToken())
				.orElseThrow(() -> new ResourceNotFoundException("User not found!"));
		//Check token expiration
		if (isTokenExpired(user.getTokenCreationDate())) throw new BadCredentialsException("Token expired!");
		//Validate new password
		if (!resetRequest.getNewPass().equals(resetRequest.getNewPassRe())) throw new HttpResponseException(
				HttpStatus.BAD_REQUEST,
				"Re input password does not match!",
				"Mật khẩu không trùng khớp!"
		);

		//Change password and save to database
		user.setPass(passwordEncoder.encode(resetRequest.getNewPass()));
		user.setTokenCreationDate(null);
		user.setResetPassToken(null);
		Account savedAccount = accountRepo.save(user);

		//Create and send email
		String subject = "RING! - BOOKSTORE: Đổi mật khẩu thành công! ";
		String content = "<h1><b style=\"color: #63e399;\">RING!</b> - BOOKSTORE</h1>\n"
				+ "<h2 style=\"background-color: #63e399; padding: 10px; color: white;\" >\r\n"
				+ "Tài khoản của bạn đã được đổi mật khẩu thành công!\r\n"
				+ "</h2>\n"
				+ "<h3>Tài khoản RING!:</h3>\n"
				+ "<p><b>- Tên đăng nhập: </b>" + user.getUsername() + " đã đổi mật khẩu thành công</p>\n"
				+ "<p>- Chúc bạn có trả nghiệm vui vẻ khi mua sách tại RING! - BOOKSTORE</p>\n"
				+ "<br><p>Không phải bạn thực hiện thay đổi trên? Liên hệ và yêu cầu xử lý tại: <b>ringbookstore@ring.email</b></p>\n"
				+ "<br><br><h3>Cảm ơn đã sử dụng dịch vụ!</h3>\n";
		emailService.sendHtmlMessage(user.getEmail(), subject, content); //Send

		return savedAccount; //Return updated account
	}

	//Create reset password token
	private String updateResetToken(Account user) {
		StringBuilder token = new StringBuilder(); //Random string token

		String resetToken = token.append(UUID.randomUUID())
				.append(UUID.randomUUID()).toString();

		user.setResetPassToken(resetToken);
		user.setTokenCreationDate(LocalDateTime.now());
		accountRepo.save(user);

		return resetToken;
	}

	//Create refresh token cookie
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

	//Check has reset token expired
	private boolean isTokenExpired(final LocalDateTime tokenCreationDate) {
		LocalDateTime now = LocalDateTime.now();
		Duration diff = Duration.between(tokenCreationDate, now);

		return diff.toMinutes() >= EXPIRE_TOKEN_AFTER_MINUTES; //Default 30 minutes
	}
}