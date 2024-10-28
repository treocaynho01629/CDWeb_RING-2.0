package com.ring.bookstore.service;

import java.io.IOException;
import java.util.List;

import com.ring.bookstore.dtos.books.BookResponseDTO;
import com.ring.bookstore.exception.ImageResizerException;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import com.ring.bookstore.dtos.books.BookDTO;
import com.ring.bookstore.dtos.books.BookDetailDTO;
import com.ring.bookstore.model.Account;
import com.ring.bookstore.request.BookRequest;

public interface BookService {

    List<BookDTO> getRandomBooks(Integer amount);

    Page<BookDTO> getBooks(Integer pageNo, Integer pageSize, String sortBy, String sortDir, String keyword, Integer amount, Integer rating,
                           Integer cateId, List<Integer> pubIds, Long shopId, Long sellerId, List<String> types, Double fromRange, Double toRange);

    BookDetailDTO getBookDetail(Long id, String slug);

    BookResponseDTO addBook(BookRequest request, MultipartFile file, Account seller) throws IOException, ImageResizerException;

    BookResponseDTO updateBook(Long id, BookRequest request, MultipartFile file, Account seller) throws IOException, ImageResizerException;

    BookResponseDTO deleteBook(Long id, Account seller);

    void deleteBooks(List<Long> ids, Account seller);

    void deleteAllBooks(Account seller);
}
