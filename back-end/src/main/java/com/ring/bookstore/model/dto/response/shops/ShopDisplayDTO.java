package com.ring.bookstore.model.dto.response.shops;

import java.time.LocalDateTime;

/**
 * Represents a shop slim response as {@link ShopDisplayDTO}.
 */
public record ShopDisplayDTO(Long ownerId,
                             Long id,
                             String name,
                             String image,
                             LocalDateTime joinedDate,
                             Integer totalReviews,
                             Integer totalProducts,
                             Integer totalFollowers,
                             Boolean followed) {

}
