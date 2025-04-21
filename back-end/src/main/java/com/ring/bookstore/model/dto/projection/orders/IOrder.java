package com.ring.bookstore.model.dto.projection.orders;

import com.ring.bookstore.model.dto.projection.images.IImage;
import com.ring.bookstore.model.entity.OrderDetail;
import com.ring.bookstore.model.enums.OrderStatus;

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
