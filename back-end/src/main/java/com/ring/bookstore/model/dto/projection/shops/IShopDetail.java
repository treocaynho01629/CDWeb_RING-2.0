package com.ring.bookstore.model.dto.projection.shops;

import com.ring.bookstore.model.dto.projection.images.IImage;
import com.ring.bookstore.model.entity.Address;

import java.time.LocalDateTime;

/**
 * Represents a detailed shop projection as {@link IShopDetail}, containing owner's username,
 * owner details, description, address, sales, total items sold,
 * product count, reviews, followers, join date, and image.
 */
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
