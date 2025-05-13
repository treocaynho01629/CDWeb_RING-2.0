package com.ring.dto.projection.books;

import com.ring.model.enums.BookLanguage;
import com.ring.model.enums.BookType;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * Represents a book projection as {@link IBook}, containing the book's ID,
 * slug, price, discount, title, description, type, author, amount, image, publisher details, category details, shop details, and more.
 */
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

    BookLanguage getLanguage();

    Double getWeight();

    List<Long> getPreviews();
}
