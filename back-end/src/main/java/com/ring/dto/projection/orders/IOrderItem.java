package com.ring.dto.projection.orders;

import com.ring.dto.projection.images.IImage;

import java.math.BigDecimal;

/**
 * Represents an order item projection as {@link IOrderItem}
 */
public interface IOrderItem {

    Long getId();

    Short getQuantity();

    Double getPrice();

    BigDecimal getDiscount();

    Long getBookId();

    String getTitle();

    String getSlug();

    IImage getImage();

    Long getDetailId();

}
