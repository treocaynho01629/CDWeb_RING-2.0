package com.ring.bookstore.dtos.books;

import com.ring.bookstore.dtos.images.IImage;
import com.ring.bookstore.enums.BookLanguage;
import com.ring.bookstore.enums.BookType;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public interface IBookDetail {
    Long getId();

    String getSlug();

    Double getPrice();

    BigDecimal getDiscount();

    String getTitle();

    String getDescription();

    BookType getType();

    String getAuthor();

    Short getAmount();

    IImage getImage();

    Integer getPubId();

    String getPubName();

    Integer getCateId();

    String getCateName();

    String getCateSlug();

    Integer getParentId();

    String getParentName();

    String getParentSlug();

    Integer getAncestorId();

    Long getShopId();

    String getShopName();

    String getSize();

    Integer getPages();

    LocalDate getDate();

    BookLanguage getLanguage();

    Double getWeight();

    List<IImage> getPreviews();

    Integer getTotalOrders();

    Double getRating();

    Integer getTotalRates();

    Integer getRate5();

    Integer getRate4();

    Integer getRate3();

    Integer getRate2();

    Integer getRate1();
}
