package com.ring.bookstore.dtos.orders;

import com.ring.bookstore.enums.OrderStatus;
import lombok.Builder;

import java.util.List;

//Order detail
@Builder
public record OrderDTO(Long id,
                       Long shopId,
                       String shopName,
                       Double totalPrice,
                       Double totalDiscount,
                       Double shippingFee,
                       Double shippingDiscount,
                       Integer totalItems,
                       OrderStatus status,
                       List<OrderItemDTO> items) {

}
