package com.ring.bookstore.dtos.shops;

import com.ring.bookstore.dtos.images.ImageDTO;

public record ShopPreviewDTO(Long id,
                             String name,
                             String image) {
}
