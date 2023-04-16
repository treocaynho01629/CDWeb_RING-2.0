package com.ring.bookstore.service;

import java.util.List;

import org.springframework.data.domain.Page;

import com.ring.bookstore.model.Book;

public interface BookService {

	Book saveBook(Book Book);
	List<Book> getAllBooks();
	Page<Book> getBooksPaging(int pageNo, int pageSize);
	Book getBookById(long id);
	Book updateBook(Book Book, long id);
	void deleteBook(long id);
}
