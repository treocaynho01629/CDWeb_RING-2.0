package com.ring.dto.projection.orders;

import com.ring.model.enums.OrderStatus;
import com.ring.model.enums.PaymentStatus;
import com.ring.model.enums.PaymentType;
import com.ring.model.enums.ShippingType;

import java.time.LocalDateTime;

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

    PaymentStatus getPaymentStatus();

    Long getShopId();

    String getShopName();
}
