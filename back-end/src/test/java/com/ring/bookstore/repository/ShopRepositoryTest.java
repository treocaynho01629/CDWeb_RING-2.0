package com.ring.bookstore.repository;

import com.ring.bookstore.base.AbstractRepositoryTest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

class ShopRepositoryTest extends AbstractRepositoryTest {

    @Autowired
    private ShopRepository shopRepo;

    @Test
    public void whenFindShopsDisplay_ThenReturnProperResults() {
        // Setup test data
        // Example: Save specific Shop, User, and Image entities relevant to the query
        // Then use this test to verify the returned data matches the saved entities

    }

    @Test
    public void givenFollowedShops_whenFindShopsDisplay_ThenReturnFollowedShops() {
        // Setup test data with followed accounts
        // Use the query to filter for followed shops, and assert expected results

    }

    @Test
    public void givenUnfollowedShops_whenFindShopsDisplay_ThenReturnUnfollowedShops() {
        // Setup test data with unfollowed accounts
        // Use the query to filter for unfollowed shops, and assert expected results
    }

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