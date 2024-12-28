package com.ring.bookstore.dtos.mappers;

import com.ring.bookstore.dtos.shops.*;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@Service
public class ShopMapper {

	public ShopDisplayDTO displayToDTO(IShopDisplay shop) {
		String fileDownloadUri = shop.getImage() != null ?
				ServletUriComponentsBuilder
						.fromCurrentContextPath()
						.path("/api/images/")
						.path(shop.getImage())
						.toUriString()
				: null;

		return new ShopDisplayDTO(shop.getOwnerId(),
				shop.getId(),
				shop.getName(),
				fileDownloadUri,
				shop.getJoinedDate(),
				shop.getTotalReviews(),
				shop.getTotalProducts(),
				shop.getTotalFollowers(),
				shop.getFollowed());
	}

	public ShopDTO shopToDTO(IShop shop) {
		String fileDownloadUri = shop.getImage() != null ?
				ServletUriComponentsBuilder
						.fromCurrentContextPath()
						.path("/api/images/")
						.path(shop.getImage())
						.toUriString()
				: null;

		return new ShopDTO(shop.getUsername(),
				shop.getOwnerId(),
				shop.getId(),
				shop.getName(),
				fileDownloadUri,
				shop.getSales(),
				shop.getTotalSold(),
				shop.getTotalFollowers(),
				shop.getJoinedDate());
	}
	
    public ShopDetailDTO detailToDTO(IShopDetail shop) {
		String fileDownloadUri = shop.getImage() != null ?
				ServletUriComponentsBuilder
						.fromCurrentContextPath()
						.path("/api/images/")
						.path(shop.getImage())
						.toUriString()
				: null;

        return new ShopDetailDTO(shop.getUsername(),
				shop.getOwnerId(),
				shop.getId(),
        		shop.getName(),
        		shop.getDescription(),
        		fileDownloadUri,
        		shop.getJoinedDate(),
        		shop.getTotalReviews(),
                shop.getTotalProducts(),
        		shop.getTotalFollowers(),
				shop.getFollowed());
    }
}
