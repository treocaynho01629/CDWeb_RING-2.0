package com.ring.bookstore.model.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Represents an order detail request as {@link CartDetailRequest}.
 */
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CartDetailRequest {

    @NotNull(message = "Cửa hàng không được bỏ trống!")
    private Long shopId;

    private String coupon;

    @NotNull(message = "Sản phẩm không được trống!")
    private List<CartItemRequest> items;
}
