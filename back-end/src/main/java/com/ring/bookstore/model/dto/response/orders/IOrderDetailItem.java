package com.ring.bookstore.model.dto.response.orders;

import com.ring.bookstore.model.dto.response.images.IImage;
import com.ring.bookstore.model.enums.OrderStatus;
import com.ring.bookstore.model.enums.PaymentType;
import com.ring.bookstore.model.enums.ShippingType;
import com.ring.bookstore.model.entity.OrderItem;

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

    IImage getImage();

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
