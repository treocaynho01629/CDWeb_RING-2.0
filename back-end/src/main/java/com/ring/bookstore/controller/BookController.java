package com.ring.bookstore.controller;

import java.util.List;

import com.ring.bookstore.model.enums.BookType;
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
import com.ring.bookstore.model.dto.response.books.BookDisplayDTO;
import com.ring.bookstore.model.entity.Account;
import com.ring.bookstore.model.dto.request.BookRequest;
import com.ring.bookstore.service.BookService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

/**
 * Controller named {@link BookController} for handling book-related operations.
 * Exposes endpoints under "/api/books".
 */
@RestController
@RequestMapping("/api/books")
@RequiredArgsConstructor
@Validated
public class BookController {

    private final BookService bookService;

    /**
     * Retrieves a random selection of books.
     *
     * @param amount number of random books to return (default is 5).
     * @param withDesc if true, includes descriptions in the response.
     * @return a {@link ResponseEntity} containing the list of random books.
     */
    @GetMapping("/random")
    public ResponseEntity<?> getRandomBooks(@RequestParam(value = "amount", defaultValue = "5") Integer amount,
                                            @RequestParam(value = "withDesc", defaultValue = "false") Boolean withDesc) {
        List<BookDisplayDTO> books = bookService.getRandomBooks(amount, withDesc);
        return new ResponseEntity<>(books, HttpStatus.OK);
    }

    /**
     * Retrieves a list of books by their IDs.
     *
     * @param ids list of book IDs.
     * @return a {@link ResponseEntity} containing the list of books.
     */
    @GetMapping("/find")
    public ResponseEntity<?> getBooksInIds(@RequestParam(value = "ids") List<Long> ids) {
        List<BookDisplayDTO> books = bookService.getBooksInIds(ids);
        return new ResponseEntity<>(books, HttpStatus.OK);
    }

    /**
     * Retrieves books with optional filters and pagination.
     *
     * @param pageSize  size of each page.
     * @param pageNo    page number.
     * @param sortBy    sorting field.
     * @param sortDir   sorting direction.
     * @param keyword   keyword to filter books.
     * @param cateId    optional category ID.
     * @param pubIds    optional list of publisher IDs.
     * @param types     optional list of book types.
     * @param shopId    optional shop ID.
     * @param userId    optional user ID.
     * @param fromRange minimum price range (default is 0).
     * @param toRange   maximum price range (default is 10000000).
     * @param rating    minimum rating (default is 0).
     * @param amount    minimum amount (default is 1).
     * @param withDesc  if true, includes descriptions.
     * @return a {@link ResponseEntity} containing a paginated list of books.
     */
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

    /**
     * Retrieves a book by its ID.
     *
     * @param bookId the ID of the book.
     * @return a {@link ResponseEntity} containing the book.
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getBook(@PathVariable("id") Long bookId) {
        return new ResponseEntity<>(bookService.getBook(bookId), HttpStatus.OK);
    }

    /**
     * Retrieves detailed information of a book by its ID.
     *
     * @param bookId the ID of the book.
     * @return a {@link ResponseEntity} containing the book details.
     */
    @GetMapping("/detail/{id}")
    public ResponseEntity<?> getBookDetailById(@PathVariable("id") Long bookId) {
        return new ResponseEntity<>(bookService.getBookDetail(bookId), HttpStatus.OK);
    }

    /**
     * Retrieves detailed information of a book by its slug.
     *
     * @param slug the slug identifier of the book.
     * @return a {@link ResponseEntity} containing the book details.
     */
    @GetMapping("/slug/{slug}")
    public ResponseEntity<?> getBookDetailBySlug(@PathVariable("slug") String slug) {
        return new ResponseEntity<>(bookService.getBookDetail(slug), HttpStatus.OK);
    }

    /**
     * Retrieves keyword suggestions for books.
     *
     * @param keyword search keyword.
     * @return a {@link ResponseEntity} containing list of keyword suggestions.
     */
    @GetMapping("/suggest")
    public ResponseEntity<?> getBooksSuggestion(@RequestParam(value = "keyword", defaultValue = "") String keyword) {
        List<String> options = bookService.getBooksSuggestion(keyword);
        return new ResponseEntity<>(options, HttpStatus.OK);
    }

    /**
     * Retrieves book analytics, optionally filtered by shop.
     *
     * @param shopId optional shop ID.
     * @return a {@link ResponseEntity} containing analytics data.
     */
    @GetMapping("/analytics")
    @PreAuthorize("hasAnyRole('SELLER','GUEST') and hasAuthority('read:book')")
    public ResponseEntity<?> getBookAnalytics(@RequestParam(value = "shopId", required = false) Long shopId,
                                              @RequestParam(value = "userId", required = false) Long userId) {
        return new ResponseEntity<>(bookService.getAnalytics(shopId, userId), HttpStatus.OK);
    }

