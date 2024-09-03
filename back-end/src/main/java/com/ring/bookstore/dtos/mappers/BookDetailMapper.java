package com.ring.bookstore.dtos.mappers;

import java.util.ArrayList;
import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;

import com.ring.bookstore.dtos.IBookDetail;
import com.ring.bookstore.model.*;
import jakarta.persistence.criteria.Order;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.ring.bookstore.dtos.BookDetailDTO;
import com.ring.bookstore.repository.ReviewRepository;

@Service
public class BookDetailMapper implements Function<Book, BookDetailDTO> {
	
	@Autowired
	private ReviewRepository reviewRepo;
	
    @Override
    public BookDetailDTO apply(Book book) {

		String fileDownloadUri = ServletUriComponentsBuilder
					  .fromCurrentContextPath()
					  .path("/api/images/")
					  .path(book.getImage().getName())
					  .toUriString();

		BookDetail detail = book.getBookDetail();
		List<Image> previewImages = detail.getPreviewImages();
		List<Review> reviews = book.getBookReviews();
		List<OrderDetail> orders = book.getOrderDetails();
		List<String> images = previewImages
					.stream()
					.map(image -> ServletUriComponentsBuilder
							.fromCurrentContextPath()
							.path("/api/images/")
							.path(image.getName())
							.toUriString())
					.collect(Collectors.toList());
		Double rating = reviews
					.stream()
					.mapToDouble(r -> r.getRating())
					.average()
					.orElse(0.0);
		Integer orderTime = orders
				.stream()
				.mapToInt(s -> s.getAmount())
				.sum();

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
				rating,
        		book.getBookReviews().size(),
				orderTime);
    }
}
