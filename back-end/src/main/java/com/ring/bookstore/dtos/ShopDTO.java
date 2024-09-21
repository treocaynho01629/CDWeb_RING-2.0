package com.ring.bookstore.dtos;

import java.time.LocalDate;

//Shop/Seller
public record SellerDTO(String username,
                        String name,
                        String image,
                        String gender,
                        Integer totalReviews,
                        Integer totalProducts,
                        Integer totalFollowers,
                        LocalDate joinedDate) {

}
