package com.ring.bookstore.model.dto.response.orders;

import com.ring.bookstore.model.dto.response.images.IImage;
import com.ring.bookstore.model.entity.OrderDetail;

import java.time.LocalDateTime;

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
