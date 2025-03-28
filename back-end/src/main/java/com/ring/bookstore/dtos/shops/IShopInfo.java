package com.ring.bookstore.dtos.shops;

import com.ring.bookstore.dtos.images.IImage;

import java.time.LocalDateTime;

public interface IShopInfo {
    String getUsername();

    Long getOwnerId();

    Long getId();

    String getName();

    Integer getTotalReviews();

    Integer getTotalProducts();

    Integer getTotalFollowers();

    LocalDateTime getJoinedDate();

    Boolean getFollowed();

    IImage getImage();
}
