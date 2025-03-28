package com.ring.bookstore.dtos.shops;

import com.ring.bookstore.dtos.images.IImage;

public interface IShopPreview {
    Long getId();

    String getName();

    IImage getImage();
}
