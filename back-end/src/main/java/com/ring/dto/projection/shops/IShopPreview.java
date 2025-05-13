package com.ring.dto.projection.shops;

import com.ring.dto.projection.images.IImage;

/**
 * Represents a shop preview projection as {@link IShopPreview}, containing shop's ID, name, and image.
 */
public interface IShopPreview {

    Long getId();

    String getName();

    IImage getImage();
}
