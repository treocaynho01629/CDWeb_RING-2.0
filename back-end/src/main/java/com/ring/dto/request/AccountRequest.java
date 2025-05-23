package com.ring.dto.request;

import com.ring.config.validator.NullOrNotBlank;
import com.ring.model.enums.Gender;
import com.ring.model.enums.UserRole;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.util.List;

/**
 * Represents an account request as {@link AccountRequest}.
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AccountRequest {

	@NotBlank(message = "Tên đăng nhập không được để trống!")
	@Size(min = 4, max = 24, message = "Tên đăng nhập dài 4-24 kí tự")
	private String username;

	@NullOrNotBlank(message = "Mật khẩu không được để trống!")
	@Size(min = 8, max = 24, message = "Mật khẩu dài 8-24 kí tự")
	private String pass;

	@NotBlank(message = "Email không được để trống!")
	@Email(message = "Sai định dạng email!")
	private String email;

	@NotNull(message = "Chức vụ không được để trống!")
	@NotEmpty(message = "Chức vụ không được để trống!")
	private List<UserRole> roles;

	@Size(max = 250, message = "Tên không quá 250 kí tự")
	private String name;

	@Pattern(regexp = "\\(?([0-9]{3})\\)?([ .-]?)([0-9]{3})\\2([0-9]{3})", message = "Sai định dạng số điện thoại")
	private String phone;

	@Past(message = "Ngày sinh phải trước hôm nay!")
	@DateTimeFormat(pattern = "dd-MM-yyyy")
	private LocalDate dob;

	private Gender gender;

	private String image;
}
