package com.ring.bookstore.model.mappers;

import com.cloudinary.Cloudinary;
import com.cloudinary.Transformation;
import com.ring.bookstore.model.dto.response.images.IImage;
import com.ring.bookstore.model.dto.response.shops.*;
import com.ring.bookstore.model.entity.Address;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class ShopMapper {

    private final AddressMapper addressMapper;
    private final Cloudinary cloudinary;

    public ShopDisplayDTO displayToDTO(IShopDisplay shop) {
        IImage image = shop.getImage();
        String url = image != null ?
                cloudinary.url().transformation(new Transformation()
                                .aspectRatio("1.0")
                                .width(55)
                                .crop("thumb")
                                .chain()
                                .radius("max")
                                .quality(50)
                                .fetchFormat("auto"))
                        .secure(true).generate(image.getPublicId())
                : null;

        return new ShopDisplayDTO(shop.getOwnerId(),
                shop.getId(),
                shop.getName(),
                url,
                shop.getJoinedDate(),
                shop.getTotalReviews(),
                shop.getTotalProducts(),
                shop.getTotalFollowers(),
                shop.getFollowed());
    }

    public ShopDTO shopToDTO(IShop shop) {
        IImage image = shop.getImage();
        String url = image != null ?
                cloudinary.url().transformation(new Transformation()
                                .aspectRatio("1.0")
                                .width(55)
                                .crop("thumb")
                                .chain()
                                .radius("max")
                                .quality(50)
                                .fetchFormat("auto"))
                        .secure(true).generate(image.getPublicId())
                : null;

        return new ShopDTO(shop.getUsername(),
                shop.getOwnerId(),
                shop.getId(),
                shop.getName(),
                url,
                shop.getSales(),
                shop.getTotalSold(),
                shop.getTotalFollowers(),
                shop.getJoinedDate());
    }

    public ShopPreviewDTO previewToDTO(IShopPreview shop) {
        IImage image = shop.getImage();
        String url = image != null ?
                cloudinary.url().transformation(new Transformation()
                                .aspectRatio("1.0")
                                .width(20)
                                .crop("thumb")
                                .chain()
                                .radius("max")
                                .quality(20)
                                .fetchFormat("auto"))
                        .secure(true).generate(image.getPublicId())
                : null;

        return new ShopPreviewDTO(shop.getId(),
                shop.getName(),
                url);
    }

    public ShopInfoDTO infoToDTO(IShopInfo shop) {
        IImage image = shop.getImage();
        String url = image != null ?
                cloudinary.url().transformation(new Transformation()
                                .aspectRatio("1.0")
                                .width(75)
                                .crop("thumb")
                                .chain()
                                .radius("max")
                                .quality("auto")
                                .fetchFormat("auto"))
                        .secure(true).generate(image.getPublicId())
                : null;

        return new ShopInfoDTO(shop.getUsername(),
                shop.getOwnerId(),
                shop.getId(),
                shop.getName(),
                url,
                shop.getJoinedDate(),
                shop.getTotalReviews(),
                shop.getTotalProducts(),
                shop.getTotalFollowers(),
                shop.getFollowed());
    }

    public ShopDisplayDetailDTO displayDetailToDTO(IShopDisplayDetail shop) {
        IImage image = shop.getImage();
        Address address = shop.getAddress();
        String url = image != null ?
                cloudinary.url().transformation(new Transformation()
                                .aspectRatio("1.0")
                                .width(75)
                                .crop("thumb")
                                .chain()
                                .radius("max")
                                .quality("auto")
                                .fetchFormat("auto"))
                        .secure(true).generate(image.getPublicId())
                : null;

        return new ShopDisplayDetailDTO(shop.getUsername(),
                shop.getOwnerId(),
                shop.getId(),
                shop.getName(),
                shop.getDescription(),
                url,
                address != null ? addressMapper.addressToDTO(address) : null,
                shop.getTotalSold(),
                shop.getCanceledRate(),
                shop.getTotalProducts(),
                shop.getRating(),
                shop.getTotalReviews(),
                shop.getTotalFollowers(),
                shop.getJoinedDate(),
                shop.getFollowed());
    }

    public ShopDetailDTO detailToDTO(IShopDetail shop) {
        IImage image = shop.getImage();
        Address address = shop.getAddress();
        String url = image != null ?
                cloudinary.url().transformation(new Transformation()
                                .aspectRatio("1.0")
                                .width(75)
                                .crop("thumb")
                                .chain()
                                .radius("max")
                                .quality("auto")
                                .fetchFormat("auto"))
                        .secure(true).generate(image.getPublicId())
                : null;

        return new ShopDetailDTO(shop.getUsername(),
                shop.getOwnerId(),
                shop.getId(),
                shop.getName(),
                shop.getDescription(),
                url,
                address != null ? addressMapper.addressToDTO(address) : null,
                shop.getSales(),
                shop.getTotalSold(),
                shop.getTotalProducts(),
                shop.getTotalReviews(),
                shop.getTotalFollowers(),
                shop.getJoinedDate());
    }
}
