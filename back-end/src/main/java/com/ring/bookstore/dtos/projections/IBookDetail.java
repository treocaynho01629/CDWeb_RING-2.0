package com.ring.bookstore.dtos.projections;

import com.ring.bookstore.model.Book;

public interface IBookDetail {
    Book getBook();

    Long getShopId();

    String getImage();

    Integer getTotalOrders();

    Double getRating();

    Integer getTotalRates();

    Integer getFive();

    Integer getFour();

    Integer getThree();

    Integer getTwo();

    Integer getOne();
}
