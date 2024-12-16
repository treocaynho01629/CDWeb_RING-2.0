package com.ring.bookstore.dtos.books;

import java.math.BigDecimal;

//Display book info
public interface IBookDisplay {
    Long getId();

    String getSlug();

    String getTitle();

    String getImage();

    String getDescription();

    Double getPrice();

    BigDecimal getDiscount();

    Short getAmount();

    Long getShopId();

    String getShopName();

    Double getRating();

    Integer getTotalOrders();
}
