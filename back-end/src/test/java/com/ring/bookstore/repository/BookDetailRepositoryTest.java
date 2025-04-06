package com.ring.bookstore.repository;

import com.ring.bookstore.model.dto.projection.books.IBook;
import com.ring.bookstore.model.dto.projection.books.IBookDetail;
import com.ring.bookstore.model.entity.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@Testcontainers
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class BookDetailRepositoryTest {

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine");

    @Autowired
    private BookDetailRepository detailRepo;

    @Autowired
    private BookRepository bookRepo;

    @Autowired
    private ShopRepository shopRepo;

    @Autowired
    private CategoryRepository cateRepo;

    @Autowired
    private PublisherRepository pubRepo;

    @Autowired
    private AccountRepository accountRepo;

    private Book book;
    private BookDetail detail;

    @BeforeEach
    void setUp() {
        Account account = Account.builder()
                .username("initial")
                .pass("asd")
                .email("initialEmail@initial.com")
                .build();
        account.setCreatedDate(LocalDateTime.now());
        Account savedAccount = accountRepo.save(account);

        Shop shop = Shop.builder().name("shop").owner(savedAccount).build();
        shop.setCreatedDate(LocalDateTime.now());
        Shop savedShop = shopRepo.save(shop);

        Category cate = Category.builder().name("test").build();
        Category savedCate = cateRepo.save(cate);

        Publisher pub = Publisher.builder().name("test").build();
        Publisher savedPub = pubRepo.save(pub);

        Image image = Image.builder().name("image").build();
        Image image2 = Image.builder().name("image2").build();

        book = Book.builder()
                .image(image)
                .slug("test")
                .title("book")
                .author("author")
                .price(10000.0)
                .discount(BigDecimal.valueOf(0))
                .amount((short) 88)
                .shop(savedShop)
                .cate(savedCate)
                .publisher(savedPub)
                .build();
        Book book2 = Book.builder()
                .image(image2)
                .slug("test2")
                .title("book2")
                .author("author2")
                .price(20000.0)
                .discount(BigDecimal.valueOf(0))
                .amount((short) 1)
                .shop(savedShop)
                .cate(savedCate)
                .publisher(savedPub)
                .build();
        book.setCreatedDate(LocalDateTime.now().minusMonths(1));
        book2.setCreatedDate(LocalDateTime.now().minusMonths(1));
        List<Book> books = List.of(book, book2);
        bookRepo.saveAll(books);

        detail = BookDetail.builder()
                .book(book)
                .pages(123)
                .build();
        BookDetail detail2 = BookDetail.builder()
                .book(book2)
                .pages(123)
                .build();
        List<BookDetail> details = List.of(detail, detail2);
        detailRepo.saveAll(details);
    }

    @Test
    public void givenNewBookDetail_whenSaveBookDetail_ThenReturnBookDetail() {
        Image image = Image.builder().name("image3").build();
        Book book = Book.builder()
                .image(image)
                .build();
        BookDetail bookDetail = BookDetail.builder()
                .book(book)
                .size("8.5x11")
                .pages(300)
                .bWeight(1.2)
                .build();

        BookDetail savedDetail = detailRepo.save(bookDetail);

        assertNotNull(savedDetail);
        assertNotNull(savedDetail.getId());
    }

    @Test
    public void whenUpdateBookDetail_ThenReturnUpdatedBookDetail() {
        BookDetail foundDetail = detailRepo.findById(detail.getId()).orElse(null);
        assertNotNull(foundDetail);
        foundDetail.setPages(320);
        foundDetail.setBDate(LocalDate.now());

        BookDetail updatedDetail = detailRepo.save(foundDetail);

        assertNotNull(updatedDetail);
        assertNotNull(updatedDetail.getBDate());
        assertEquals(320, updatedDetail.getPages());
    }

    @Test
    public void whenDeleteBookDetail_ThenFindNull() {
        detailRepo.deleteById(detail.getId());

        BookDetail foundDetail = detailRepo.findById(detail.getId()).orElse(null);

        assertNull(foundDetail);
    }

    @Test
    public void whenFindBookDetail_ThenReturnCorrectDetail() {
        IBookDetail foundDetail = detailRepo.findBookDetail(book.getId(), null).orElse(null);
        IBookDetail foundDetail2 = detailRepo.findBookDetail(null, book.getSlug()).orElse(null);

        assertNotNull(foundDetail);
        assertNotNull(foundDetail2);
        assertEquals(foundDetail.getId(), foundDetail2.getId());
    }

    @Test
    public void whenFindBook_ThenReturnBook() {
        IBook foundBook = detailRepo.findBook(book.getId()).orElse(null);

        assertNotNull(foundBook);
        assertEquals(book.getId(), foundBook.getId());
    }
}