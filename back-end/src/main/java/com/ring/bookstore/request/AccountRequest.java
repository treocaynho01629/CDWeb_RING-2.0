package com.ring.bookstore.request;

import java.time.LocalDate;

import org.springframework.format.annotation.DateTimeFormat;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AccountRequest { //Request body for account

	@NotNull(message = "Tên đăng nhập không được để trống!")
	@Size(min = 4, max = 24, message = "Tên đăng nhập dài 4-24 kí tự")
	private String userName;
	
	@NotNull(message = "Mật khẩu không được để trống!")
	@Size(min = 8, max = 24, message = "Mật khẩu dài 8-24 kí tự")
	private String pass;
	
	@NotNull(message = "Email không được để trống!")
	@Email(message = "Sai định dạng email!")
	private String email;
	
	@NotNull(message = "Quyền từ 1 - 3!")
	@Min(value = 1)
	@Max(value = 3)
	private Integer roles;
	
	@Size(max = 250, message = "Tên không quá 500 kí tự")
	private String name;
	
	@Size(max = 15, message = "Số điện thoại từ 8-15 kí tự")
	private String phone;
	
	@Past(message = "Ngày sinh phải trước hôm nay!")
	@DateTimeFormat(pattern = "dd-MM-yyyy")
	private LocalDate dob;
	
	private String gender;
	
	@Size(max = 500, message = "Địa chỉ phải từ 10-500 kí tự")
	private String address;
	
	private boolean keepOldPass;
}
