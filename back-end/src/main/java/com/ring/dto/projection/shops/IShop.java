package com.ring.dto.projection.shops;

import com.ring.dto.projection.images.IImage;

import java.time.LocalDateTime;

/**
 * Represents a shop projection as {@link IShop}, containing owner's username,
 * owner information, sales, total sold items, followers, join date, and image.
 */
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
