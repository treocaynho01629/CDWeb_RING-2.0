package com.ring.bookstore.model.dto.request;

import com.ring.bookstore.model.enums.PaymentType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Represents a checkout request as {@link OrderRequest} to proceed a checkout.
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderRequest {

	@NotNull(message = "Giỏ hàng không được trống!")
	@NotEmpty(message = "Giỏ hàng không được trống!")
	private List<CartDetailRequest> cart;

	private String coupon;

	@NotNull(message = "Hình thức thanh toán không được bỏ trống!")
	private PaymentType paymentMethod;

	@Valid
	@NotNull(groups = AddressRequest.class)
	private AddressRequest address;
}
