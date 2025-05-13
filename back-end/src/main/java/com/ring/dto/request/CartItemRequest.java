package com.ring.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Represents an order item request as {@link CartItemRequest}.
 */
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CartItemRequest {

    @NotNull(message = "Sản phẩm không được trống!")
    private Long id;

    @NotNull(message = "Số lượng không được bỏ trống!")
    private Short quantity;
}
