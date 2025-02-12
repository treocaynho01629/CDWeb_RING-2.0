package com.ring.bookstore.dtos.shops;

import java.time.LocalDateTime;

//Shop
public record ShopInfoDTO(String username,
                          Long ownerId,
                          Long id,
                          String name,
                          String description,
                          String image,
                          LocalDateTime joinedDate,
                          Integer totalReviews,
                          Integer totalProducts,
                          Integer totalFollowers,
                          Boolean followed) {

}
