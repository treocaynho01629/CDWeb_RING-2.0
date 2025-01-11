package com.ring.bookstore.dtos.books;

import com.ring.bookstore.enums.BookType;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public interface IBook {
    Long getId();

    String getSlug();

    Double getPrice();

    BigDecimal getDiscount();

    String getTitle();

    String getDescription();

    BookType getType();

    String getAuthor();

    Short getAmount();

    Long getImage();

    Integer getPubId();

    String getPubName();

    Integer getCateId();

    String getCateName();

    Long getShopId();

    String getShopName();

    String getSize();

    Integer getPages();

    LocalDate getDate();

    String getLanguage();

    Double getWeight();

    List<Long> getPreviews();
}
