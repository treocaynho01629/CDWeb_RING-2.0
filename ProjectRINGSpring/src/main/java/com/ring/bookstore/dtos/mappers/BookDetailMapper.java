package com.ring.bookstore.dtos.mappers;

import java.util.function.Function;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.ring.bookstore.dtos.BookDetailDTO;
import com.ring.bookstore.model.Book;
import com.ring.bookstore.model.BookDetail;
import com.ring.bookstore.model.Category;
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
    	          .path(book.getImages().getName())
    	          .toUriString();
    	
    	Category cate = book.getCate();
    	BookDetail detail = book.getBookDetail();
    	
        return new BookDetailDTO(book.getId(),
        		fileDownloadUri,
        		book.getPrice(),
        		book.getTitle(),
        		book.getDescription(),
        		book.getType(),
        		book.getAuthor(),
        		book.getUser().getUsername(),
        		book.getPublisher(),
        		cate.getId(),
        		cate.getCategoryName(),
        		detail.getSize(),
        		detail.getPages(),
        		detail.getBDate(),
        		detail.getBLanguage(),
        		detail.getBWeight(),
        		book.getAmount(),
        		reviewRepo.findTotalRatingByBookId(book.getId()),
        		book.getBookReviews().size());
    }
}
