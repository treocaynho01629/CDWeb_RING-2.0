package com.ring.bookstore.request;

import java.util.List;

import com.ring.bookstore.model.CartItem;

import jakarta.validation.constraints.NotBlank;
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
public class OrderRequest { //Request body when order
	
	@NotNull(message = "Giỏ hàng không được trống!")
	private List<CartItem> cart;
	
	@NotBlank(message = "Tên không được bỏ trống!")
	@Size(min = 5, max = 150, message = "Tên phải dài từ 5-150 kí tự")
	private String name;
	
	@NotBlank(message = "Số điện thoại không được bỏ trống!")
	private String phone;
	
	@NotBlank(message = "Địa chỉ không được bỏ trống!")
	private String address;
	private String message;
}