    /**
     * Creates a new book.
     *
     * @param request the book creation request.
     * @param thumbnail book thumbnail image.
     * @param images optional additional images.
     * @param currUser the currently authenticated seller.
     * @return a {@link ResponseEntity} containing the created book.
     */
    @PostMapping(consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    @PreAuthorize("hasRole('SELLER') and hasAuthority('create:book')")
    public ResponseEntity<?> addBook(@Valid @RequestPart("request") BookRequest request,
                                     @RequestPart("thumbnail") MultipartFile thumbnail,
                                     @RequestPart(name = "images", required = false) MultipartFile[] images,
                                     @CurrentAccount Account currUser) {
        return new ResponseEntity<>(bookService.addBook(request,
                thumbnail, images, currUser), HttpStatus.CREATED);
    }

    /**
     * Updates an existing book.
     *
     * @param id the ID of the book to update.
     * @param request the book update request.
     * @param thumbnail optional new thumbnail image.
     * @param images optional new images.
     * @param currUser the currently authenticated seller.
     * @return a {@link ResponseEntity} containing the updated book.
     */
    @PutMapping(value = "/{id}", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    @PreAuthorize("hasRole('SELLER') and hasAuthority('update:book')")
    public ResponseEntity<?> updateBook(@PathVariable("id") Long id,
                                        @Valid @RequestPart("request") BookRequest request,
                                        @RequestPart(name = "thumbnail", required = false) MultipartFile thumbnail,
                                        @RequestPart(name = "images", required = false) MultipartFile[] images,
                                        @CurrentAccount Account currUser) {
        return new ResponseEntity<>(bookService.updateBook(id,
                request, thumbnail, images, currUser), HttpStatus.CREATED);
    }

    /**
     * Deletes a book by its ID.
     *
     * @param id the ID of the book to delete.
     * @param currUser the currently authenticated seller.
     * @return a {@link ResponseEntity} containing a deleted book DTO.
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SELLER') and hasAuthority('delete:book')")
    public ResponseEntity<?> deleteBook(@PathVariable("id") Long id,
                                        @CurrentAccount Account currUser) {
        return new ResponseEntity<>(bookService.deleteBook(id, currUser), HttpStatus.OK);
    }

    /**
     * Deletes multiple books by a list of IDs.
     *
     * @param ids list of book IDs to delete.
     * @param currUser the currently authenticated seller.
     * @return a {@link ResponseEntity} containing a success message.
     */
    @DeleteMapping("/delete-multiple")
    @PreAuthorize("hasRole('SELLER') and hasAuthority('delete:book')")
    public ResponseEntity<?> deleteBooks(@RequestParam("ids") List<Long> ids,
                                         @CurrentAccount Account currUser) {
        bookService.deleteBooks(ids, currUser);
        return new ResponseEntity<>("Products deleted successfully!", HttpStatus.OK);
    }

    /**
     * Deletes books that are NOT in the given list of IDs.
     *
     * @param keyword keyword filter.
     * @param cateId optional category ID.
     * @param pubIds optional publisher IDs.
     * @param types optional book types.
     * @param shopId optional shop ID.
     * @param userId optional user ID.
     * @param fromRange minimum price range.
     * @param toRange maximum price range.
     * @param rating minimum rating.
     * @param amount minimum amount.
     * @param ids list of IDs to exclude from deletion.
     * @param currUser the currently authenticated seller.
     * @return a {@link ResponseEntity} containing a success message.
     */
    @DeleteMapping("/delete-inverse")
    @PreAuthorize("hasRole('SELLER') and hasAuthority('delete:book')")
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

    /**
     * Deletes all books, optionally filtered by shop ID.
     *
     * @param shopId optional shop ID.
     * @param currUser the currently authenticated seller.
     * @return a {@link ResponseEntity} containing a success message.
     */
    @DeleteMapping("/delete-all")
    @PreAuthorize("hasRole('SELLER') and hasAuthority('delete:book')")
    public ResponseEntity<?> deleteAllBooks(@RequestParam(value = "shopId", required = false) Long shopId,
                                            @CurrentAccount Account currUser) {
        bookService.deleteAllBooks(shopId, currUser);
        return new ResponseEntity<>("All products deleted successfully!", HttpStatus.OK);
    }
}
