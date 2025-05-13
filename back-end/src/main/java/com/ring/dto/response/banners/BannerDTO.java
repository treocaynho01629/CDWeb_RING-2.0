package com.ring.dto.response.banners;

import com.ring.dto.response.images.ImageDTO;
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
