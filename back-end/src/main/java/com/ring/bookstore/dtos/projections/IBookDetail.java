package com.ring.bookstore.dtos.projections;

import com.ring.bookstore.model.Book;

public interface IBookDetail {
    Book getBook();

    String getImage();

    Double getRating();

    Integer getRateTime();

    Integer getOrderTime();
}
