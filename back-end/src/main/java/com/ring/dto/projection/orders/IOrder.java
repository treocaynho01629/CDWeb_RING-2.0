package com.ring.dto.projection.orders;

import com.ring.model.enums.OrderStatus;

import java.time.LocalDateTime;

/**
 * Represents an order detail projection as {@link IOrder}
 */
public interface IOrder {

    Long getOrderId();

    Long getId();

    Long getShopId();

    String getShopName();

    String getNote();

    LocalDateTime getDate();

    Double getTotalPrice();

    Double getDiscount();

    Double getShippingFee();

    Double getShippingDiscount();

    Integer getTotalItems();

    OrderStatus getStatus();
}
