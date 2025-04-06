package com.ring.bookstore.model.dto.response.banners;

import com.ring.bookstore.model.dto.response.images.ImageDTO;

/**
 * Represents a banner response as {@link BannerDTO}.
 */
public record BannerDTO(Integer id,
                        Long shopId,
                        String name,
                        String description,
                        ImageDTO image,
                        String url) {

}
