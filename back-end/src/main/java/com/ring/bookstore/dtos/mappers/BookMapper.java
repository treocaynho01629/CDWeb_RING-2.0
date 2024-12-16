package com.ring.bookstore.dtos.mappers;

import com.ring.bookstore.dtos.books.BookDetailDTO;
import com.ring.bookstore.dtos.books.BookResponseDTO;
import com.ring.bookstore.dtos.categories.CategoryDTO;
import com.ring.bookstore.dtos.books.IBookDetail;
import com.ring.bookstore.dtos.publishers.PublisherDTO;
import com.ring.bookstore.dtos.reviews.ReviewsInfoDTO;
import com.ring.bookstore.model.Book;
import com.ring.bookstore.model.BookDetail;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.ring.bookstore.dtos.books.BookDTO;
import com.ring.bookstore.dtos.books.IBookDisplay;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class BookMapper {

    private final CategoryMapper cateMapper;

    public BookDTO displayToBookDTO(IBookDisplay book) {

        String fileDownloadUri = book.getImage() != null ?
                ServletUriComponentsBuilder
                        .fromCurrentContextPath()
                        .path("/api/images/")
                        .path(book.getImage())
                        .toUriString()
                : null;

        Double rating = book.getRating();
        Integer totalOrders = book.getTotalOrders();

        return new BookDTO(book.getId(),
                book.getSlug(),
                book.getTitle(),
                fileDownloadUri,
                book.getDescription(),
                book.getPrice(),
                book.getDiscount(),
                book.getAmount(),
                book.getShopId(),
                book.getShopName(),
                rating,
                totalOrders);
    }

    public BookDetailDTO detailToDetailDTO(IBookDetail projection) {
        //Info
        Integer totalOrders = projection.getTotalOrders();
        Double rating = projection.getRating();
        Integer totalRates = projection.getTotalRates();
        List<Integer> rates = new ArrayList<>();
        rates.add(projection.getRate1());
        rates.add(projection.getRate2());
        rates.add(projection.getRate3());
        rates.add(projection.getRate4());
        rates.add(projection.getRate5());

        //Main thumbnail
        String fileDownloadUri = projection.getImage() != null ?
                ServletUriComponentsBuilder
                        .fromCurrentContextPath()
                        .path("/api/images/")
                        .path(projection.getImage())
                        .toUriString()
                : null;

        //Other preview images
        List<String> previews = projection.getPreviews();
        List<String> images = previews != null ? previews
                .stream()
                .map(image -> ServletUriComponentsBuilder
                        .fromCurrentContextPath()
                        .path("/api/images/")
                        .path(image)
                        .toUriString())
                .collect(Collectors.toList())
                : null;

        //Category
        CategoryDTO cate = new CategoryDTO(
                projection.getCateId(),
                projection.getCateSlug(),
                projection.getCateName(),
                projection.getParentId(),
                projection.getParentId() != null
                ? new CategoryDTO(projection.getParentId(),
                        projection.getParentSlug(),
                        projection.getParentName(),
                        projection.getAncestorId())
                : null
        );

        //Publisher
        PublisherDTO pub = new PublisherDTO(
                projection.getPubId(),
                projection.getPubName()
        );

        return new BookDetailDTO(projection.getId(),
                projection.getSlug(),
                fileDownloadUri,
                images,
                projection.getPrice(),
                projection.getDiscount(),
                projection.getTitle(),
                projection.getDescription(),
                projection.getType(),
                projection.getAuthor(),
                projection.getAmount(),
                projection.getShopId(),
                projection.getShopName(),
                pub,
                cate,
                projection.getSize(),
                projection.getPages(),
                projection.getDate(),
                projection.getLanguage(),
                projection.getWeight(),
                totalOrders,
                new ReviewsInfoDTO(rating, totalRates, rates)
        );
    }

    public BookResponseDTO bookToResponseDTO(Book book) {

        BookDetail detail = book.getDetail();

        return new BookResponseDTO(book.getId(),
                book.getSlug(),
                book.getPrice(),
                book.getDiscount(),
                book.getTitle(),
                book.getDescription(),
                book.getType(),
                book.getAuthor(),
                detail.getSize(),
                detail.getPages(),
                detail.getBDate(),
                detail.getBLanguage(),
                detail.getBWeight(),
                book.getAmount());
    }
}
