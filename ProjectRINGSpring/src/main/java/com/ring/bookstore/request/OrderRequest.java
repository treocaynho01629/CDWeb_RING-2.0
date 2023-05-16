package com.ring.bookstore.request;

import java.util.List;

import com.ring.bookstore.model.CartItem;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderRequest {
	
	@NotNull(message = "Giỏ hàng không được trống!")
	private List<CartItem> cart;
	
	@NotBlank(message = "Họ đệm không được bỏ trống!")
	private String firstName;
	
	@NotBlank(message = "Tên không được bỏ trống!")
	private String lastName;
	
	@NotBlank(message = "Số điện thoại không được bỏ trống!")
	private String phone;
	
	@NotBlank(message = "Địa chỉ không được bỏ trống!")
	private String address;
	private String message;
}
