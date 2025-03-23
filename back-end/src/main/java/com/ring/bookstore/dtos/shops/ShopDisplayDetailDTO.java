package com.ring.bookstore.dtos.shops;

import com.ring.bookstore.dtos.accounts.AddressDTO;
import com.ring.bookstore.dtos.images.ImageDTO;

import java.math.BigDecimal;
import java.time.LocalDateTime;

//Shop
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
