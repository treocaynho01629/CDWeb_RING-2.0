package com.ring.bookstore.model.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Represents a request as {@link ChangePassRequest} to change user's password.
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ChangePassRequest {

	@NotNull(message = "Mật khẩu hiện tại không được để trống!")
	private String pass;
	
	@NotNull(message = "Mật khẩu mới không được để trống!")
	@Size(min = 8, max = 24, message = "Mật khẩu dài 8-24 kí tự")
	private String newPass;
	
	@NotNull(message = "Mật khẩu mới không được để trống!")
	@Size(min = 8, max = 24, message = "Mật khẩu dài 8-24 kí tự")
	private String newPassRe;
}
