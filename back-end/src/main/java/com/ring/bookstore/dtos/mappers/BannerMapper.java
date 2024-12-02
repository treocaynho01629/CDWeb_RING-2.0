package com.ring.bookstore.dtos.mappers;

import com.ring.bookstore.dtos.banners.BannerDTO;
import com.ring.bookstore.dtos.banners.IBanner;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.function.Function;

@Service
public class BannerMapper implements Function<IBanner, BannerDTO> {

    @Override
    public BannerDTO apply(IBanner banner) {
        String fileDownloadUri = banner.getImage() != null ?
                ServletUriComponentsBuilder
                        .fromCurrentContextPath()
                        .path("/api/images/")
                        .path(banner.getImage())
                        .toUriString()
                : null;

        return new BannerDTO(banner.getId(),
                banner.getShopId(),
                banner.getName(),
                banner.getDescription(),
                fileDownloadUri,
                banner.getUrl());
    }
}
