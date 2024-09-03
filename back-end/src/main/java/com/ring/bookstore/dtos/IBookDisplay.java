package com.ring.bookstore.dtos;

import java.math.BigDecimal;

//Display book info
public interface IBookDisplay {
    Integer getId();

    String getTitle();

    String getDescription();

    String getImage();

    Double getPrice();

    BigDecimal getOnSale();

    Integer getAmount();

    Double getRating();

    Integer getOrderTime();
}
