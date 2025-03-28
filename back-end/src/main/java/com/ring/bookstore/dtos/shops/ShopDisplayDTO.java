package com.ring.bookstore.dtos.shops;

import com.ring.bookstore.dtos.images.ImageDTO;

import java.time.LocalDateTime;

//Shop
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
