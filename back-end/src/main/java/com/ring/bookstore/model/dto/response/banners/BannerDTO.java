package com.ring.bookstore.model.dto.response.banners;

import com.ring.bookstore.model.dto.response.images.ImageDTO;
import lombok.Builder;

/**
 * Represents a banner response as {@link BannerDTO}.
 */
@Builder
public record BannerDTO(Integer id,
                        Long shopId,
                        String name,
                        String description,
                        ImageDTO image,
                        String url) {

}
