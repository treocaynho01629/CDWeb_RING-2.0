package com.ring.bookstore.request;

import com.ring.bookstore.enums.ShippingType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CalculateRequest {
	
	@NotNull(message = "Giỏ hàng không được trống!")
	@NotEmpty(message = "Giỏ hàng không được trống!")
	private List<CartDetailRequest> cart;

	private String coupon;

	private ShippingType shippingType;

	@Valid
	private AddressRequest address;
}
