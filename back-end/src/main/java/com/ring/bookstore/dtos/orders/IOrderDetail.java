package com.ring.bookstore.dtos.orders;

import com.ring.bookstore.model.OrderDetail;

import java.time.LocalDateTime;

public interface IOrderDetail {
    OrderDetail getDetail();

    Long getOrderId();

    String getShopName();

    String getEmail();

    String getPhone();

    String getName();

    String getImage();

    String getAddress();

    String getMessage();

    LocalDateTime getDate();

    Double getTotal();

    Double getTotalDiscount();

    Integer getTotalItems();

    String getUsername();
}
