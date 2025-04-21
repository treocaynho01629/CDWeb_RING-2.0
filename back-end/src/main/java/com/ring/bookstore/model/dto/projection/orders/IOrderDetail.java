package com.ring.bookstore.model.dto.projection.orders;

import com.ring.bookstore.model.enums.OrderStatus;
import com.ring.bookstore.model.enums.PaymentType;
import com.ring.bookstore.model.enums.ShippingType;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Represents an order detail & item projection as {@link IOrderDetail}
 */
public interface IOrderDetail {

    Long getId();

    Long getOrderId();

    String getName();

    String getCompanyName();

    String getPhone();

    String getCity();

    String getAddress();

    String getNote();

    LocalDateTime getOrderedDate();

    LocalDateTime getDate();

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
