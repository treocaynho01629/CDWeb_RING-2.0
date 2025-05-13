package com.ring.dto.projection.images;

/**
 * Represents an image projection as {@link IImage}, containing the image's public ID and URL.
 */
public interface IImage {

    String getPublicId();

    String getUrl();
}
