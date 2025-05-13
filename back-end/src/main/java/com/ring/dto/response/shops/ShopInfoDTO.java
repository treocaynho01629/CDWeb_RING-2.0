package com.ring.dto.response.shops;

import java.time.LocalDateTime;

/**
 * Represents a shop info response as {@link ShopInfoDTO}.
 */
public record ShopInfoDTO(String username,
                          Long ownerId,
                          Long id,
                          String name,
                          String image,
                          LocalDateTime joinedDate,
                          Integer totalReviews,
                          Integer totalProducts,
                          Integer totalFollowers,
                          Boolean followed) {

}
