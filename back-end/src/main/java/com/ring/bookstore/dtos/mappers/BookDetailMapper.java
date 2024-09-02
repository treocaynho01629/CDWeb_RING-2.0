package com.ring.bookstore.dtos.mappers;

import java.util.ArrayList;
import java.util.List;
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
					  .path(book.getImage().getName())
					  .toUriString();

    	Category cate = book.getCate();
    	BookDetail detail = book.getBookDetail();
		List<String> images = new ArrayList<>();

		images.add(fileDownloadUri);

        return new BookDetailDTO(book.getId(),
				images,
        		book.getPrice(),
        		book.getTitle(),
        		book.getDescription(),
        		book.getType(),
        		book.getAuthor(),
        		book.getSeller().getUsername(),
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
        		book.getBookReviews().size(),
				99); //TEMP
    }
}
