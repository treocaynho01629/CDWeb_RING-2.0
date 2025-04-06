package com.ring.bookstore.model.dto.projection.banners;

import com.ring.bookstore.model.dto.projection.images.IImage;

/**
 * Represents a banner projection as {@link IBanner}, containing banner's ID,
 * shop ID, name, description, URL, and associated image.
 */
public interface IBanner {

    Integer getId();

    Long getShopId();

    String getName();

    String getDescription();

    String getUrl();

    IImage getImage();
}
