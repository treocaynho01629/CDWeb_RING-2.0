package com.ring.bookstore.dtos.banners;

import com.ring.bookstore.dtos.images.ImageDTO;

public record BannerDTO(Integer id,
                        Long shopId,
                        String name,
                        String description,
                        ImageDTO image,
                        String url) {

}
