package com.ring.bookstore.dtos.orders;

import java.util.List;

//Order detail
public record OrderDetailDTO(Long id,
                             Long shopId,
                             String shopName,
                             Double totalPrice,
                             Double totalDiscount,
                             Double shippingFee,
                             Double shippingDiscount,
                             List<OrderItemDTO> items) {

}
