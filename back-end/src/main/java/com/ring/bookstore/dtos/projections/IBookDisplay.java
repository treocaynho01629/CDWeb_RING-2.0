package com.ring.bookstore.dtos.projections;

import java.math.BigDecimal;

//Display book info
public interface IBookDisplay {
    Long getId();

    String getSlug();

    String getTitle();

    String getDescription();

    String getImage();

    Double getPrice();

    BigDecimal getDiscount();

    Short getAmount();

    Double getRating();

    Integer getTotalOrders();
}
