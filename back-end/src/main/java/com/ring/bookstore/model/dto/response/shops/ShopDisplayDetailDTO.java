package com.ring.bookstore.model.dto.response.shops;

import com.ring.bookstore.model.dto.response.accounts.AddressDTO;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Represents a shop detail slim response as {@link ShopDisplayDetailDTO}.
 */
public record ShopDisplayDetailDTO(String username,
                                   Long ownerId,
                                   Long id,
                                   String name,
                                   String description,
                                   String image,
                                   AddressDTO address,
                                   Integer totalSold,
                                   BigDecimal canceledRate,
                                   Integer totalProducts,
                                   Double rating,
                                   Integer totalReviews,
                                   Integer totalFollowers,
                                   LocalDateTime joinedDate,
                                   Boolean followed) {

}
