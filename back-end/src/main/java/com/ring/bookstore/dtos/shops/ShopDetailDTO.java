package com.ring.bookstore.dtos.shops;

import com.ring.bookstore.dtos.accounts.AddressDTO;

import java.time.LocalDateTime;

//Shop
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
