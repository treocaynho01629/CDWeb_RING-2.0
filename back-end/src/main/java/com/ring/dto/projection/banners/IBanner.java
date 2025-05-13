package com.ring.dto.projection.banners;

import com.ring.dto.projection.images.IImage;

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
