package com.ring.bookstore.model.dto.projection.shops;

import com.ring.bookstore.model.dto.projection.images.IImage;

import java.time.LocalDateTime;

/**
 * Represents a shop slim projection as {@link IShopDisplay}, containing shop's owner details,
 * name, total reviews, products, followers,
 * join date, followed status, and image.
 */
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
