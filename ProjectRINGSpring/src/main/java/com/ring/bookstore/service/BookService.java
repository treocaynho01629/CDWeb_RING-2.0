package com.ring.bookstore.service;

import java.util.List;

import org.springframework.data.domain.Page;

import com.ring.bookstore.dtos.BookDTO;
import com.ring.bookstore.model.Book;

public interface BookService {

	Book saveBook(Book Book);
	List<BookDTO> getAllBooks();
	Page<BookDTO> getAllBooks(int pageNo, int pageSize);
	Page<BookDTO> getBooksByFilter(int pageNo, int pageSize, String keyword, long cateId, long pubId, String type, Double fromRange, Double toRange);
	Book getBookById(long id);
	Book updateBook(Book Book, long id);
	void deleteBook(long id);
}
