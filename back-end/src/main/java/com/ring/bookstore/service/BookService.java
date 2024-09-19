package com.ring.bookstore.service;

import java.io.IOException;
import java.util.List;

import com.ring.bookstore.dtos.BookResponseDTO;
import com.ring.bookstore.exception.ImageResizerException;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import com.ring.bookstore.dtos.BookDTO;
import com.ring.bookstore.dtos.BookDetailDTO;
import com.ring.bookstore.model.Account;
import com.ring.bookstore.request.BookRequest;

public interface BookService {

    List<BookDTO> getRandomBooks(Integer amount);

    Page<BookDTO> getBooks(Integer pageNo, Integer pageSize, String sortBy, String sortDir, String keyword, Integer amount, Integer rating,
                           Integer cateId, List<Integer> pubId, String seller, String type, Double fromRange, Double toRange);

    BookDetailDTO getBookDetailById(Long id);

    BookResponseDTO addBook(BookRequest request, MultipartFile file, Account seller) throws IOException, ImageResizerException;

    BookResponseDTO updateBook(BookRequest request, MultipartFile file, Long id, Account seller) throws IOException, ImageResizerException;

    BookResponseDTO deleteBook(Long id, Account seller);

    void deleteBooks(List<Long> ids, Account seller);

    void deleteAllBooks(Account seller);
}
