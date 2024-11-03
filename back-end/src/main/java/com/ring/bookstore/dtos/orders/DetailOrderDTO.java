package com.ring.bookstore.dtos.orders;

import java.time.LocalDateTime;
import java.util.List;

//Order detail
public record DetailOrderDTO(Long orderId,
                             String fullName,
                             String email,
                             String phone,
                             String address,
                             String message,
                             LocalDateTime date,
                             Long id,
                             Long shopId,
                             String shopName,
                             Double totalPrice,
                             Double totalDiscount,
                             Double shippingFee,
                             Double shippingDiscount,
                             List<OrderItemDTO> items) {

}
