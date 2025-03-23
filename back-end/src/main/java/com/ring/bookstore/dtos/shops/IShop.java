package com.ring.bookstore.dtos.shops;

import com.ring.bookstore.dtos.images.IImage;

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
