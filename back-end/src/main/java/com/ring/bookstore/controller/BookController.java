package com.ring.bookstore.controller;

import java.io.IOException;
import java.util.List;

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
import com.ring.bookstore.dtos.BookDTO;
import com.ring.bookstore.model.Account;
import com.ring.bookstore.model.Book;
import com.ring.bookstore.repository.AccountRepository;
import com.ring.bookstore.request.BookRequest;
import com.ring.bookstore.service.BookService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@CrossOrigin("http://localhost:5173")
@RequestMapping("/api/books")
@RequiredArgsConstructor
@Validated
public class BookController {

    private final BookService bookService;
    private final AccountRepository accRepo;


    //Get random books
    @GetMapping("/random")
    public ResponseEntity<?> getRandomBooks(@RequestParam(value = "amount", defaultValue = "5") Integer amount) {
        List<BookDTO> books = bookService.getRandomBooks(amount);
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
                                      @RequestParam(value = "pubId", required = false) List<Integer> pubId,
                                      @RequestParam(value = "seller", defaultValue = "") String seller,
                                      @RequestParam(value = "type", defaultValue = "") String type,
                                      @RequestParam(value = "fromRange", defaultValue = "1000") Double fromRange,
                                      @RequestParam(value = "toRange", defaultValue = "100000000") Double toRange,
                                      @RequestParam(value = "rating", defaultValue = "0") Integer rating,
                                      @RequestParam(value = "amount", defaultValue = "1") Integer amount) {
        Page<BookDTO> books = bookService.getBooks(pageNo, pageSize, sortBy, sortDir, keyword,
                rating, amount, cateId, pubId, seller, type, fromRange, toRange);
        return new ResponseEntity<>(books, HttpStatus.OK);
    }

    //Get book details by {id}
    @GetMapping("/{id}")
    public ResponseEntity<?> getBookDetailById(@PathVariable("id") Long bookId) {
        return new ResponseEntity<>(bookService.getBookDetailById(bookId), HttpStatus.OK);
    }

    //Add new book
    @PostMapping(consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    @PreAuthorize("hasAnyRole('ADMIN','SELLER')")
    public ResponseEntity<?> addBook(@Valid @RequestPart("request") BookRequest request,
                                     @RequestPart("image") MultipartFile file,
                                     @CurrentAccount Account currUser) {
        try {
            return new ResponseEntity<>(bookService.addBook(request, file, currUser), HttpStatus.CREATED);
        } catch (Exception e) {
            String message = "Could not upload the file: " + file.getOriginalFilename() + "!";
            return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(message);
        }
    }

    //Update book by id
    @PutMapping(value = "/{id}", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    @PreAuthorize("hasAnyRole('ADMIN','SELLER')")
    public ResponseEntity<?> updateBook(@Valid @RequestPart("request") BookRequest request,
                                        @RequestPart(name = "image", required = false) MultipartFile file,
                                        @PathVariable("id") Long id,
                                        @CurrentAccount Account currUser) {

        try {
            return new ResponseEntity<>(bookService.updateBook(request, file, id, currUser), HttpStatus.CREATED);
        } catch (Exception e) {
            String message = "Failed to update book!";
            return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(message);
        }
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

    //Test purpose
    @GetMapping("/test/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getTest(@PathVariable("id") long bookId) {
        Account test = accRepo.findByUserName("chuotcon1").orElse(null);
        return new ResponseEntity<>(test, HttpStatus.OK);
    }
}
