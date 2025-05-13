package com.ring.dto.response.shops;

import java.time.LocalDateTime;

/**
 * Represents a shop response as {@link ShopDTO}.
 */
public record ShopDTO(String username,
                      Long ownerId,
                      Long id,
                      String name,
                      String image,
                      Double sales,
                      Integer totalSold,
                      Integer totalFollowers,
                      LocalDateTime joinedDate) {

}
