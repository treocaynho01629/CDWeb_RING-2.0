package com.ring.bookstore.service;

import java.io.IOException;
import java.util.List;

import com.ring.bookstore.dtos.books.BookDTO;
import com.ring.bookstore.dtos.books.BookResponseDTO;
import com.ring.bookstore.dtos.dashboard.StatDTO;
import com.ring.bookstore.enums.BookType;
import com.ring.bookstore.exception.ImageResizerException;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import com.ring.bookstore.dtos.books.BookDisplayDTO;
import com.ring.bookstore.dtos.books.BookDetailDTO;
import com.ring.bookstore.model.Account;
import com.ring.bookstore.request.BookRequest;

public interface BookService {

    List<BookDisplayDTO> getBooksInIds(List<Long> ids);

    Page<BookDisplayDTO> getBooks(Integer pageNo,
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

    BookDTO getBook(Long id);

    List<BookDisplayDTO> getRandomBooks(Integer amount,
                                        Boolean withDesc);

    BookDetailDTO getBookDetail(Long id);

    BookDetailDTO getBookDetail(String slug);

    List<String> getBooksSuggestion(String keyword);

    BookResponseDTO addBook(BookRequest request,
                    MultipartFile thumbnail,
                    MultipartFile[] images,
                    Account user) throws IOException, ImageResizerException;

    BookResponseDTO updateBook(Long id,
                       BookRequest request,
                       MultipartFile thumbnail,
                       MultipartFile[] images,
                       Account user) throws IOException, ImageResizerException;

    BookResponseDTO deleteBook(Long id,
                       Account user);

    StatDTO getAnalytics(Long shopId);

    void deleteBooks(List<Long> ids,
                     Account user);

    void deleteBooksInverse(String keyword,
                            Integer amount,
                            Integer rating,
                            Integer cateId,
                            List<Integer> pubIds,
                            List<BookType> types,
                            Long shopId,
                            Long userId,
                            Double fromRange,
                            Double toRange,
                            List<Long> ids,
                            Account user);

    void deleteAllBooks(Long shopId, Account user);
}
