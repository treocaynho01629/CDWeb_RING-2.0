package com.ring.bookstore.dtos.banners;

public record BannerDTO(Integer id,
                        Long shopId,
                        String name,
                        String description,
                        String image,
                        String url) {

}
