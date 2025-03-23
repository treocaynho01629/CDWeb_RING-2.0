package com.ring.bookstore.dtos.banners;

import com.ring.bookstore.dtos.images.IImage;

public interface IBanner {
    Integer getId();

    Long getShopId();

    String getName();

    String getDescription();

    String getUrl();

    IImage getImage();
}
