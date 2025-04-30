package com.ring.bookstore.model.dto.projection.orders;

import com.ring.bookstore.model.dto.projection.images.IImage;

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
