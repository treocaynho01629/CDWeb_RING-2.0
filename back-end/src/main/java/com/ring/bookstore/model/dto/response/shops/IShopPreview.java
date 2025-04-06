package com.ring.bookstore.model.dto.response.shops;

import com.ring.bookstore.model.dto.response.images.IImage;

public interface IShopPreview {
    Long getId();

    String getName();

    IImage getImage();
}
