package com.ring.bookstore.dtos;

import com.ring.bookstore.enums.OrderStatus;

import java.util.List;

//Order detail
public record OrderDetailDTO(Long id,
                             Long shopId,
                             String shopName,
                             Double totalPrice,
                             List<OrderItemDTO> items) {

}
