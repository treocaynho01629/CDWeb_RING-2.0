package com.ring.bookstore.dtos.projections;

import java.math.BigDecimal;

//Display book info
public interface IBookDisplay {
    Long getId();

    String getTitle();

    String getDescription();

    String getImage();

    Double getPrice();

    BigDecimal getOnSale();

    Short getAmount();

    Double getRating();

    Integer getOrderTime();
}
