package com.ring.bookstore.service;

import java.io.IOException;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import com.ring.bookstore.dtos.BookDTO;
import com.ring.bookstore.dtos.BookDetailDTO;
import com.ring.bookstore.model.Account;
import com.ring.bookstore.model.Book;
import com.ring.bookstore.request.BookRequest;

public interface BookService {

	Page<BookDTO> getAllBooks(Integer pageNo, Integer pageSize);
	List<BookDTO> getRandomBooks(Integer amount);
	Page<BookDTO> getBooksByFilter(Integer pageNo, Integer pageSize, String sortBy, String sortDir, String keyword, Integer cateId, Integer pubId, String type, Double fromRange, Double toRange);
	BookDetailDTO getBookById(Integer id);
	Book addBook(BookRequest request, MultipartFile file, Account seller) throws IOException;
	Book updateBook(BookRequest request, MultipartFile file, Integer id, Account seller) throws IOException;
	Book deleteBook(Integer id, Account seller);
}
