package com.ring.bookstore.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CartItemRequest {
    @NotNull(message = "Sản phẩm không được trống!")
    private Long id;
    @NotNull(message = "Số lượng không được bỏ trống!")
    private Short quantity;
}
