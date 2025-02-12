package com.ring.bookstore.dtos.mappers;

import com.ring.bookstore.dtos.accounts.IAddress;
import com.ring.bookstore.dtos.shops.*;
import com.ring.bookstore.model.Address;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@RequiredArgsConstructor
@Service
public class ShopMapper {

	private final AddressMapper addressMapper;

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

	public ShopPreviewDTO previewToDTO(IShopPreview shop) {
		String fileDownloadUri = shop.getImage() != null ?
				ServletUriComponentsBuilder
						.fromCurrentContextPath()
						.path("/api/images/")
						.path(shop.getImage())
						.toUriString()
				: null;

		return new ShopPreviewDTO(shop.getId(),
				shop.getName(),
				fileDownloadUri);
	}
	
    public ShopInfoDTO infoToDTO(IShopInfo shop) {
		String fileDownloadUri = shop.getImage() != null ?
				ServletUriComponentsBuilder
						.fromCurrentContextPath()
						.path("/api/images/")
						.path(shop.getImage())
						.toUriString()
				: null;

        return new ShopInfoDTO(shop.getUsername(),
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

	public ShopDetailDTO detailToDTO(IShopDetail shop) {
		String fileDownloadUri = shop.getImage() != null ?
				ServletUriComponentsBuilder
						.fromCurrentContextPath()
						.path("/api/images/")
						.path(shop.getImage())
						.toUriString()
				: null;

		Address address = shop.getAddress();

		return new ShopDetailDTO(shop.getUsername(),
				shop.getOwnerId(),
				shop.getId(),
				shop.getName(),
				shop.getDescription(),
				fileDownloadUri,
				address != null ? addressMapper.addressToDTO(address) : null,
				shop.getSales(),
				shop.getTotalSold(),
				shop.getTotalProducts(),
				shop.getTotalReviews(),
				shop.getTotalFollowers(),
				shop.getJoinedDate());
	}
}
