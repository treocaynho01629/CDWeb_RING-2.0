package com.ring.bookstore.service;

import java.io.IOException;
import java.util.List;

import com.ring.bookstore.dtos.books.BookResponseDTO;
import com.ring.bookstore.dtos.dashboard.StatDTO;
import com.ring.bookstore.enums.BookType;
import com.ring.bookstore.exception.ImageResizerException;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import com.ring.bookstore.dtos.books.BookDTO;
import com.ring.bookstore.dtos.books.BookDetailDTO;
import com.ring.bookstore.model.Account;
import com.ring.bookstore.request.BookRequest;

public interface BookService {

    List<BookDTO> getBooksInIds(List<Long> ids);

    Page<BookDTO> getBooks(Integer pageNo,
                           Integer pageSize,
                           String sortBy,
                           String sortDir,
                           String keyword,
                           Integer amount,
                           Integer rating,
                           Integer cateId,
                           List<Integer> pubIds,
                           List<BookType> types,
                           Long shopId,
                           Long userId,
                           Double fromRange,
                           Double toRange,
                           Boolean withDesc);

    List<BookDTO> getRandomBooks(Integer amount,
                                 Boolean withDesc);

    BookDetailDTO getBookDetail(Long id,
                                String slug);

    BookResponseDTO addBook(BookRequest request,
                            MultipartFile thumbnail,
                            MultipartFile[] images,
                            Account user) throws IOException, ImageResizerException;

    BookResponseDTO updateBook(Long id,
                               BookRequest request,
                               MultipartFile thumbnail,
                               MultipartFile[] images,
                               List<String> remove,
                               Account user) throws IOException, ImageResizerException;

    void replaceThumbnail(Long bookId,
                          String imageName,
                          Account user);

    BookResponseDTO deleteBook(Long id,
                               Account user);

    StatDTO getAnalytics(Long shopId);

    void deleteBooks(List<Long> ids,
                     Account user);

    void deleteAllBooks(Account user);
}
