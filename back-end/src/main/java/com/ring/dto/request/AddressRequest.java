package com.ring.dto.request;

import com.ring.model.enums.AddressType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Represents an address request as {@link AddressRequest}.
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AddressRequest {

	@NotBlank(message = "Tên người nhận không được để trống!")
	@Size(max = 250, message = "Tên người nhận không quá 250 kí tự!")
	private String name;

	@Size(max = 250, message = "Tên công ty không quá 250 kí tự!")
	private String companyName;

	@NotBlank(message = "Số điện thoại không được để trống!")
	@Size(min = 9, max = 12, message = "Sai định dạng số điện thoại")
	private String phone;

	@NotBlank(message = "Tỉnh/Thành phố không được để trống!")
	@Size(max = 200, message = "Tỉnh/Thành phố không quá 200 kí tự!")
	private String city;

	@NotBlank(message = "Địa chỉ không được để trống!")
	@Size(max = 300, message = "Địa chỉ không quá 300 kí tự!")
	private String address;

	private AddressType type;

	private Boolean isDefault = false;
}
