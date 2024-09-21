package com.ring.bookstore.dtos.projections;

import java.time.LocalDateTime;

public interface IShopDetail {
    String getOwnerUsername();

    Long getOwnerId();

    String getName();

    String getDescription();

    String getImage();

    Integer getTotalReviews();

    Integer getTotalProducts();

    Integer getTotalFollowers();

    LocalDateTime getJoinedDate();
}
