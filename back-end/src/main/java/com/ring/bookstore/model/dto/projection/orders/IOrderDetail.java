package com.ring.bookstore.model.dto.projection.orders;

import com.ring.bookstore.model.dto.projection.images.IImage;
import com.ring.bookstore.model.entity.OrderDetail;

import java.time.LocalDateTime;

/**
 * Represents an order detail projection as {@link IOrderDetail}, containing the details of an order
 * including information about the order, shop, customer, items, discounts, and the order date.
 */
public interface IOrderDetail {

    OrderDetail getDetail();

    Long getOrderId();

    String getShopName();

    String getEmail();

    String getPhone();

    String getName();

    IImage getImage();

    String getAddress();

    String getMessage();

    LocalDateTime getDate();

    Double getTotal();

    Double getTotalDiscount();

    Integer getTotalItems();

    String getUsername();
}
