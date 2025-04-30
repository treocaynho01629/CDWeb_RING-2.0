package com.ring.bookstore.model.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

import com.ring.bookstore.model.enums.ShippingType;

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

    @Size(max = 300, message = "Ghi chú không quá quá 300 kí tự!")
    private String note;

    @NotNull(message = "Hình thức giao hàng không được bỏ trống!")
    private ShippingType shippingType;

    @NotNull(message = "Sản phẩm không được trống!")
    private List<CartItemRequest> items;
}
