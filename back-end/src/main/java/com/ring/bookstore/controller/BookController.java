package com.ring.bookstore.controller;

import java.io.IOException;
import java.util.List;

import com.ring.bookstore.enums.BookType;
import com.ring.bookstore.exception.ImageResizerException;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
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
import com.ring.bookstore.dtos.books.BookDisplayDTO;
import com.ring.bookstore.model.Account;
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
    public ResponseEntity<?> getRandomBooks(@RequestParam(value = "amount", defaultValue = "5") Integer amount,
                                            @RequestParam(value = "withDesc", defaultValue = "false") Boolean withDesc) {
        List<BookDisplayDTO> books = bookService.getRandomBooks(amount, withDesc);
        return new ResponseEntity<>(books, HttpStatus.OK);
    }

    //Get books by ids
    @GetMapping("/find")
    public ResponseEntity<?> getBooksInIds(@RequestParam(value = "ids") List<Long> ids) {
        List<BookDisplayDTO> books = bookService.getBooksInIds(ids);
        return new ResponseEntity<>(books, HttpStatus.OK);
    }

    //Get books with filtering
    @GetMapping
    public ResponseEntity<?> getBooks(@RequestParam(value = "pSize", defaultValue = "15") Integer pageSize,
                                      @RequestParam(value = "pageNo", defaultValue = "0") Integer pageNo,
                                      @RequestParam(value = "sortBy", defaultValue = "id") String sortBy,
                                      @RequestParam(value = "sortDir", defaultValue = "desc") String sortDir,
                                      @RequestParam(value = "keyword", defaultValue = "") String keyword,
                                      @RequestParam(value = "cateId", required = false) Integer cateId,
                                      @RequestParam(value = "pubIds", required = false) List<Integer> pubIds,
                                      @RequestParam(value = "types", required = false) List<BookType> types,
                                      @RequestParam(value = "shopId", required = false) Long shopId,
                                      @RequestParam(value = "userId", required = false) Long userId,
                                      @RequestParam(value = "fromRange", defaultValue = "0") Double fromRange,
                                      @RequestParam(value = "toRange", defaultValue = "10000000") Double toRange,
                                      @RequestParam(value = "rating", defaultValue = "0") Integer rating,
                                      @RequestParam(value = "amount", defaultValue = "1") Integer amount,
                                      @RequestParam(value = "withDesc", defaultValue = "false") Boolean withDesc) {
        Page<BookDisplayDTO> books = bookService.getBooks(
                pageNo,
                pageSize,
                sortBy,
                sortDir,
                keyword,
                rating,
                amount,
                cateId,
                pubIds,
                types,
                shopId,
                userId,
                fromRange,
                toRange,
                withDesc);
        return new ResponseEntity<>(books, HttpStatus.OK);
    }

    //Get book
    @GetMapping("/{id}")
    public ResponseEntity<?> getBook(@PathVariable("id") Long bookId) {
        return new ResponseEntity<>(bookService.getBook(bookId), HttpStatus.OK);
    }

    //Get book details by {id}
    @GetMapping("/detail/{id}")
    public ResponseEntity<?> getBookDetailById(@PathVariable("id") Long bookId) {
        return new ResponseEntity<>(bookService.getBookDetail(bookId), HttpStatus.OK);
    }

    //Get book details by {id}
    @GetMapping("/slug/{slug}")
    public ResponseEntity<?> getBookDetailBySlug(@PathVariable("slug") String slug) {
        return new ResponseEntity<>(bookService.getBookDetail(slug), HttpStatus.OK);
    }

    //Get suggestion
    @GetMapping("/suggest")
    public ResponseEntity<?> getBooksSuggestion(@RequestParam(value = "keyword", defaultValue = "") String keyword) {
        List<String> options = bookService.getBooksSuggestion(keyword);
        return new ResponseEntity<>(options, HttpStatus.OK);
    }

    @GetMapping("/analytics")
    @PreAuthorize("hasAnyRole('ADMIN','SELLER','GUEST') and hasAuthority('READ_PRIVILEGE')")
    public ResponseEntity<?> getBookAnalytics(@RequestParam(value = "shopId", required = false) Long shopId) {
        return new ResponseEntity<>(bookService.getAnalytics(shopId), HttpStatus.OK);
    }

    //Add new book
    @PostMapping(consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    @PreAuthorize("hasAnyRole('ADMIN','SELLER') and hasAuthority('CREATE_PRIVILEGE')")
    public ResponseEntity<?> addBook(@Valid @RequestPart("request") BookRequest request,
                                     @RequestPart("thumbnail") MultipartFile thumbnail,
                                     @RequestPart(name = "images", required = false) MultipartFile[] images,
                                     @CurrentAccount Account currUser) throws ImageResizerException, IOException {
        return new ResponseEntity<>(bookService.addBook(request,
                thumbnail, images, currUser), HttpStatus.CREATED);
    }

    //Update book by id
    @PutMapping(value = "/{id}", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    @PreAuthorize("hasAnyRole('ADMIN','SELLER') and hasAuthority('UPDATE_PRIVILEGE')")
    public ResponseEntity<?> updateBook(@PathVariable("id") Long id,
                                        @Valid @RequestPart("request") BookRequest request,
                                        @RequestPart(name = "thumbnail", required = false) MultipartFile thumbnail,
                                        @RequestPart(name = "images", required = false) MultipartFile[] images,
                                        @CurrentAccount Account currUser) throws ImageResizerException, IOException {
        return new ResponseEntity<>(bookService.updateBook(id,
                request, thumbnail, images, currUser), HttpStatus.CREATED);
    }

    //Delete book by {id}
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SELLER') and hasAuthority('DELETE_PRIVILEGE')")
    public ResponseEntity<?> deleteBook(@PathVariable("id") Long id,
                                        @CurrentAccount Account currUser) {
        return new ResponseEntity<>(bookService.deleteBook(id, currUser), HttpStatus.OK);
    }

    //Delete multiple books by lists of {ids}
    @DeleteMapping("/delete-multiples")
    @PreAuthorize("hasAnyRole('ADMIN','SELLER') and hasAuthority('DELETE_PRIVILEGE')")
    public ResponseEntity<?> deleteBooks(@RequestParam("ids") List<Long> ids,
                                         @CurrentAccount Account currUser) {
        bookService.deleteBooks(ids, currUser);
        return new ResponseEntity<>("Products deleted successfully!", HttpStatus.OK);
    }

    //Delete multiple books not in lists of {ids}
    @DeleteMapping("/delete-inverse")
    @PreAuthorize("hasAnyRole('ADMIN','SELLER') and hasAuthority('DELETE_PRIVILEGE')")
    public ResponseEntity<?> deleteBooksInverse(@RequestParam(value = "keyword", defaultValue = "") String keyword,
                                                @RequestParam(value = "cateId", required = false) Integer cateId,
                                                @RequestParam(value = "pubIds", required = false) List<Integer> pubIds,
                                                @RequestParam(value = "types", required = false) List<BookType> types,
                                                @RequestParam(value = "shopId", required = false) Long shopId,
                                                @RequestParam(value = "userId", required = false) Long userId,
                                                @RequestParam(value = "fromRange", defaultValue = "0") Double fromRange,
                                                @RequestParam(value = "toRange", defaultValue = "10000000") Double toRange,
                                                @RequestParam(value = "rating", defaultValue = "0") Integer rating,
                                                @RequestParam(value = "amount", defaultValue = "1") Integer amount,
                                                @RequestParam("ids") List<Long> ids,
                                                @CurrentAccount Account currUser) {
        bookService.deleteBooksInverse(keyword,
                amount,
                rating,
                cateId,
                pubIds,
                types,
                shopId,
                userId,
                fromRange,
                toRange,
                ids,
                currUser);
        return new ResponseEntity<>("Products deleted successfully!", HttpStatus.OK);
    }

    //Delete all books
    @DeleteMapping("/delete-all")
    @PreAuthorize("hasAnyRole('ADMIN','SELLER') and hasAuthority('DELETE_PRIVILEGE')")
    public ResponseEntity<?> deleteAllBooks(@RequestParam(value = "shopId", required = false) Long shopId,
                                            @CurrentAccount Account currUser) {
        bookService.deleteAllBooks(shopId, currUser);
        return new ResponseEntity<>("All products deleted successfully!", HttpStatus.OK);
    }
}
