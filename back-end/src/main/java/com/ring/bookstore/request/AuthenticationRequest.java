package com.ring.bookstore.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthenticationRequest { //Request body for auth

	@NotBlank(message = "Tên đăng nhập không được để trống!")
	private String username;
	
	@NotBlank(message = "Mật khẩu không được để trống!")
	private String pass;
}