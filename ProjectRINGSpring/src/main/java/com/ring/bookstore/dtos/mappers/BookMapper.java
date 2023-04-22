package com.ring.bookstore.dtos.mappers;

import java.util.function.Function;

import org.springframework.stereotype.Service;

import com.ring.bookstore.dtos.BookDTO;
import com.ring.bookstore.model.Book;

@Service
public class BookMapper implements Function<Book, BookDTO> {
    @Override
    public BookDTO apply(Book book) {
        return new BookDTO(book.getId()
        		,book.getTitle()
        		,book.getImage()
        		,book.getPrice()
        		,5.0);
    }
}
