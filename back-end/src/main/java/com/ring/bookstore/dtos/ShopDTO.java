package com.ring.bookstore.dtos;

import java.time.LocalDateTime;

//Shop
public record ShopDTO(String ownerUsername,
                      Long ownerId,
                      String name,
                      String description,
                      String image,
                      LocalDateTime joinedDate,
                      Integer totalReviews,
                      Integer totalProducts,
                      Integer totalFollowers) {

}
