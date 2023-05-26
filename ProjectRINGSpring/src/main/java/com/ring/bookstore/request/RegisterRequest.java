package com.ring.bookstore.request;

import jakarta.validation.constraints.Email;
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
public class RegisterRequest { //Để đăng ký

	@NotNull(message = "Tên đăng nhập không được để trống!")
	@Size(min = 4, max = 24, message = "Tên đăng nhập dài 4-24 kí tự")
	private String userName;
	
	@NotNull(message = "Mật khẩu không được để trống!")
	@Size(min = 8, max = 24, message = "Mật khẩu dài 8-24 kí tự")
	private String pass;
	
	@NotNull(message = "Email không được để trống!")
	@Email(message = "Sai định dạng email!")
	private String email;
}
