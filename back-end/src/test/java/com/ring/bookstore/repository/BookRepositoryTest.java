package com.ring.bookstore.repository;

import com.ring.bookstore.model.dto.response.books.IBookDisplay;
import com.ring.bookstore.model.dto.response.dashboard.IStat;
import com.ring.bookstore.model.entity.*;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import static org.junit.jupiter.api.Assertions.*;

@Testcontainers
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class BookRepositoryTest {

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine");

    @Autowired
    private BookRepository bookRepo;

    @Autowired
    private ShopRepository shopRepo;

    @Autowired
    private CategoryRepository cateRepo;

    @Autowired
    private AccountRepository accountRepo;

    @PersistenceContext
    private EntityManager entityManager;

    private Book book;
    private Account account;

    @BeforeEach
    void setUp() {
        account = Account.builder()
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

        Image image = Image.builder().name("image").build();
        Image image2 = Image.builder().name("image2").build();
        Image image3 = Image.builder().name("image3").build();

        book = Book.builder()
                .image(image)
                .title("book")
                .author("author")
                .price(10000.0)
                .discount(BigDecimal.valueOf(0))
                .amount((short) 88)
                .shop(savedShop)
                .cate(savedCate)
                .build();
        Book book2 = Book.builder()
                .image(image2)
                .title("book2")
                .author("author2")
                .price(20000.0)
                .discount(BigDecimal.valueOf(0))
                .amount((short) 1)
                .shop(savedShop)
                .cate(savedCate)
                .build();
        Book book3 = Book.builder()
                .image(image3)
                .title("3koob")
                .author("author3")
                .price(30000.0)
                .discount(BigDecimal.valueOf(0))
                .amount((short) 0)
                .shop(savedShop)
                .cate(savedCate)
                .build();
        book.setCreatedDate(LocalDateTime.now().minusMonths(1));
        book2.setCreatedDate(LocalDateTime.now().minusMonths(1));
        book3.setCreatedDate(LocalDateTime.now());
        List<Book> books = List.of(book, book2, book3);
        bookRepo.saveAll(books);
    }

    @Test
    public void givenNewBook_whenSaveBook_ThenReturnBook() {
        Image image = Image.builder().build();
        Book book = Book.builder()
                .image(image)
                .title("book4")
                .author("author4")
                .price(60000.0)
                .discount(BigDecimal.valueOf(0.3))
                .amount((short) 111)
                .build();

        Book savedBook = bookRepo.save(book);

        assertNotNull(savedBook);
        assertNotNull(savedBook.getId());
    }

    @Test
    public void whenUpdateBook_ThenReturnBook() {
        Book foundBook = bookRepo.findById(book.getId()).orElse(null);

        assertNotNull(foundBook);
        foundBook.setTitle("tset");
        foundBook.setDescription("description");

        Book updatedBook = bookRepo.save(foundBook);

        assertNotNull(updatedBook);
        assertNotNull(updatedBook.getDescription());
        assertEquals("tset", updatedBook.getTitle());
    }

    @Test
    public void whenDeleteBook_ThenFindNull() {
        bookRepo.deleteById(book.getId());

        Book foundBook = bookRepo.findById(book.getId()).orElse(null);

        assertNull(foundBook);
    }

    @Test
    public void whenFindBooksWithFilter_ThenReturnBooks() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<IBookDisplay> foundBooks = bookRepo.findBooksWithFilter(
                "book",
                null,
                null,
                null,
                null,
                null,
                0.0,
                1000000.0,
                false,
                0,
                0,
                pageable);

        assertNotNull(foundBooks);
        assertEquals(2, foundBooks.getContent().size());
    }

    @Test
    public void whenFindRandomBooks_ThenReturnBooks() {
        List<IBookDisplay> books = bookRepo.findRandomBooks(1, false);

        assertNotNull(books);
        assertEquals(1, books.size());
    }

    @Test
    public void whenFindBookIdsByInIdsAndOwner_ThenReturnIds() {
        List<Book> foundBooks = bookRepo.findAll();
        List<Long> foundIds = foundBooks.stream().map(Book::getId).collect(Collectors.toList());

        List<Long> bookIds = bookRepo.findBookIdsByInIdsAndOwner(foundIds, account.getId());

        assertNotNull(bookIds);
        assertEquals(foundIds.size(), bookIds.size());
    }

    @Test
    public void whenFindBooksDisplayInIds_ThenReturnBooks() {
        List<Book> foundBooks = bookRepo.findAll();
        List<Long> foundIds = foundBooks.stream().map(Book::getId).collect(Collectors.toList());
        foundIds.remove(0);

        List<IBookDisplay> books = bookRepo.findBooksDisplayInIds(foundIds);

        assertNotNull(books);
        assertEquals(2, books.size());
    }

    @Test
    public void whenFindInverseIds_ThenReturnIds() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<IBookDisplay> foundBooks = bookRepo.findBooksWithFilter(
                "",
                null,
                null,
                null,
                null,
                null,
                0.0,
                1000000.0,
                false,
                0,
                0,
                pageable);
        List<Long> foundIds = foundBooks.getContent().stream().map(IBookDisplay::getId).collect(Collectors.toList());
        foundIds.remove(0);

        List<Long> inverseIds = bookRepo.findInverseIds(
                "",
                null,
                null,
                null,
                null,
                null,
                0.0,
                1000000.0,
                0,
                0,
                foundIds);

        assertNotNull(inverseIds);
        assertEquals(foundBooks.getTotalElements() - foundIds.size(), inverseIds.size());
    }

    @Test
    public void whenGetBookAnalytics_ThenReturnStats() {
        IStat foundData = bookRepo.getBookAnalytics(null);

        assertNotNull(foundData);
        assertEquals(3, foundData.getTotal());
        assertEquals(2, foundData.getLastMonth());
        assertEquals(1, foundData.getCurrentMonth());
    }

    @Test
    public void whenFindSuggestion_ThenReturnKeywords() {
        List<String> suggestions = bookRepo.findSuggestion("ko");

        assertNotNull(suggestions);
        assertFalse(suggestions.isEmpty());
    }

    @Test
    public void whenDecreaseStock_ThenReduceAmount() {
        bookRepo.decreaseStock(book.getId(), (short) 5);
        entityManager.flush(); // Force changes to be written
        entityManager.clear(); // Clear persistence context to fetch fresh data

        Book foundBook = bookRepo.findById(book.getId()).orElse(null);

        assertNotNull(foundBook);
        assertNotEquals(88, (short) foundBook.getAmount());
    }
}