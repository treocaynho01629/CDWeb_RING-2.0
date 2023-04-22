package com.ring.bookstore.request;

import java.util.List;

import com.ring.bookstore.model.CartItem;

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
	
	@NotNull(message = "Cart can not be empty")
	private List<CartItem> cart;
	@NotNull(message = "First name is required")
	private String firstName;
	@NotNull(message = "Last name is required")
	private String lastName;
	@NotNull(message = "Phone number is required")
	private String phone;
	@NotNull(message = "Address is required")
	private String address;
	private String message;
}
