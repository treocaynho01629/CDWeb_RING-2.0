package com.ring.bookstore.model.dto.projection.orders;

import com.ring.bookstore.model.dto.projection.images.IImage;
import com.ring.bookstore.model.enums.OrderStatus;
import com.ring.bookstore.model.entity.OrderItem;

/**
 * Represents an order item projection as {@link IOrderItem}, containing details about a specific item
 * in an order, including book details, pricing, discounts, shipping, status, and shop information.
 */
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
