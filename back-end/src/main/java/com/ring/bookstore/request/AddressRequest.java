package com.ring.bookstore.request;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AddressRequest { //Request body for address
	@NotNull(message = "Tên người nhận không được để trống!")
	@Size(max = 250, message = "Tên người nhận không quá 250 kí tự")
	private String name;

	@Size(max = 250, message = "Tên công ty không quá 250 kí tự")
	private String companyName;

	@NotNull(message = "Số điện thoại không được để trống!")
	@Size(max = 15, message = "Số điện thoại không quá 15 kí tự")
	private String phone;

	@NotNull(message = "Tỉnh/Thành phố không được để trống!")
	@Size(max = 200, message = "Tỉnh/Thành phố không quá 200 kí tự")
	private String city;

	@NotNull(message = "Địa chỉ không được để trống!")
	@Size(max = 300, message = "Địa chỉ không quá 300 kí tự")
	private String address;

	@Size(max = 200, message = "Loại địa chỉ không quá 200 kí tự")
	private String type;

	private Boolean isDefault = false;
}
