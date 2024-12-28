package com.ring.bookstore.dtos.shops;

import java.time.LocalDateTime;

public interface IShopDisplay {
    Long getOwnerId();

    Long getId();

    String getName();

    String getImage();

    Integer getTotalReviews();

    Integer getTotalProducts();

    Integer getTotalFollowers();

    LocalDateTime getJoinedDate();

    Boolean getFollowed();
}
