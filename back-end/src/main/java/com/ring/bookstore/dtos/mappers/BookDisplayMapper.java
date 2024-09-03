package com.ring.bookstore.dtos.mappers;

import java.util.function.Function;

import org.springframework.stereotype.Service;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.ring.bookstore.dtos.BookDTO;
import com.ring.bookstore.dtos.IBookDisplay;

@Service
public class BookDisplayMapper implements Function<IBookDisplay, BookDTO> {
    @Override
    public BookDTO apply(IBookDisplay book) {
    	
    	String fileDownloadUri = ServletUriComponentsBuilder
  	          .fromCurrentContextPath()
  	          .path("/api/images/")
  	          .path(book.getImage())
  	          .toUriString();

		Double rating = book.getRating();
		Integer orderTime = book.getOrderTime();

        return new BookDTO(book.getId()
        		,book.getTitle()
        		,book.getDescription()
        		,fileDownloadUri
        		,book.getPrice()
				,book.getOnSale()
				,book.getAmount()
				,rating != null ? rating : 0
				,orderTime != null ? orderTime : 0);
    }
}
