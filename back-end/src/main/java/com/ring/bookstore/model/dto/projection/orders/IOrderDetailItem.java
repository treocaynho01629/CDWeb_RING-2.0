package com.ring.bookstore.model.dto.projection.orders;

import com.ring.bookstore.model.dto.projection.images.IImage;
import com.ring.bookstore.model.enums.OrderStatus;
import com.ring.bookstore.model.enums.PaymentType;
import com.ring.bookstore.model.enums.ShippingType;
import com.ring.bookstore.model.entity.OrderItem;

import java.time.LocalDateTime;

/**
 * Represents an order detail & item projection as {@link IOrderDetailItem}, containing detailed
 * information about a specific item in an order, including customer and shop details, order item details,
 * pricing, discounts, shipping, and status information.
 */
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
