package com.ring.bookstore.dtos.mappers;

import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;

import com.ring.bookstore.dtos.projections.IBookDetail;
import com.ring.bookstore.model.*;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.ring.bookstore.dtos.BookDetailDTO;

@Service
public class BookDetailMapper implements Function<IBookDetail, BookDetailDTO> {

    @Override
    public BookDetailDTO apply(IBookDetail bookWithDetail) {
		Book book = bookWithDetail.getBook();
		Double rating = bookWithDetail.getRating();
		Integer rateTime = bookWithDetail.getRateTime();
		Integer orderTime = bookWithDetail.getOrderTime();

		String fileDownloadUri = ServletUriComponentsBuilder
					  .fromCurrentContextPath()
					  .path("/api/images/")
					  .path(bookWithDetail.getImage())
					  .toUriString();

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
				fileDownloadUri,
				images,
        		book.getPrice(),
				book.getOnSale(),
        		book.getTitle(),
        		book.getDescription(),
        		book.getType(),
        		book.getAuthor(),
        		book.getSeller().getUsername(),
        		book.getPublisher(),
				book.getCate(),
				detail.getSize(),
				detail.getPages(),
				detail.getBDate(),
				detail.getBLanguage(),
				detail.getBWeight(),
        		book.getAmount(),
				rating != null ? rating : 0.0,
				rateTime != null ? rateTime : 0,
				orderTime != null ? orderTime : 0);
    }
}
