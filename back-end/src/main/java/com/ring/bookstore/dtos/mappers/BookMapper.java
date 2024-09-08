package com.ring.bookstore.dtos.mappers;

import com.ring.bookstore.dtos.BookDetailDTO;
import com.ring.bookstore.dtos.BookResponseDTO;
import com.ring.bookstore.dtos.projections.IBookDetail;
import com.ring.bookstore.model.Book;
import com.ring.bookstore.model.BookDetail;
import com.ring.bookstore.model.Image;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.ring.bookstore.dtos.BookDTO;
import com.ring.bookstore.dtos.projections.IBookDisplay;

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
		Integer orderTime = book.getOrderTime();

        return new BookDTO(book.getId(),
				book.getTitle(),
        		book.getDescription(),
        		fileDownloadUri,
        		book.getPrice(),
				book.getOnSale(),
				book.getAmount(),
				rating != null ? rating : 0,
				orderTime != null ? orderTime : 0);
    }

	public BookDetailDTO detailToDetailDTO(IBookDetail bookWithDetail) {
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

	public BookResponseDTO bookToResponseDTO(Book book) {

		BookDetail detail = book.getBookDetail();

		return new BookResponseDTO(book.getId(),
				book.getPrice(),
				book.getOnSale(),
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
