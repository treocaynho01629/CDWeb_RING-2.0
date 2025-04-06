package com.ring.bookstore.service.impl;

import com.ring.bookstore.exception.HttpResponseException;
import com.ring.bookstore.exception.ResetPasswordException;
import com.ring.bookstore.exception.ResourceNotFoundException;
import com.ring.bookstore.listener.forgot.OnResetTokenCreatedEvent;
import com.ring.bookstore.listener.registration.OnRegistrationCompleteEvent;
import com.ring.bookstore.listener.reset.OnResetPasswordCompletedEvent;
import com.ring.bookstore.model.dto.request.RegisterRequest;
import com.ring.bookstore.model.dto.request.ResetPassRequest;
import com.ring.bookstore.model.entity.Account;
import com.ring.bookstore.model.entity.AccountProfile;
import com.ring.bookstore.model.entity.Role;
import com.ring.bookstore.model.enums.UserRole;
import com.ring.bookstore.repository.AccountRepository;
import com.ring.bookstore.service.CaptchaService;
import com.ring.bookstore.service.RegisterService;
import com.ring.bookstore.service.RoleService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class RegisterServiceImpl implements RegisterService {

	private final AccountRepository accountRepo;

	private final RoleService roleService;
	private final CaptchaService captchaService;
	private final ResetTokenServiceImpl resetService;

	private final PasswordEncoder passwordEncoder;
    private final ApplicationEventPublisher eventPublisher;

	/**
	 * Performs user login based on the provided login request.
	 *
	 * @param registerRequest 	The registration request containing user details.
	 * @param request 			The HTTP request containing reCAPTCHA score in the header.
	 * @return The registered user entity.
	 */
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
			roles.add(roleService.findByRoleName(UserRole.ROLE_USER)
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

	/**
	 * Initiates the forgot password process for the given email address.
	 * Sends a reset password link to the user's email.
	 *
	 * @param email   The email address of the user requesting password reset.
	 * @param request The HTTP request containing reCAPTCHA score in the header.
	 */
	public void forgotPassword(String email, HttpServletRequest request) {
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
	}

	/**
	 * Resets the user's password using the provided reset token and new password details.
	 *
	 * @param token         The reset password token sent to the user's email.
	 * @param resetRequest  The request body containing the new password details.
	 * @param request       The HTTP request containing reCAPTCHA score in the header.
	 * @return The updated {@link Account} after password has been successfully reset.
	 */
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

}