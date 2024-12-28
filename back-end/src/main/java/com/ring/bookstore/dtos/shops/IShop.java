package com.ring.bookstore.dtos.shops;

import java.time.LocalDateTime;

public interface IShop {
    String getUsername();

    Long getOwnerId();

    Long getId();

    String getName();

    String getImage();

    Double getSales();

    Integer getTotalSold();

    Integer getTotalFollowers();

    LocalDateTime getJoinedDate();
}
