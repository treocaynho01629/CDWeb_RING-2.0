package com.ring.bookstore.dtos.shops;

import java.time.LocalDateTime;

//Shop
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
