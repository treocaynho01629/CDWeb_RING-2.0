package com.ring.bookstore.dtos.projections;

import java.math.BigDecimal;

//Display book info
public interface IBookDisplay {
    Long getId();

    String getSlug();

    String getTitle();

    String getImage();

    Double getPrice();

    BigDecimal getDiscount();

    Short getAmount();

    Long getShopId();

    String getShopName();

    Double getRating();

    Integer getTotalOrders();
}
