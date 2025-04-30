package com.ring.bookstore.model.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Represents a request as {@link ResetPassRequest} to reset user's password.
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ResetPassRequest {

	@NotNull(message = "Mật khẩu mới không được để trống!")
	@Size(min = 8, max = 24, message = "Mật khẩu dài 8-24 kí tự")
	private String password;
	
	@NotNull(message = "Mật khẩu mới không được để trống!")
	@Size(min = 8, max = 24, message = "Mật khẩu dài 8-24 kí tự")
	private String reInputPassword;
}
