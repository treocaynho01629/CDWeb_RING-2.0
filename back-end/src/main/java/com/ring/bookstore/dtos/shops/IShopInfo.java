package com.ring.bookstore.dtos.shops;

import java.time.LocalDateTime;

public interface IShopInfo {
    String getUsername();

    Long getOwnerId();

    Long getId();

    String getName();

    String getDescription();

    String getImage();

    Integer getTotalReviews();

    Integer getTotalProducts();

    Integer getTotalFollowers();

    LocalDateTime getJoinedDate();

    Boolean getFollowed();
}
