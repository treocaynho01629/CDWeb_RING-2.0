package com.ring.bookstore.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthenticationRequest {

	@NotNull(message = "Tên đăng nhập không được để trống!")	
	private String userName;
	
	@NotNull(message = "Mật khẩu không được để trống!")
	private String pass;
}