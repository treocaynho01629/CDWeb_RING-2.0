package com.ring.bookstore.dtos.orders;

import com.ring.bookstore.enums.OrderStatus;
import com.ring.bookstore.enums.PaymentType;
import com.ring.bookstore.enums.ShippingType;
import com.ring.bookstore.model.OrderItem;

import java.time.LocalDateTime;

public interface IOrderDetailItem {
    Long getOrderId();

    String getName();

    String getCompanyName();

    String getPhone();

    String getCity();

    String getAddress();

    String getMessage();

    LocalDateTime getOrderedDate();

    LocalDateTime getDate();

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

    ShippingType getShippingType();

    PaymentType getPaymentType();

    OrderStatus getStatus();

    Long getShopId();

    String getShopName();
}
