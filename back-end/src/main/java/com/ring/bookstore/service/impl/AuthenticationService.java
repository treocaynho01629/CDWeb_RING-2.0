package com.ring.bookstore.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ring.bookstore.model.AccountProfile;
import com.ring.bookstore.model.Image;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.exc.StreamWriteException;
import com.fasterxml.jackson.databind.DatabindException;
import com.ring.bookstore.enums.RoleName;
import com.ring.bookstore.exception.HttpResponseException;
import com.ring.bookstore.exception.ResourceNotFoundException;
import com.ring.bookstore.model.Account;
import com.ring.bookstore.model.Role;
import com.ring.bookstore.repository.AccountRepository;
import com.ring.bookstore.request.AuthenticationRequest;
import com.ring.bookstore.request.RegisterRequest;
import com.ring.bookstore.request.ResetPassRequest;
import com.ring.bookstore.response.AuthenticationResponse;
import com.ring.bookstore.service.EmailService;
import com.ring.bookstore.service.RoleService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.client.HttpClientErrorException;

import java.io.IOException;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

	private final AccountRepository accountRepo;
	private final PasswordEncoder passwordEncoder;
	private final AuthenticationManager authenticationManager;
	private final RoleService roleService;
	private final EmailService emailService;
	private final JwtService jwtService;
    private final LoginProtectionService loginProtectionService;
	private static final long EXPIRE_TOKEN_AFTER_MINUTES = 30;
	
	@Value("${ring.client-url}")
	private String frontUrl;
	
	//Register
	public AuthenticationResponse register(RegisterRequest request) {

		//Check if user with this username already exists
		if (accountRepo.existsByUsername(request.getUsername())) {
			throw new HttpResponseException(HttpStatus.BAD_REQUEST, "Người dùng với tên đăng nhập này đã tồn tại!");
		} else {
			
			//Set role for USER
			Set<Role> roles = new HashSet<>();
			roles.add(roleService.findByRoleName(RoleName.ROLE_USER)
					.orElseThrow(() -> new HttpResponseException(HttpStatus.NOT_FOUND, "No roles has been set")));
			
			//Create and set new Account info
			var acc = Account.builder().username(request.getUsername()).pass(passwordEncoder.encode(request.getPass()))
					.email(request.getEmail()).roles(roles).build();
			
			accountRepo.save(acc); //Save to database
			var jwtToken = jwtService.generateToken(acc); //Generate JWT token
			var refreshToken = jwtService.generateRefreshToken(acc); //Generate refresh token
			
			//Create and send email
			String subject = "RING! - BOOKSTORE: Đăng ký thành công! "; 
			String content = "<h1><b style=\"color: #63e399;\">RING!</b> - BOOKSTORE</h1>\n"
					+ "<h2 style=\"background-color: #63e399; padding: 10px; color: white;\" >\r\n"
					+ "Tài khoản của bạn đã được đăng ký thành công!\r\n"
					+ "</h2>\n"
					+ "<h3>Tài khoản RING!:</h3>\n"
					+ "<p><b>- Tên đăng nhập: </b>" + request.getUsername() + " đã đăng ký thành công</p>\n"
					+ "<p>- Chúc bạn có trả nghiệm vui vẻ khi mua sách tại RING! - BOOKSTORE</p>\n"
					+ "<br><p>Liên hệ hỗ trợ khi cần thiết: <b>ringbookstore@ring.email</b></p>\n"
					+ "<br><br><h3>Cảm ơn đã tham gia!</h3>\n";
			emailService.sendHtmlMessage(request.getEmail(), subject, content); //Send
			
			//Return authentication response
			return AuthenticationResponse.builder()
					.token(jwtToken)
					.refreshToken(refreshToken)
					.build();
		}
	}

	//Authenticate
	public AuthenticationResponse authenticate(AuthenticationRequest request) throws ResourceNotFoundException {
        if (loginProtectionService.isBlocked(request.getUsername())) {
			throw new HttpClientErrorException(HttpStatus.TOO_MANY_REQUESTS, "Authentication blocked due to too many failed login attempts!");
		}

        //Check if user with this username exists
		var user = accountRepo.findByUsername(request.getUsername())
				.orElseThrow(() -> new ResourceNotFoundException("User not found!"));

		//Validate token
		try {
			Authentication authentication = authenticationManager
					.authenticate(new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPass()));

			SecurityContextHolder.getContext().setAuthentication(authentication); //All good >> security context
		} catch (Exception e) {
			// Record failed login attempt
			loginProtectionService.loginFailed(request.getUsername());
			throw new BadCredentialsException("Invalid Username or Password!");
		}

		//Generate new JWT & refresh token
		var jwtToken = generateToken(user);
		var refreshToken = jwtService.generateRefreshToken(user);

		// Record successful login
		loginProtectionService.loginSucceeded(request.getUsername());

		//Return authentication response
		return AuthenticationResponse
				.builder()
				.token(jwtToken)
				.refreshToken(refreshToken)
				.build();
	}

	//Refresh JWT
	public void refreshToken(HttpServletRequest request, HttpServletResponse response)
			throws StreamWriteException, DatabindException, IOException {
		//Get request JWT from Header
		final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
		final String refreshToken;
		final String username;

		if (authHeader == null || !authHeader.startsWith("Bearer ")) { return; } //Not valid Bearer header

		refreshToken = authHeader.substring(7); //After "Bearer "
		username = jwtService.extractRefreshUsername(refreshToken); //Get username from token

		if (username != null) { //Check if this username exists
			var user = this.accountRepo.findByUsername(username)
					.orElseThrow(() -> new ResourceNotFoundException("User not found!"));

			if (jwtService.isRefreshTokenValid(refreshToken, user)) { //Validate token
				var jwtToken = generateToken(user);

				//Generate and return new authentication response
				var authResponse = AuthenticationResponse.builder()
						.token(jwtToken)
						.refreshToken(refreshToken) //Return the same refresh token
						.build();
				new ObjectMapper().writeValue(response.getOutputStream(), authResponse);
			}
		}
	}

	//Forgot password
	public void forgotPassword(String email) {

		//Get all accounts with this email
		List<Account> accounts = accountRepo.findByEmail(email);

		if (accounts.isEmpty()) throw new ResourceNotFoundException("User with this email not found!");
		String resetContent = ""; //Email content

		//Loop through all and send email
		for (Account a : accounts) {
			String token = updateResetToken(a); //Generate reset password token
			String url = frontUrl + "/reset-password?token=" + token; //Put url + parameter with reset token
			
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
	
	//Change password with {resetToken}
	public Account resetPassword(ResetPassRequest request) {
		//Check if user with username exists
		var user = accountRepo.findByResetPassToken(request.getToken())
				.orElseThrow(() -> new ResourceNotFoundException("User with this token does not exist!"));
		//Check token expiration
		if (isTokenExpired(user.getTokenCreationDate())) throw new HttpResponseException(HttpStatus.BAD_REQUEST, "Token hết hạn!");
        //Validate new password
        if (!request.getNewPass().equals(request.getNewPassRe())) throw new HttpResponseException(HttpStatus.BAD_REQUEST, "Mật khẩu không trùng khớp!");
        
        //Change password and save to database
        user.setPass(passwordEncoder.encode(request.getNewPass()));
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

	//Generate token with avatar
	protected String generateToken(Account user) {
		AccountProfile profile = (profile = user.getProfile()) != null ? profile : null;
		Image image = (image = profile.getImage()) != null ? image : null;
		String fileDownloadUri = image != null ? image.getFileDownloadUri() : null;

		Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("id", user.getId());
        extraClaims.put("image", fileDownloadUri);

        return jwtService.generateToken(extraClaims, user);
	}

	//Check has reset token expired
	private boolean isTokenExpired(final LocalDateTime tokenCreationDate) {

		LocalDateTime now = LocalDateTime.now();
		Duration diff = Duration.between(tokenCreationDate, now);

		return diff.toMinutes() >= EXPIRE_TOKEN_AFTER_MINUTES; //Default 30 minutes
	}
}
