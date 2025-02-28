package com.ring.bookstore.request;

import java.util.List;

import com.ring.bookstore.enums.PaymentType;
import com.ring.bookstore.enums.ShippingType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
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
	@NotEmpty(message = "Giỏ hàng không được trống!")
	private List<CartDetailRequest> cart;

	private String coupon;

	@Size(max = 300, message = "Ghi chú không quá quá 300 kí tự!")
	private String message;

	@NotNull(message = "Hình thức giao hàng không được bỏ trống!")
	private ShippingType shippingType;

	@NotNull(message = "Hình thức thanh toán không được bỏ trống!")
	private PaymentType paymentMethod;

	@Valid
	@NotNull(groups = AddressRequest.class)
	private AddressRequest address;
}
