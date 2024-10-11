package com.ring.bookstore.dtos.mappers;

import com.ring.bookstore.dtos.BannerDTO;
import com.ring.bookstore.dtos.projections.IBanner;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.function.Function;

@Service
public class BannerMapper implements Function<IBanner, BannerDTO> {

    @Override
    public BannerDTO apply(IBanner banner) {
        String fileDownloadUri = ServletUriComponentsBuilder
                .fromCurrentContextPath()
                .path("/api/images/")
                .path(banner.getImage())
                .toUriString();

        return new BannerDTO(banner.getId(),
                banner.getShopId(),
                banner.getName(),
                banner.getDescription(),
                fileDownloadUri,
                banner.getUrl());
    }
}
