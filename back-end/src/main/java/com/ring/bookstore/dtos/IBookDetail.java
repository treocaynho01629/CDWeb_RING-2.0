package com.ring.bookstore.dtos;

import com.ring.bookstore.model.Publisher;

import java.time.LocalDate;

//Display book info
public interface IBookDetail {
    Integer getId();

    String getTitle();

    String getDescription();

    String getImage();

    Double getPrice();

    Integer getAmount();

    String getType();

    String getAuthor();

    Publisher getPublisher();

    Integer getCateId();

    String getCateName();

    String getSize();

    Integer getPage();

    LocalDate getDate();

    String getLanguage();

    Double getWeight();

    Integer getRateAmount();

    Integer getRateTotal();

    Integer getOrderTime();
}
