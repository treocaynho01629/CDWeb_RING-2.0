package com.ring.bookstore.dtos.orders;

import java.time.LocalDateTime;
import java.util.List;

//Order detail
public record OrderDetailDTO(Long orderId,
                             String email,
                             String name,
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
