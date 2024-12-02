package com.ring.bookstore.dtos.mappers;

import com.ring.bookstore.dtos.shops.ShopDTO;
import com.ring.bookstore.dtos.shops.IShopDetail;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.function.Function;

@Service
public class ShopMapper implements Function<IShopDetail, ShopDTO> {
	
    @Override
    public ShopDTO apply(IShopDetail shop) {
		String fileDownloadUri = shop.getImage() != null ?
				ServletUriComponentsBuilder
						.fromCurrentContextPath()
						.path("/api/images/")
						.path(shop.getImage())
						.toUriString()
				: null;

        return new ShopDTO(shop.getOwnerUsername()
				, shop.getOwnerId()
				, shop.getId()
        		, shop.getName()
        		, shop.getDescription()
        		, fileDownloadUri
        		, shop.getJoinedDate()
        		, shop.getTotalReviews()
                , shop.getTotalProducts()
        		, shop.getTotalFollowers()
				, shop.getFollowed());
    }
}
