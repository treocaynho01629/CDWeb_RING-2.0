package com.ring.bookstore.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

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
