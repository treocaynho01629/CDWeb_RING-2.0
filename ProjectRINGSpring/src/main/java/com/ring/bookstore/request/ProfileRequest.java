package com.ring.bookstore.request;

import java.time.LocalDate;

import org.springframework.format.annotation.DateTimeFormat;

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
public class ProfileRequest { //Request body for changing profile

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
}
