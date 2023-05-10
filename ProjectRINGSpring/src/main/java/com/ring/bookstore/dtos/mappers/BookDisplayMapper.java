package com.ring.bookstore.dtos.mappers;

import java.util.function.Function;

import org.springframework.stereotype.Service;

import com.ring.bookstore.dtos.BookDTO;
import com.ring.bookstore.dtos.IBookDisplay;

@Service
public class BookDisplayMapper implements Function<IBookDisplay, BookDTO> {
    @Override
    public BookDTO apply(IBookDisplay book) {
    	
        return new BookDTO(book.getId()
        		,book.getTitle()
        		,book.getDescription()
        		,book.getImage()
        		,book.getPrice()
        		,book.getRateTotal()
        		,book.getRateAmount());
    }
}
