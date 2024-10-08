package com.ring.bookstore.dtos.mappers;

import com.ring.bookstore.dtos.BookDetailDTO;
import com.ring.bookstore.dtos.BookResponseDTO;
import com.ring.bookstore.dtos.ReviewsInfoDTO;
import com.ring.bookstore.dtos.projections.IBookDetail;
import com.ring.bookstore.model.Book;
import com.ring.bookstore.model.BookDetail;
import com.ring.bookstore.model.Image;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.ring.bookstore.dtos.BookDTO;
import com.ring.bookstore.dtos.projections.IBookDisplay;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookMapper {

    public BookDTO displayToBookDTO(IBookDisplay book) {

        String fileDownloadUri = ServletUriComponentsBuilder
                .fromCurrentContextPath()
                .path("/api/images/")
                .path(book.getImage())
                .toUriString();

        Double rating = book.getRating();
        Integer totalOrders = book.getTotalOrders();

        return new BookDTO(book.getId(),
                book.getSlug(),
                book.getTitle(),
                book.getDescription(),
                fileDownloadUri,
                book.getPrice(),
                book.getDiscount(),
                book.getAmount(),
                book.getShopId(),
                book.getShopName(),
                rating != null ? rating : 0,
                totalOrders != null ? totalOrders : 0);
    }

    public BookDetailDTO detailToDetailDTO(IBookDetail bookWithDetail) {
        Book book = bookWithDetail.getBook();

        //Shop
        Long shopId = bookWithDetail.getShopId();
        String shopName = bookWithDetail.getShopName();

        //Info
        Integer totalOrders = bookWithDetail.getTotalOrders();
        Double rating = bookWithDetail.getRating();
        List<Integer> count = new ArrayList<>();
        count.add(0, bookWithDetail.getTotalRates());
        count.add(1, bookWithDetail.getOne());
        count.add(2, bookWithDetail.getTwo());
        count.add(3, bookWithDetail.getThree());
        count.add(4, bookWithDetail.getFour());
        count.add(5, bookWithDetail.getFive());

        //Main thumbnail
        String fileDownloadUri = ServletUriComponentsBuilder
                .fromCurrentContextPath()
                .path("/api/images/")
                .path(bookWithDetail.getImage())
                .toUriString();

        //Other preview images
        BookDetail detail = book.getBookDetail();
        List<Image> previewImages = detail.getPreviewImages();
        List<String> images = previewImages
                .stream()
                .map(image -> ServletUriComponentsBuilder
                        .fromCurrentContextPath()
                        .path("/api/images/")
                        .path(image.getName())
                        .toUriString())
                .collect(Collectors.toList());

        return new BookDetailDTO(book.getId(),
                book.getSlug(),
                fileDownloadUri,
                images,
                book.getPrice(),
                book.getDiscount(),
                book.getTitle(),
                book.getDescription(),
                book.getType(),
                book.getAuthor(),
                shopId,
                shopName,
                book.getPublisher(),
                book.getCate(),
                detail.getSize(),
                detail.getPages(),
                detail.getBDate(),
                detail.getBLanguage(),
                detail.getBWeight(),
                book.getAmount(),
                totalOrders != null ? totalOrders : 0,
                new ReviewsInfoDTO(rating != null ? rating : 0.0, count)
        );
    }

    public BookResponseDTO bookToResponseDTO(Book book) {

        BookDetail detail = book.getBookDetail();

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
