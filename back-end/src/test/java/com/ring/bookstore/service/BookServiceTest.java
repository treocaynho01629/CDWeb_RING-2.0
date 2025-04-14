package com.ring.bookstore.service;

import com.ring.bookstore.base.AbstractServiceTest;
import com.ring.bookstore.exception.HttpResponseException;
import com.ring.bookstore.exception.ResourceNotFoundException;
import com.ring.bookstore.model.dto.projection.books.IBook;
import com.ring.bookstore.model.dto.projection.books.IBookDisplay;
import com.ring.bookstore.model.dto.projection.images.IImage;
import com.ring.bookstore.model.dto.request.BookRequest;
import com.ring.bookstore.model.dto.response.books.BookDTO;
import com.ring.bookstore.model.dto.response.books.BookDisplayDTO;
import com.ring.bookstore.model.entity.*;
import com.ring.bookstore.model.enums.BookType;
import com.ring.bookstore.model.enums.UserRole;
import com.ring.bookstore.model.mappers.BookMapper;
import com.ring.bookstore.repository.*;
import com.ring.bookstore.service.impl.BookServiceImpl;
import com.ring.bookstore.ultils.FileUploadUtil;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.data.domain.*;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class BookServiceTest extends AbstractServiceTest {

    @Mock
    private BookRepository bookRepo;

    @Mock
    private BookDetailRepository detailRepo;

    @Mock
    private PublisherRepository pubRepo;

    @Mock
    private CategoryRepository cateRepo;

    @Mock
    private ShopRepository shopRepo;

    @Mock
    private ImageRepository imageRepo;

    @Mock
    private ImageService imageService;

    @Mock
    private BookMapper bookMapper;

    @InjectMocks
    private BookServiceImpl bookService;

    private final MockMultipartFile file = new MockMultipartFile(
            "file",
            "book_thumbnail.png",
            MediaType.IMAGE_PNG_VALUE,
            "Book Thumbnail".getBytes()
    );

    private final Image image = Image.builder().id(1L).name("book_image.png").build();
    private final Role role = Role.builder()
            .roleName(UserRole.ROLE_ADMIN)
            .build();

    private Account account = Account.builder().id(1L).roles(List.of(role)).build();
    private final Shop shop = Shop.builder().id(1L).owner(account).build();

    private BookRequest request = BookRequest.builder()
            .title("Test Book")
            .description("Test Description")
            .price(100.0)
            .discount(BigDecimal.valueOf(0.1))
            .amount((short) 10)
            .shopId(1L)
            .cateId(1)
            .pubId(1)
            .type(BookType.SOFT_COVER)
            .build();

    @AfterEach
    public void cleanUp() {
        account = Account.builder().id(1L).roles(List.of(role)).build();
        request = BookRequest.builder()
                .title("Test Book")
                .description("Test Description")
                .price(100.0)
                .discount(BigDecimal.valueOf(0.1))
                .amount((short) 10)
                .shopId(1L)
                .cateId(1)
                .pubId(1)
                .type(BookType.SOFT_COVER)
                .build();
        SecurityContextHolder.clearContext();
    }

    @Test
    public void whenGetRandomBooks_ThenReturnsBooks() {

        // Given
        List<BookDisplayDTO> expectedBooks = List.of(BookDisplayDTO.builder().id(1L).build());

        // When
        when(bookRepo.findRandomBooks(anyInt(), eq(false)))
                .thenReturn(new ArrayList<>(List.of(mock(IBookDisplay.class))));
        when(bookMapper.displayToDTO(any(IBookDisplay.class))).thenReturn(BookDisplayDTO.builder().id(1L).build());

        // Then
        List<BookDisplayDTO> result = bookService.getRandomBooks(1, false);

        assertNotNull(result);
        assertFalse(result.isEmpty());
        assertEquals(expectedBooks.size(), result.size());

        // Verify
        verify(bookRepo, times(1)).findRandomBooks(anyInt(), eq(false));
        verify(bookMapper, times(1)).displayToDTO(any(IBookDisplay.class));
    }

    @Test
    public void whenGetBooksInIds_ThenReturnsBooks() {

        // Given
        List<Long> ids = List.of(1L, 2L);
        List<BookDisplayDTO> expectedBooks = List.of(
                BookDisplayDTO.builder().title("test").build(),
                BookDisplayDTO.builder().title("test").build());

        // When
        when(bookRepo.findBooksDisplayInIds(eq(ids)))
                .thenReturn(new ArrayList<>(List.of(mock(IBookDisplay.class), mock(IBookDisplay.class))));
        when(bookMapper.displayToDTO(any(IBookDisplay.class)))
                .thenReturn(BookDisplayDTO.builder().title("test").build());

        // Then
        List<BookDisplayDTO> result = bookService.getBooksInIds(ids);

        assertNotNull(result);
        assertEquals(expectedBooks.size(), result.size());

        // Verify
        verify(bookRepo, times(1)).findBooksInIds(eq(ids));
        verify(bookMapper, times(2)).displayToDTO(any(IBookDisplay.class));
    }

    @Test
    public void whenGetBooks_ThenReturnsPagedBooks() {

        // Given
        Pageable pageable = PageRequest.of(0, 1, Sort.by("id").descending());
        Page<IBookDisplay> books = new PageImpl<>(
                List.of(mock(IBookDisplay.class)),
                pageable,
                2
        );
        BookDisplayDTO mapped = BookDisplayDTO.builder().id(1L).build();
        Page<BookDisplayDTO> expectedDTOS = new PageImpl<>(
                List.of(mapped),
                pageable,
                2
        );

        // When
        when(bookRepo.findBooksWithFilter(eq(""),
                isNull(),
                isNull(),
                isNull(),
                isNull(),
                isNull(),
                eq(0.0),
                eq(1000000.0),
                eq(false),
                eq(0),
                eq(0),
                any(Pageable.class))).thenReturn(books);
        when(bookMapper.displayToDTO(any(IBookDisplay.class))).thenReturn(mapped);

        // Then
        Page<BookDisplayDTO> result = bookService.getBooks(0,
                1,
                "id",
                "desc",
                "",
                0,
                0,
                null,
                null,
                null,
                null,
                null,
                0.0,
                1000000.0,
                false);

        assertNotNull(result);
        assertFalse(result.getContent().isEmpty());
        assertEquals(expectedDTOS.getNumber(), result.getNumber());
        assertEquals(expectedDTOS.getContent().get(0).id(), result.getContent().get(0).id());
        assertEquals(expectedDTOS.getTotalPages(), result.getTotalPages());
        assertEquals(expectedDTOS.getTotalElements(), result.getTotalElements());

        // Verify
        verify(bookRepo, times(1)).findBooksWithFilter(eq(""),
                isNull(),
                isNull(),
                isNull(),
                isNull(),
                isNull(),
                eq(0.0),
                eq(1000000.0),
                eq(false),
                eq(0),
                eq(0),
                any(Pageable.class));
        verify(bookMapper, times(1)).displayToDTO(any(IBookDisplay.class));
    }

    @Test
    public void whenGetBookById_ThenReturnBookDTO() {

        // Given
        Long id = 1L;
        List<Long> imageIds = List.of(1L, 2L);
        List<Image> images = List.of(mock(Image.class));
        BookDTO expected = BookDTO.builder().id(id).build();

        // When
        when(detailRepo.findBook(id)).thenReturn(Optional.of(mock(IBook.class)));
        when(mock(IBook.class).getPreviews()).thenReturn(imageIds);
        when(imageRepo.findImages(imageIds)).thenReturn(images);
        when(bookMapper.projectionToDTO(any(IBook.class), images)).thenReturn(expected);

        // Then
        BookDTO result = bookService.getBook(id);

        assertNotNull(result);
        assertEquals(expected, result);

        // Verify
        verify(detailRepo, times(1)).findBook(id);
        verify(mock(IBook.class), times(1)).getPreviews();
        verify(imageRepo, times(1)).findImages(imageIds);
        verify(bookMapper, times(1)).projectionToDTO(any(IBook.class), images);
    }

    @Test
    public void whenGetBookNonExistingBookById_ThenThrowsException() {

        // Given
        Long id = 1L;

        // When
        when(detailRepo.findBook(id)).thenReturn(Optional.empty());

        // Then
        ResourceNotFoundException exception =
                assertThrows(ResourceNotFoundException.class, () -> bookService.getBook(id));
        assertEquals("Product not found!", exception.getError());


        // Verify
        verify(detailRepo, times(1)).findBook(id);
    }

//    @Test
//    public void whenGetBookDetailBySlug_ThenReturnsBookDetail() {
//        String slug = "test-book";
//        BookDetailDTO expectedDetail = BookDetailDTO.builder().id(1L).build();
//
//        when(detailRepo.findBookDetail(eq(null), eq(slug)))
//                .thenReturn(Optional.of(mock(IBookDetail.class)));
//
//        when(bookMapper.detailToDTO(any(IBookDetail.class)))
//                .thenReturn(expectedDetail);
//
//        BookDetailDTO result = bookService.getBookDetail(slug);
//
//        assertNotNull(result);
//        assertEquals(expectedDetail.getId(), result.getId());
//
//        verify(detailRepo, times(1)).findBookDetail(eq(null), eq(slug));
//        verify(bookMapper, times(1)).detailToDTO(any(IBookDetail.class));
//    }
//
//    // Edge case: Test for handling a non-existent book
//    @Test
//    public void whenGetBookDetail_ThenThrowsException() {
//        Long id = 999L;
//
//        when(detailRepo.findBook(id))
//                .thenReturn(Optional.empty());
//
//        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class, () -> bookService.getBook(id));
//        assertEquals("Product not found!", exception.getMessage());
//
//        verify(detailRepo, times(1)).findBook(id);
//    }
//
//    @Test
//    public void givenNewBook_WhenAddBook_ThenReturnsNewBook() {
//
//        // Given
//        setupSecurityContext(account);
//        Book expected = Book.builder()
//                .title(request.getTitle())
//                .description(request.getDescription())
//                .price(request.getPrice())
//                .discount(request.getDiscount())
//                .amount(request.getAmount())
//                .shop(shop)
//                .build();
//
//        // When
//        when(shopRepo.findById(request.getShopId())).thenReturn(Optional.of(shop));
//        when(imageService.upload(any(MultipartFile.class), eq(FileUploadUtil.PRODUCT_FOLDER))).thenReturn(image);
//        when(bookRepo.save(any(Book.class))).thenReturn(expected);
//
//        // Then
//        Book result = bookService.addBook(request, file, new MultipartFile[0], account);
//
//        assertNotNull(result);
//        assertEquals(expected, result);
//
//        // Verify
//        verify(shopRepo, times(1)).findById(request.getShopId());
//        verify(imageService, times(1)).upload(any(MultipartFile.class), eq(FileUploadUtil.PRODUCT_FOLDER));
//        verify(bookRepo, times(1)).save(any(Book.class));
//    }
//
//    @Test
//    public void givenNewBookWithInvalidShop_WhenAddBook_ThenThrowsException() {
//
//        // Given
//        request.setShopId(2L);
//
//        // When
//        when(shopRepo.findById(request.getShopId())).thenReturn(Optional.empty());
//
//        // Then
//        ResourceNotFoundException exception =
//                assertThrows(ResourceNotFoundException.class, () -> bookService.addBook(request, file, new MultipartFile[0], account));
//        assertEquals("Shop not found", exception.getMessage());
//
//        // Verify
//        verify(shopRepo, times(1)).findById(request.getShopId());
//        verify(imageService, never()).upload(any(MultipartFile.class), eq(FileUploadUtil.PRODUCT_FOLDER));
//        verify(bookRepo, never()).save(any(Book.class));
//    }
//
//    @Test
//    public void givenNewBookForSomeoneElseShop_WhenAddBook_ThenThrowsException() {
//
//        // Given
//        Account altAccount = Account.builder()
//                .id(2L)
//                .roles(List.of(Role.builder().roleName(UserRole.ROLE_SELLER).build()))
//                .build();
//        setupSecurityContext(altAccount);
//
//        // When
//        when(shopRepo.findById(request.getShopId())).thenReturn(Optional.of(shop));
//
//        // Then
//        HttpResponseException exception =
//                assertThrows(HttpResponseException.class, () -> bookService.addBook(request, file, new MultipartFile[0], altAccount));
//        assertEquals("Invalid role!", exception.getError());
//
//        // Verify
//        verify(shopRepo, times(1)).findById(request.getShopId());
//        verify(imageService, never()).upload(any(MultipartFile.class), eq(FileUploadUtil.PRODUCT_FOLDER));
//        verify(bookRepo, never()).save(any(Book.class));
//    }
//
//    @Test
//    public void givenNewBookWithoutShop_WhenAddBook_ThenThrowsException() {
//
//        // Given
//        request.setShopId(null);
//        Account altAccount = Account.builder()
//                .id(2L)
//                .roles(List.of(Role.builder().roleName(UserRole.ROLE_SELLER).build()))
//                .build();
//        setupSecurityContext(altAccount);
//
//        // Then
//        HttpResponseException exception =
//                assertThrows(HttpResponseException.class, () -> bookService.addBook(request, file, new MultipartFile[0], altAccount));
//        assertEquals("Shop is required!", exception.getError());
//
//        // Verify
//        verify(shopRepo, never()).findById(request.getShopId());
//        verify(imageService, never()).upload(any(MultipartFile.class), eq(FileUploadUtil.PRODUCT_FOLDER));
//        verify(bookRepo, never()).save(any(Book.class));
//    }
//
//    @Test
//    public void whenUpdateBook_ThenReturnsUpdatedBook() {
//
//        // Given
//        setupSecurityContext(account);
//        Long id = 1L;
//        Book expected = Book.builder()
//                .id(id)
//                .title(request.getTitle())
//                .description(request.getDescription())
//                .price(request.getPrice())
//                .discount(request.getDiscount())
//                .amount(request.getAmount())
//                .shop(shop)
//                .build();
//
//        // When
//        when(bookRepo.findById(id)).thenReturn(Optional.of(expected));
//        when(shopRepo.findById(request.getShopId())).thenReturn(Optional.of(shop));
//        when(imageService.upload(any(MultipartFile.class), eq(FileUploadUtil.PRODUCT_FOLDER))).thenReturn(image);
//        when(bookRepo.save(any(Book.class))).thenReturn(expected);
//
//        // Then
//        Book result = bookService.updateBook(id, request, file, new MultipartFile[0], account);
//
//        assertNotNull(result);
//        assertEquals(expected, result);
//
//        // Verify
//        verify(bookRepo, times(1)).findById(id);
//        verify(shopRepo, times(1)).findById(request.getShopId());
//        verify(imageService, times(1)).upload(any(MultipartFile.class), eq(FileUploadUtil.PRODUCT_FOLDER));
//        verify(bookRepo, times(1)).save(any(Book.class));
//    }
//
//    @Test
//    public void whenDeleteBook_ThenReturnsDeletedBook() {
//
//        // Given
//        setupSecurityContext(account);
//        Long id = 1L;
//        Book expected = Book.builder()
//                .id(id)
//                .title(request.getTitle())
//                .description(request.getDescription())
//                .price(request.getPrice())
//                .discount(request.getDiscount())
//                .amount(request.getAmount())
//                .shop(shop)
//                .build();
//
//        // When
//        when(bookRepo.findById(id)).thenReturn(Optional.of(expected));
//        doNothing().when(bookRepo).deleteById(id);
//
//        // Then
//        Book result = bookService.deleteBook(id, account);
//
//        assertNotNull(result);
//        assertEquals(expected, result);
//
//        // Verify
//        verify(bookRepo, times(1)).findById(id);
//        verify(bookRepo, times(1)).deleteById(id);
//    }
//
//    @Test
//    public void whenUpdateBook_ThenReturnsUpdatedBook() {
//        Long id = 1L;
//        Book expected = Book.builder()
//                .id(id)
//                .title(request.getTitle())
//                .description(request.getDescription())
//                .price(request.getPrice())
//                .discount(request.getDiscount())
//                .amount(request.getAmount())
//                .shop(shop)
//                .build();
//
//        setupSecurityContext(account);
//
//        when(bookRepo.findById(id)).thenReturn(Optional.of(expected));
//        when(shopRepo.findById(request.getShopId())).thenReturn(Optional.of(shop));
//        when(imageService.upload(any(MultipartFile.class), eq(FileUploadUtil.PRODUCT_FOLDER))).thenReturn(image);
//        when(bookRepo.save(any(Book.class))).thenReturn(expected);
//
//        Book result = bookService.updateBook(id, request, file, new MultipartFile[0], account);
//
//        assertNotNull(result);
//        assertEquals(expected.getTitle(), result.getTitle());
//        assertEquals(expected.getDescription(), result.getDescription());
//
//        verify(bookRepo, times(1)).findById(id);
//        verify(shopRepo, times(1)).findById(request.getShopId());
//        verify(imageService, times(1)).upload(any(MultipartFile.class), eq(FileUploadUtil.PRODUCT_FOLDER));
//        verify(bookRepo, times(1)).save(any(Book.class));
//    }
//
//    // Edge case: Test for deleting a book
//    @Test
//    public void whenDeleteBook_ThenReturnsDeletedBook() {
//        Long id = 1L;
//        Book expected = Book.builder()
//                .id(id)
//                .title(request.getTitle())
//                .description(request.getDescription())
//                .price(request.getPrice())
//                .discount(request.getDiscount())
//                .amount(request.getAmount())
//                .shop(shop)
//                .build();
//
//        setupSecurityContext(account);
//
//        when(bookRepo.findById(id)).thenReturn(Optional.of(expected));
//        doNothing().when(bookRepo).deleteById(id);
//
//        Book result = bookService.deleteBook(id, account);
//
//        assertNotNull(result);
//        assertEquals(expected.getTitle(), result.getTitle());
//        verify(bookRepo, times(1)).findById(id);
//        verify(bookRepo, times(1)).deleteById(id);
//    }
//
//    // Edge case: Test for deleting multiple books
//    @Test
//    public void whenDeleteBooks_ThenSuccess() {
//        List<Long> ids = List.of(1L, 2L, 3L);
//
//        setupSecurityContext(account);
//        doNothing().when(bookRepo).deleteAllById(ids);
//
//        bookService.deleteBooks(ids, account);
//
//        verify(bookRepo, times(1)).deleteAllById(ids);
//    }
//
//    // Edge case: Test for deleting books with an inverse condition
//    @Test
//    public void whenDeleteBooksInverse_ThenSuccess() {
//        List<Long> ids = List.of(1L, 2L, 3L);
//        List<Long> inverseIds = List.of(4L);
//
//        when(bookRepo.findInverseIds(eq(""), eq(null), eq(null), eq(null), eq(null), eq(null), eq(null), eq(null), eq(null), eq(null), eq(null), eq(ids)))
//                .thenReturn(inverseIds);
//
//        doNothing().when(bookRepo).deleteAllById(inverseIds);
//
//        bookService.deleteBooksInverse("", null, null, null, null, ids, account);
//
//        verify(bookRepo, times(1)).findInverseIds(eq(""), eq(null), eq(null), eq(null), eq(null), eq(null), eq(null), eq(null), eq(null), eq(null), eq(null), eq(ids));
//        verify(bookRepo, times(1)).deleteAllById(inverseIds);
//    }
//
//    // Edge case: Test for deleting all books
//    @Test
//    public void whenDeleteAllBooks_ThenSuccess() {
//        setupSecurityContext(account);
//        doNothing().when(bookRepo).deleteAll();
//
//        bookService.deleteAllBooks(null, account);
//
//        verify(bookRepo, times(1)).deleteAll();
//    }
}
