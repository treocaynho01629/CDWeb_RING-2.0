package com.ring.dto.projection.books;

import com.ring.dto.projection.images.IImage;

import java.math.BigDecimal;

/**
 * Represents a book slim projection as {@link IBookDisplay}, containing basic book's ID,
 * slug, title, description, price, discount, amount, shop details, rating, total orders,
 * and associated image.
 */
public interface IBookDisplay {

    Long getId();

    String getSlug();

    String getTitle();

    String getDescription();

    Double getPrice();

    BigDecimal getDiscount();

    Short getAmount();

    Long getShopId();

    String getShopName();

    Double getRating();

    Integer getTotalOrders();

    IImage getImage();
}
