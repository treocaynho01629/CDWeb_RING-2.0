package com.ring.bookstore.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ResetPassRequest { //Để khôi phục mật khẩu

	@NotNull(message = "Token không được để trống!")
	private String token;
	
	@NotNull(message = "Mật khẩu mới không được để trống!")
	@Size(min = 8, max = 24, message = "Mật khẩu dài 8-24 kí tự")
	private String newPass;
	
	@NotNull(message = "Mật khẩu mới không được để trống!")
	@Size(min = 8, max = 24, message = "Mật khẩu dài 8-24 kí tự")
	private String newPassRe;
}
