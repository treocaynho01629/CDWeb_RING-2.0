package com.ring.bookstore.dtos.mappers;

import java.util.function.Function;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.ring.bookstore.dtos.BookDTO;
import com.ring.bookstore.model.Book;
import com.ring.bookstore.repository.ReviewRepository;

@Service
public class BookMapper implements Function<Book, BookDTO> {
	
	@Autowired
	private ReviewRepository reviewRepo;
	
    @Override
    public BookDTO apply(Book book) {

		String fileDownloadUri = ServletUriComponentsBuilder
					.fromCurrentContextPath()
					.path("/api/images/")
					.path(book.getImage().getName())
					.toUriString();

        return new BookDTO(book.getId()
        		,book.getTitle()
        		,book.getDescription()
        		,fileDownloadUri
        		,book.getPrice()
				,book.getAmount()
        		,reviewRepo.findTotalRatingByBookId(book.getId())
        		,book.getBookReviews().size()
				,1);
    }
}
