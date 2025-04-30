package com.ring.bookstore.model.dto.projection.shops;

import com.ring.bookstore.model.dto.projection.images.IImage;

import java.time.LocalDateTime;

/**
 * Represents a detailed shop information projection as {@link IShopInfo}, containing owner's ID,
 * owner's username, total reviews, products, followers,
 * join date, followed status, and shop image.
 */
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
