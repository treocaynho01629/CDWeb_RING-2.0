package com.ring.bookstore.dtos.shops;

import com.ring.bookstore.dtos.images.IImage;
import com.ring.bookstore.model.Address;

import java.time.LocalDateTime;

public interface IShopDetail {
    String getUsername();

    Long getOwnerId();

    Long getId();

    String getName();

    String getDescription();

    Address getAddress();

    Double getSales();

    Integer getTotalSold();

    Integer getTotalProducts();

    Integer getTotalReviews();

    Integer getTotalFollowers();

    LocalDateTime getJoinedDate();

    IImage getImage();
}
