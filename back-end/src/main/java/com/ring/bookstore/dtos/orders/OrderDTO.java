package com.ring.bookstore.dtos.orders;

import com.ring.bookstore.enums.OrderStatus;

import java.util.List;

//Order detail
public record OrderDTO(Long id,
                       Long shopId,
                       String shopName,
                       Double totalPrice,
                       Double totalDiscount,
                       Double shippingFee,
                       Double shippingDiscount,
                       OrderStatus status,
                       List<OrderItemDTO> items) {

}
