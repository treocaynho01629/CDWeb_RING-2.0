package com.ring.bookstore.model.dto.response.orders;

import com.ring.bookstore.model.dto.response.images.IImage;
import com.ring.bookstore.model.enums.OrderStatus;
import com.ring.bookstore.model.entity.OrderItem;

public interface IOrderItem {
    OrderItem getItem();

    Long getBookId();

    String getTitle();

    String getSlug();

    IImage getImage();

    Long getDetailId();

    Double getTotalPrice();

    Double getShippingFee();

    Double getShippingDiscount();

    Double getDiscount();

    OrderStatus getStatus();

    Long getShopId();

    String getShopName();
}
