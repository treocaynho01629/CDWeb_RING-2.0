package com.ring.bookstore.model.dto.response.orders;

import com.ring.bookstore.model.enums.OrderStatus;
import com.ring.bookstore.model.enums.PaymentType;
import com.ring.bookstore.model.enums.ShippingType;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Represents an order detail response as {@link OrderDetailDTO}.
 */
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
