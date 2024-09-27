package com.ring.bookstore.dtos;

import com.ring.bookstore.enums.OrderStatus;

import java.util.List;

//Order detail
public record OrderFullDetailDTO(Long id,
                                 Long shopId,
                                 String shopName,
                                 Double totalPrice,
                                 OrderStatus status,
                                 List<OrderItemDTO> items) {

}
