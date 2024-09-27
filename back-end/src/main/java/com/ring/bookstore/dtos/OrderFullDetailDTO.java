package com.ring.bookstore.dtos;

import com.ring.bookstore.enums.OrderStatus;

import java.util.List;

//Detail when click view
public record OrderFullDetailDTO(Long id,
                                 Long orderId,
                                 String fullName,
                                 String phone,
                                 String address,
                                 Long shopId,
                                 String shopName,
                                 Double totalPrice,
                                 Double shippingFee,
                                 Double shippingDiscount,
                                 Double discount,
                                 OrderStatus status,
                                 List<OrderItemDTO> items) {

}
