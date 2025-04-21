package com.ring.bookstore.model.dto.response.orders;

import com.ring.bookstore.model.enums.OrderStatus;
import com.ring.bookstore.model.enums.ShippingType;
import lombok.Builder;

import java.util.List;

/**
 * Represents a checkout response as {@link OrderDTO}.
 */
@Builder
public record OrderDTO(Long id,
                Long shopId,
                String shopName,
                Double totalPrice,
                Double totalDiscount,
                Double shippingFee,
                Double shippingDiscount,
                ShippingType shippingType,
                String note,
                Integer totalItems,
                OrderStatus status,
                List<OrderItemDTO> items) {

}
