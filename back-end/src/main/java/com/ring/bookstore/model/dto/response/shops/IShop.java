package com.ring.bookstore.model.dto.response.shops;

import com.ring.bookstore.model.dto.response.images.IImage;

import java.time.LocalDateTime;

public interface IShop {
    String getUsername();

    Long getOwnerId();

    Long getId();

    String getName();

    Double getSales();

    Integer getTotalSold();

    Integer getTotalFollowers();

    LocalDateTime getJoinedDate();

    IImage getImage();
}
