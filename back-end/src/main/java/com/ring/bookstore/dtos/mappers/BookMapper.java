package com.ring.bookstore.dtos.mappers;

import com.ring.bookstore.dtos.books.*;
import com.ring.bookstore.dtos.categories.CategoryDTO;
import com.ring.bookstore.dtos.images.IImage;
import com.ring.bookstore.dtos.images.IImageInfo;
import com.ring.bookstore.dtos.images.ImageDTO;
import com.ring.bookstore.dtos.images.ImageInfoDTO;
import com.ring.bookstore.dtos.publishers.PublisherDTO;
import com.ring.bookstore.dtos.reviews.ReviewsInfoDTO;
import com.ring.bookstore.model.Book;
import com.ring.bookstore.ultils.FileUploadUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class BookMapper {
    private final ImageMapper imageMapper;
    private final FileUploadUtil fileUploadUtil;

    public BookDisplayDTO displayToDTO(IBookDisplay book) {
        Double rating = book.getRating();
        Integer totalOrders = book.getTotalOrders();
        IImage image = book.getImage();

        //Generate url
        Map<String, String> srcSet = fileUploadUtil.generateUrl(image.getPublicId());
        return new BookDisplayDTO(book.getId(),
                book.getSlug(),
                book.getTitle(),
                new ImageDTO(image.getUrl(), srcSet),
                book.getDescription(),
                book.getPrice(),
                book.getDiscount(),
                book.getAmount(),
                book.getShopId(),
                book.getShopName(),
                rating,
                totalOrders);
    }

    public BookDetailDTO detailToDTO(IBookDetail book) {
        //Info
        Integer totalOrders = book.getTotalOrders();
        Double rating = book.getRating();
        Integer totalRates = book.getTotalRates();
        List<Integer> rates = new ArrayList<>();
        rates.add(book.getRate1());
        rates.add(book.getRate2());
        rates.add(book.getRate3());
        rates.add(book.getRate4());
        rates.add(book.getRate5());

        //Other preview images
        List<IImage> previews = book.getPreviews();
        List<ImageDTO> images = previews != null ? previews
                .stream()
                .map(image -> {
                    //Generate url
                    Map<String, String> srcSet = fileUploadUtil.generateUrl(image.getPublicId());
                    return new ImageDTO(image.getUrl(), srcSet);
                })
                .collect(Collectors.toList())
                : null;

        //Category
        CategoryDTO cate = new CategoryDTO(
                book.getCateId(),
                book.getCateSlug(),
                book.getCateName(),
                book.getParentId(),
                book.getParentId() != null
                ? new CategoryDTO(book.getParentId(),
                        book.getParentSlug(),
                        book.getParentName(),
                        book.getAncestorId())
                : null
        );

        //Publisher
        PublisherDTO pub = new PublisherDTO(
                book.getPubId(),
                book.getPubName()
        );

        //Generate url
        IImage image = book.getImage();
        Map<String, String> srcSet = fileUploadUtil.generateUrl(image.getPublicId());
        return new BookDetailDTO(book.getId(),
                book.getSlug(),
                new ImageDTO(image.getUrl(), srcSet),
                images,
                book.getPrice(),
                book.getDiscount(),
                book.getTitle(),
                book.getDescription(),
                book.getType(),
                book.getAuthor(),
                book.getAmount(),
                book.getShopId(),
                book.getShopName(),
                pub,
                cate,
                book.getSize(),
                book.getPages(),
                book.getDate(),
                book.getLanguage(),
                book.getWeight(),
                totalOrders,
                new ReviewsInfoDTO(rating, totalRates, rates)
        );
    }

    public BookResponseDTO bookToResponseDTO(Book book) {
        return new BookResponseDTO(book.getId(),
                book.getSlug(),
                book.getPrice(),
                book.getDiscount(),
                book.getTitle());
    }

    public BookDTO projectionToDTO(IBook book, List<IImageInfo> imagesList) {
        //Images
        Optional<ImageInfoDTO> thumbnail = imagesList.stream()
                                                .filter(item -> item.getId().equals(book.getImage()))
                                                .findFirst()
                                                .map(imageMapper::infoToDTO);
        List<ImageInfoDTO> previews = imagesList.stream()
                                                .filter(item -> !item.getId().equals(book.getImage()))
                                                .map(imageMapper::infoToDTO).toList();

        //Category
        CategoryDTO cate = new CategoryDTO(
                book.getCateId(),
                book.getCateName()
        );

        //Publisher
        PublisherDTO pub = new PublisherDTO(
                book.getPubId(),
                book.getPubName()
        );

        return new BookDTO(book.getId(),
                book.getSlug(),
                thumbnail.get(),
                previews,
                book.getPrice(),
                book.getDiscount(),
                book.getTitle(),
                book.getDescription(),
                book.getType(),
                book.getAuthor(),
                book.getSize(),
                book.getPages(),
                book.getDate(),
                book.getLanguage(),
                book.getWeight(),
                book.getAmount(),
                pub,
                cate,
                book.getShopId(),
                book.getShopName());
    }
}
