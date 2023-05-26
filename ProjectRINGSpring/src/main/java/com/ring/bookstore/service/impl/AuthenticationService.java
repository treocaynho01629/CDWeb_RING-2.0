package com.ring.bookstore.service.impl;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.exc.StreamWriteException;
import com.fasterxml.jackson.databind.DatabindException;
import com.fasterxml.jackson.databind.ObjectMapper;
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

import java.io.IOException;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthenticationService { // Dịch vụ Xác thực

	private final AccountRepository accountRepo;
	private final PasswordEncoder passwordEncoder;
	private final AuthenticationManager authenticationManager;
	private final RoleService roleService;
	private final EmailService emailService;
	private final JwtService jwtService;
	private static final long EXPIRE_TOKEN_AFTER_MINUTES = 30;
	
	// Đăng ký
	public AuthenticationResponse register(RegisterRequest request) {

		// Kiểm tra Người dùng vs Username và Email đã tồn tại chưa
		if (!accountRepo.findByUserName(request.getUserName()).isEmpty()) {
			throw new HttpResponseException(HttpStatus.BAD_REQUEST, "Người dùng với tên đăng nhập này đã tồn tại!");
		}

		// Set Quyền >> USER
		Set<Role> roles = new HashSet<>();
		roles.add(roleService.findByRoleName(RoleName.ROLE_USER)
				.orElseThrow(() -> new HttpResponseException(HttpStatus.NOT_FOUND, "No roles has been set")));

		// Tạo Người dùng mới + set thông tin
		var acc = Account.builder().userName(request.getUserName()).pass(passwordEncoder.encode(request.getPass()))
				.email(request.getEmail()).roles(roles).build();

		accountRepo.save(acc); // Lưu Người dùng vào CSDL
		var jwtToken = jwtService.generateToken(acc); // Tạo JWT mới của Người dùng
		var refreshToken = jwtService.generateRefreshToken(acc); // Tạo refresh token
		
		//Tạo và gửi Email
        String subject = "RING! - BOOKSTORE: Đăng ký thành công! "; 
        String content = "<h1><b style=\"color: #63e399;\">RING!</b> - BOOKSTORE</h1>\n"
                + "<h2 style=\"background-color: #63e399; padding: 10px; color: white;\" >\r\n"
                + "Tài khoản của bạn đã được đăng ký thành công!\r\n"
                + "</h2>\n"
                + "<h3>Tài khoản RING!:</h3>\n"
                + "<p><b>- Tên đăng nhập: </b>" + request.getUserName() + " đã đăng ký thành công</p>\n"
                + "<p>- Chúc bạn có trả nghiệm vui vẻ khi mua sách tại RING! - BOOKSTORE</p>\n"
                + "<br><p>Liên hệ hỗ trợ khi cần thiết: <b>ringbookstore@ring.email</b></p>\n"
                + "<br><br><h3>Cảm ơn đã tham gia!</h3>\n";
        emailService.sendHtmlMessage(request.getEmail(), subject, content); //Gửi

		// Tạo và trả về thông tin xác thực Người dùng
		return AuthenticationResponse.builder().token(jwtToken).refreshToken(refreshToken).roles(roles).build();
	}

	// Xác thực đăng nhập
	public AuthenticationResponse authenticate(AuthenticationRequest request) throws ResourceNotFoundException {
		// Kiểm tra Người dùng có tồn tại?
		var user = accountRepo.findByUserName(request.getUserName())
				.orElseThrow(() -> new ResourceNotFoundException("User does not exist!"));

		Set<Role> roles = user.getRoles();

		// Kiểm tra JWT có hợp lệ
		try {
			Authentication authentication = authenticationManager
					.authenticate(new UsernamePasswordAuthenticationToken(request.getUserName(), request.getPass()));

			SecurityContextHolder.getContext().setAuthentication(authentication); // Hợp lệ >> Gán lên Security Context Holder của Spring
		} catch (Exception e) { // Ko hợp lệ
			throw new ResourceNotFoundException("Token not found!"); // Không hợp lệ >> Báo lỗi
		}

		// Tạo JWT mới
		var jwtToken = jwtService.generateToken(user);
		var refreshToken = jwtService.generateRefreshToken(user);

		// Tạo và trả về thông tin xác thực Người dùng
		return AuthenticationResponse.builder().token(jwtToken).refreshToken(refreshToken).roles(roles).build();
	}

	//Làm mới JWT
	public void refreshToken(HttpServletRequest request, HttpServletResponse response)
			throws StreamWriteException, DatabindException, IOException {
		// Lấy JWT từ Header của request
		final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
		final String refreshToken;
		final String userName;

		if (authHeader == null || !authHeader.startsWith("Bearer ")) { return; } //Không hợp lệ >> Huỷ làm mới

		refreshToken = authHeader.substring(7); // Sau "Bearer "
		userName = jwtService.extractUsername(refreshToken); //Lấy tên Người dùng từ Refresh Token

		if (userName != null) { // Check Người dùng có tồn tại?
			var user = this.accountRepo.findByUserName(userName)
					.orElseThrow(() -> new ResourceNotFoundException("User does not exist!"));

			Set<Role> roles = user.getRoles();
			
			if (jwtService.isTokenValid(refreshToken, user)) { //Kiểm tra Refresh Token có hợp lệ?
				var jwtToken = jwtService.generateToken(user);

				//Tạo JWT mới >> Response = JWT mới
				var authResponse = AuthenticationResponse.builder().token(jwtToken).refreshToken(refreshToken)
						.roles(roles).build();
				new ObjectMapper().writeValue(response.getOutputStream(), authResponse);
			}
		}
	}

	//Quên mật khẩu
	public void forgotPassword(String email) {

		List<Account> accounts = accountRepo.findByEmail(email);
		if (accounts.size() == 0) throw new ResourceNotFoundException("User with this email does not exist!");
		String resetContent = "";

		for (Account a : accounts) {
			String token = updateResetToken(a);
			String url = "http://localhost:5173/reset-password?token=" + token;
			
			//Thêm token vào nội dung email
			resetContent += 
			  "<div style=\"display: flex; padding: 5px 15px; border: 0.5px solid lightgray;\">\r\n"
			+ "	   <div style=\"margin-left: 15px; margin-bottom: 15px;\">\r\n"
			+ "      <h3>Tài khoản: "+ a.getUsername() +"</h3>\r\n"
			+ "      <a style=\"font-size: 14px;\" href=\"" + url + "\">Nhấp vào đây để đổi mật khẩu mới</a>\r\n"
			+ "    </div>\r\n"
			+ "</div><br><br>";
		}
		
		//Tạo và gửi Email
        String subject = "RING! - BOOKSTORE: Yêu cầu khôi phục mật khẩu! "; 
        String content = "<h1><b style=\"color: #63e399;\">RING!</b> - BOOKSTORE</h1>\n"
                + "<h2 style=\"background-color: #63e399; padding: 10px; color: white;\" >\r\n"
                + "Tài khoản của bạn đã được yêu cầu đổi mật khẩu!\r\n"
                + "</h2>\n"
                + "<h3>Tài khoản RING!:</h3>\n"
                + resetContent 
                + "<p>- Chức bạn có trả nghiệm vui vẻ khi mua sách tại RING! - BOOKSTORE</p>\n"
                + "<br><p>Không phải bạn thực hiện thay đổi trên? Liên hệ và yêu cầu xử lý tại: <b>ringbookstore@ring.email</b></p>\n"
                + "<br><br><h3>Cảm ơn đã sử dụng dịch vụ!</h3>\n";
        emailService.sendHtmlMessage(email, subject, content); //Gửi
	}
	
	//Tạo token reset mật khẩu mới cho tài khoản
	private String updateResetToken(Account user) {
		StringBuilder token = new StringBuilder(); //Random string token

		String resetToken = token.append(UUID.randomUUID().toString())
				.append(UUID.randomUUID().toString()).toString();
		
		user.setResetPassToken(resetToken);
		user.setTokenCreationDate(LocalDateTime.now());
		accountRepo.save(user);
		
		return resetToken;
	}
	
	//Đổi mật khẩu = token reset
	public Account resetPassword(ResetPassRequest request) {
		//Kiểm tra Người dùng với token có tồn tại ko
		var user = accountRepo.findByResetPassToken(request.getToken())
				.orElseThrow(() -> new ResourceNotFoundException("User with this token does not exist!"));
		//Kiểm tra token hết hạn chưa
		if (isTokenExpired(user.getTokenCreationDate())) throw new HttpResponseException(HttpStatus.BAD_REQUEST, "Token hết hạn!");
        //Kiểm tra mật khẩu mới có trùng khớp không
        if (!request.getNewPass().equals(request.getNewPassRe())) throw new HttpResponseException(HttpStatus.BAD_REQUEST, "Mật khẩu không trùng khớp!");
        
        // Đổi mật khẩu, xoá token, lưu vào CSDL
        user.setPass(passwordEncoder.encode(request.getNewPass()));
        user.setTokenCreationDate(null);
        user.setResetPassToken(null);
        Account savedAccount = accountRepo.save(user);
        
        //Tạo và gửi Email
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
        emailService.sendHtmlMessage(user.getEmail(), subject, content); //Gửi
        
        return savedAccount; //Trả về
	}
	

	//Kiểm tra token reset mật khẩu hết hạn chưa
	private boolean isTokenExpired(final LocalDateTime tokenCreationDate) {

		LocalDateTime now = LocalDateTime.now();
		Duration diff = Duration.between(tokenCreationDate, now);

		return diff.toMinutes() >= EXPIRE_TOKEN_AFTER_MINUTES; //Cách 30p
	}
}
