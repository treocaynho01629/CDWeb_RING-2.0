package com.ring.bookstore.model.dto.response.shops;

import com.ring.bookstore.model.dto.response.accounts.AddressDTO;
import com.ring.bookstore.model.dto.response.reviews.ReviewsInfoDTO;

import java.time.LocalDateTime;

/**
 * Represents a shop detail response as {@link ShopDetailDTO}.
 */
public record ShopDetailDTO(String username,
                            Long ownerId,
                            Long id,
                            String name,
                            String description,
                            String image,
                            AddressDTO address,
                            Double sales,
                            Integer totalSold,
                            Integer totalProducts,
                            Integer totalReviews,
                            Integer totalFollowers,
                            LocalDateTime joinedDate) {

}
