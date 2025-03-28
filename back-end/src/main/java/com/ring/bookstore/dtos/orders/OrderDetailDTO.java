package com.ring.bookstore.dtos.orders;

import com.ring.bookstore.enums.OrderStatus;
import com.ring.bookstore.enums.PaymentType;
import com.ring.bookstore.enums.ShippingType;

import java.time.LocalDateTime;
import java.util.List;

//Order detail
public record OrderDetailDTO(Long orderId,
                             String name,
                             String phone,
                             String address,
                             String message,
                             LocalDateTime orderedDate,
                             LocalDateTime date,
                             Long id,
                             Long shopId,
                             String shopName,
                             Double totalPrice,
                             Double totalDiscount,
                             Double shippingFee,
                             Double shippingDiscount,
                             ShippingType shippingType,
                             PaymentType paymentType,
                             OrderStatus status,
                             List<OrderItemDTO> items) {

}
