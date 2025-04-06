package com.ring.bookstore.model.dto.response.shops;

import com.ring.bookstore.model.dto.response.images.IImage;

import java.time.LocalDateTime;

public interface IShopDisplay {
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
