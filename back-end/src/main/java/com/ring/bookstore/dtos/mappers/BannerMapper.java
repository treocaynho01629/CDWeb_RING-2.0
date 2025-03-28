package com.ring.bookstore.dtos.mappers;

import com.ring.bookstore.dtos.banners.BannerDTO;
import com.ring.bookstore.dtos.banners.IBanner;
import com.ring.bookstore.dtos.images.IImage;
import com.ring.bookstore.dtos.images.ImageDTO;
import com.ring.bookstore.ultils.FileUploadUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.function.Function;

@RequiredArgsConstructor
@Service
public class BannerMapper implements Function<IBanner, BannerDTO> {
    private final FileUploadUtil fileUploadUtil;

    @Override
    public BannerDTO apply(IBanner banner) {
        IImage image = banner.getImage();
        //Generate url
        Map<String, String> srcSet = fileUploadUtil.generateUrl(image.getPublicId());
        return new BannerDTO(banner.getId(),
                banner.getShopId(),
                banner.getName(),
                banner.getDescription(),
                new ImageDTO(image.getUrl(), srcSet),
                banner.getUrl());
    }
}
