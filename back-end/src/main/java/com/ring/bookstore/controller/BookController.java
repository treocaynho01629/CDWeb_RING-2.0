package com.ring.bookstore.controller;

import java.io.IOException;
import java.util.List;

import com.ring.bookstore.exception.ImageResizerException;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.ring.bookstore.config.CurrentAccount;
import com.ring.bookstore.dtos.books.BookDTO;
import com.ring.bookstore.model.Account;
import com.ring.bookstore.repository.AccountRepository;
import com.ring.bookstore.request.BookRequest;
import com.ring.bookstore.service.BookService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/books")
@RequiredArgsConstructor
@Validated
public class BookController {

    private final BookService bookService;

    //Get random books
    @GetMapping("/random")
    public ResponseEntity<?> getRandomBooks(@RequestParam(value = "amount", defaultValue = "5") Integer amount) {
        List<BookDTO> books = bookService.getRandomBooks(amount);
        return new ResponseEntity<>(books, HttpStatus.OK);
    }

    //Get books by ids
    @GetMapping("/find")
    public ResponseEntity<?> getBooksByIds(@RequestParam(value = "ids") List<Long> ids) {
        List<BookDTO> books = bookService.getBooksByIds(ids);
        return new ResponseEntity<>(books, HttpStatus.OK);
    }

    //Get books with filtering
    @GetMapping()
    public ResponseEntity<?> getBooks(@RequestParam(value = "pSize", defaultValue = "15") Integer pageSize,
                                      @RequestParam(value = "pageNo", defaultValue = "0") Integer pageNo,
                                      @RequestParam(value = "sortBy", defaultValue = "id") String sortBy,
                                      @RequestParam(value = "sortDir", defaultValue = "asc") String sortDir,
                                      @RequestParam(value = "keyword", defaultValue = "") String keyword,
                                      @RequestParam(value = "cateId", required = false) Integer cateId,
                                      @RequestParam(value = "pubIds", required = false) List<Integer> pubIds,
                                      @RequestParam(value = "shopId", required = false) Long shopId,
                                      @RequestParam(value = "types", required = false) List<String> types,
                                      @RequestParam(value = "fromRange", defaultValue = "0") Double fromRange,
                                      @RequestParam(value = "toRange", defaultValue = "100000000") Double toRange,
                                      @RequestParam(value = "rating", defaultValue = "0") Integer rating,
                                      @RequestParam(value = "amount", defaultValue = "1") Integer amount) {
        Page<BookDTO> books = bookService.getBooks(pageNo, pageSize, sortBy, sortDir, keyword,
                rating, amount, cateId, pubIds, shopId, types, fromRange, toRange);
        return new ResponseEntity<>(books, HttpStatus.OK);
    }

    //Get book details by {id}
    @GetMapping("/{id}")
    public ResponseEntity<?> getBookDetailById(@PathVariable("id") Long bookId) {
        return new ResponseEntity<>(bookService.getBookDetail(bookId, null), HttpStatus.OK);
    }

    //Get book details by {id}
    @GetMapping("/slug/{slug}")
    public ResponseEntity<?> getBookDetailBySlug(@PathVariable("slug") String slug) {
        return new ResponseEntity<>(bookService.getBookDetail(null, slug), HttpStatus.OK);
    }

    //Add new book
    @PostMapping(consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    @PreAuthorize("hasAnyRole('ADMIN','SELLER')")
    public ResponseEntity<?> addBook(@Valid @RequestPart("request") BookRequest request,
                                     @RequestPart("image") MultipartFile file,
                                     @CurrentAccount Account currUser) throws ImageResizerException, IOException {
        return new ResponseEntity<>(bookService.addBook(request, file, currUser), HttpStatus.CREATED);
    }

    //Update book by id
    @PutMapping(value = "/{id}", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    @PreAuthorize("hasAnyRole('ADMIN','SELLER')")
    public ResponseEntity<?> updateBook(@PathVariable("id") Long id,
                                        @Valid @RequestPart("request") BookRequest request,
                                        @RequestPart(name = "image", required = false) MultipartFile file,
                                        @CurrentAccount Account currUser) throws ImageResizerException, IOException {
        return new ResponseEntity<>(bookService.updateBook(id, request, file, currUser), HttpStatus.CREATED);
    }

    //Delete book by {id}
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SELLER')")
    public ResponseEntity<?> deleteBook(@PathVariable("id") Long id,
                                        @CurrentAccount Account currUser) {
        return new ResponseEntity<>(bookService.deleteBook(id, currUser), HttpStatus.OK);
    }

    //Delete multiple books by lists of {ids}
    @DeleteMapping("/delete-multiples")
    @PreAuthorize("hasAnyRole('ADMIN','SELLER')")
    public ResponseEntity<?> deleteBooks(@RequestParam("ids") List<Long> ids,
                                         @CurrentAccount Account currUser) {
        bookService.deleteBooks(ids, currUser);
        return new ResponseEntity<>("Products delete successfully!", HttpStatus.OK);
    }

    //Delete all books
    @DeleteMapping("/delete-all")
    @PreAuthorize("hasAnyRole('ADMIN','SELLER')")
    public ResponseEntity<?> deleteAllBooks(@CurrentAccount Account currUser) {
        bookService.deleteAllBooks(currUser);
        return new ResponseEntity<>("All products deleted successfully!", HttpStatus.OK);
    }
}
