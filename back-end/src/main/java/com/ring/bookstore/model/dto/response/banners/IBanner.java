package com.ring.bookstore.model.dto.response.banners;

import com.ring.bookstore.model.dto.response.images.IImage;

public interface IBanner {
    Integer getId();

    Long getShopId();

    String getName();

    String getDescription();

    String getUrl();

    IImage getImage();
}
