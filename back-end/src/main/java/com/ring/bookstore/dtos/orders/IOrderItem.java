package com.ring.bookstore.dtos.orders;

import com.ring.bookstore.enums.OrderStatus;
import com.ring.bookstore.model.OrderItem;

public interface IOrderItem {
    OrderItem getItem();

    Long getBookId();

    String getTitle();

    String getSlug();

    String getImage();

    Long getDetailId();

    Double getTotalPrice();

    Double getShippingFee();

    Double getShippingDiscount();

    Double getDiscount();

    OrderStatus getStatus();

    Long getShopId();

    String getShopName();
}
