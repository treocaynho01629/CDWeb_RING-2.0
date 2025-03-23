package com.ring.bookstore.dtos.shops;

import com.ring.bookstore.dtos.images.IImage;
import com.ring.bookstore.model.Address;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public interface IShopDisplayDetail {
    String getUsername();

    Long getOwnerId();

    Long getId();

    String getName();

    String getDescription();

    Address getAddress();

    Integer getTotalSold();

    BigDecimal getCanceledRate();

    Integer getTotalProducts();

    Double getRating();

    Integer getTotalReviews();

    Integer getTotalFollowers();

    LocalDateTime getJoinedDate();

    Boolean getFollowed();

    IImage getImage();
}
