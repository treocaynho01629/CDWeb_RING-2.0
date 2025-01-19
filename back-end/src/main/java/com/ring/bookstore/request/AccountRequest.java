package com.ring.bookstore.request;

import java.time.LocalDate;

import com.ring.bookstore.enums.Gender;
import jakarta.validation.constraints.*;
import org.springframework.format.annotation.DateTimeFormat;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AccountRequest { //Request body for account

	@NotBlank(message = "Tên đăng nhập không được để trống!")
	@Size(min = 4, max = 24, message = "Tên đăng nhập dài 4-24 kí tự")
	private String username;
	
	@Size(min = 8, max = 24, message = "Mật khẩu dài 8-24 kí tự")
	private String pass;
	
	@NotBlank(message = "Email không được để trống!")
	@Email(message = "Sai định dạng email!")
	private String email;
	
	@NotNull(message = "Quyền người dùng từ 1-3!")
	@Min(value = 1, message = "Quyền người dùng từ 1-3!")
	@Max(value = 3, message = "Quyền người dùng từ 1-3!")
	private Integer roles;
	
	@Size(max = 250, message = "Tên không quá 250 kí tự")
	private String name;
	
	@Pattern(regexp="\\(?([0-9]{3})\\)?([ .-]?)([0-9]{3})\\2([0-9]{3})", message = "Sai định dạng số điện thoại")
	private String phone;
	
	@Past(message = "Ngày sinh phải trước hôm nay!")
	@DateTimeFormat(pattern = "dd-MM-yyyy")
	private LocalDate dob;
	
	private Gender gender;

	private String image;
	
	private boolean keepOldPass;
}
