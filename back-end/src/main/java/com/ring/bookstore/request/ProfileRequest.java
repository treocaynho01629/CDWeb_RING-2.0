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
public class ProfileRequest { //Request body for profile

	@Size(max = 150, message = "Tên không quá 150 kí tự")
	private String name;
	
	@Size(max = 15, message = "Số điện thoại không quá 15 kí tự")
	private String phone;
	
	@Past(message = "Ngày sinh phải trước hôm nay!")
	@DateTimeFormat(pattern = "dd-MM-yyyy")
	private LocalDate dob;
	
	private String gender;

	private String image;
}
