package com.ring.bookstore.service;

import java.util.List;

import com.ring.bookstore.model.dto.response.books.BookDTO;
import com.ring.bookstore.model.dto.response.books.BookResponseDTO;
import com.ring.bookstore.model.dto.response.dashboard.StatDTO;
import com.ring.bookstore.model.enums.BookType;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import com.ring.bookstore.model.dto.response.books.BookDisplayDTO;
import com.ring.bookstore.model.dto.response.books.BookDetailDTO;
import com.ring.bookstore.model.entity.Account;
import com.ring.bookstore.model.dto.request.BookRequest;

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
                    Account user);

    BookResponseDTO updateBook(Long id,
                       BookRequest request,
                       MultipartFile thumbnail,
                       MultipartFile[] images,
                       Account user);

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
