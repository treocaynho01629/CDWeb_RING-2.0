package com.ring.bookstore.repository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

@Testcontainers
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class ShopRepositoryTest {

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine");

    @Autowired
    private ShopRepository shopRepo;

//    @BeforeEach
//    void setUp() {
//        account = Account.builder()
//                .username("initial")
//                .pass("asd")
//                .email("initialEmail@initial.com")
//                .build();
//        Account account2 = Account.builder()
//                .username("test")
//                .pass("test")
//                .email("test@test.com")
//                .build();
//        account.setCreatedDate(LocalDateTime.now());
//        account2.setCreatedDate(LocalDateTime.now());
//        List<Account> accounts = List.of(account, account2);
//        accountRepo.saveAll(accounts);
//
//        Image image = Image.builder().name("image").build();
//        Image image2 = Image.builder().name("image2").build();
//
//        book = Book.builder()
//                .image(image)
//                .build();
//        Book book2 = Book.builder()
//                .image(image2)
//                .build();
//        book.setCreatedDate(LocalDateTime.now());
//        book2.setCreatedDate(LocalDateTime.now());
//        List<Book> books = List.of(book, book2);
//        bookRepo.saveAll(books);
//
//        shop = Shop.builder()
//                .book(book)
//                .user(account)
//                .rating(5)
//                .build();
//        Shop shop2 = Shop.builder()
//                .book(book2)
//                .user(account)
//                .rating(2)
//                .build();
//        Shop shop3 = Shop.builder()
//                .book(book2)
//                .user(account2)
//                .rating(3)
//                .build();
//        shop.setCreatedDate(LocalDateTime.now());
//        shop2.setCreatedDate(LocalDateTime.now());
//        shop3.setCreatedDate(LocalDateTime.now());
//        List<Shop> shops = List.of(shop, shop2, shop3);
//        shopRepo.saveAll(shops);
//    }
//
//    @Test
//    public void givenNewShop_whenSaveShop_ThenReturnShop() {
//        Shop shop = Shop.builder()
//                .book(book)
//                .user(account)
//                .rating(2)
//                .build();
//
//        Shop savedShop = shopRepo.save(shop);
//
//        assertNotNull(savedShop);
//        assertNotNull(savedShop.getId());
//    }
//
//    @Test
//    public void whenUpdateShop_ThenReturnUpdatedShop() {
//        Shop foundShop = shopRepo.findById(shop.getId()).orElse(null);
//        assertNotNull(foundShop);
//
//        foundShop.setRating(4);
//        foundShop.setRContent("test");
//
//        Shop updatedShop = shopRepo.save(foundShop);
//
//        assertNotNull(updatedShop);
//        assertNotNull(updatedShop.getRContent());
//        assertEquals(4, updatedShop.getRating());
//    }
//
//    @Test
//    public void whenDeleteShop_ThenFindNull() {
//        shopRepo.deleteById(shop.getId());
//
//        Shop foundShop = shopRepo.findById(shop.getId()).orElse(null);
//
//        assertNull(foundShop);
//    }
}