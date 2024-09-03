package com.ring.bookstore.dtos;

import java.time.LocalDate;

//Display book info
public interface IBookDetail extends IBookDisplay {
    Integer getRateTime();

    String getAuthor();

    Integer getPubId();

    Integer getCateId();

    String getCateName();

    String getType();

    String getSize();

    Integer getPage();

    LocalDate getDate();

    String getLanguage();

    Double getWeight();
}
