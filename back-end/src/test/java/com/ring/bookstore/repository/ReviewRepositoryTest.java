package com.ring.bookstore.repository;

import com.ring.bookstore.dtos.reviews.IReview;
import com.ring.bookstore.model.*;
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

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import static org.junit.jupiter.api.Assertions.*;

@Testcontainers
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class ReviewRepositoryTest {

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine");

    @Autowired
    private ReviewRepository reviewRepo;

    @Autowired
    private BookRepository bookRepo;

    @Autowired
    private AccountRepository accountRepo;

    private Account account;
    private Book book;
    private Review review;

    @BeforeEach
    void setUp() {
        account = Account.builder()
                .username("initial")
                .pass("asd")
                .email("initialEmail@initial.com")
                .build();
        Account account2 = Account.builder()
                .username("test")
                .pass("test")
                .email("test@test.com")
                .build();
        account.setCreatedDate(LocalDateTime.now());
        account2.setCreatedDate(LocalDateTime.now());
        List<Account> accounts = List.of(account, account2);
        accountRepo.saveAll(accounts);

        Image image = Image.builder().name("image").build();
        Image image2 = Image.builder().name("image2").build();

        book = Book.builder()
                .image(image)
                .build();
        Book book2 = Book.builder()
                .image(image2)
                .build();
        book.setCreatedDate(LocalDateTime.now());
        book2.setCreatedDate(LocalDateTime.now());
        List<Book> books = List.of(book, book2);
        bookRepo.saveAll(books);

        review = Review.builder()
                .book(book)
                .user(account)
                .rating(5)
                .rContent("test")
                .build();
        Review review2 = Review.builder()
                .book(book2)
                .user(account)
                .rating(2)
                .rContent("test")
                .build();
        Review review3 = Review.builder()
                .book(book2)
                .user(account2)
                .rating(3)
                .rContent("test")
                .build();
        review.setCreatedDate(LocalDateTime.now());
        review2.setCreatedDate(LocalDateTime.now());
        review3.setCreatedDate(LocalDateTime.now());
        List<Review> reviews = List.of(review, review2, review3);
        reviewRepo.saveAll(reviews);
    }

    @Test
    public void givenNewReview_whenSaveReview_ThenReturnReview() {
        Review review = Review.builder()
                .book(book)
                .user(account)
                .rating(2)
                .build();

        Review savedReview = reviewRepo.save(review);

        assertNotNull(savedReview);
        assertNotNull(savedReview.getId());
    }

    @Test
    public void whenUpdateReview_ThenReturnUpdatedReview() {
        Review foundReview = reviewRepo.findById(review.getId()).orElse(null);
        assertNotNull(foundReview);

        foundReview.setRating(4);
        foundReview.setRContent("asd");

        Review updatedReview = reviewRepo.save(foundReview);

        assertNotNull(updatedReview);
        assertEquals("asd", updatedReview.getRContent());
        assertEquals(4, updatedReview.getRating());
    }

    @Test
    public void whenDeleteReview_ThenFindNull() {
        reviewRepo.deleteById(review.getId());

        Review foundReview = reviewRepo.findById(review.getId()).orElse(null);

        assertNull(foundReview);
    }

    @Test
    public void whenFindReviews_ThenReturnReviews() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<IReview> foundReviews = reviewRepo.findReviews(
                book.getId(),
                null,
                null,
                "",
                pageable);

        assertNotNull(foundReviews);
        assertEquals(1, foundReviews.getContent().size());
    }

    @Test
    public void whenFindInverseIds_ThenReturnIds() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<IReview> reviews = reviewRepo.findReviews(
                null,
                account.getId(),
                null,
                "",
                pageable);
        List<Long> ids = reviews.getContent().stream().map(projection -> projection.getReview().getId()).collect(Collectors.toList());
        ids.remove(0);

        List<Long> inverseIds = reviewRepo.findInverseIds(
                null,
                account.getId(),
                null,
                "",
                ids);

        assertNotNull(inverseIds);
        assertEquals(reviews.getTotalElements() - ids.size(), inverseIds.size());
    }

    @Test
    public void whenFindReviewsByBookId_ThenReturnReviews() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<IReview> foundReviews = reviewRepo.findReviewsByBookId(
                book.getId(),
                null,
                pageable);

        assertNotNull(foundReviews);
        assertEquals(1, foundReviews.getContent().size());
    }

    @Test
    public void whenFindUserReviews_ThenReturnReviews() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<IReview> reviews = reviewRepo.findUserReviews(
                account.getId(),
                5,
                pageable);

        assertNotNull(reviews);
        assertEquals(1, reviews.getContent().size());
    }

    @Test
    public void whenFindUserBookReview_ThenReturnReview() {
        IReview review = reviewRepo.findUserBookReview(book.getId(), account.getId()).orElse(null);

        assertNotNull(review);
        assertEquals(book.getId(), review.getBookId());
        assertEquals(account.getId(), review.getUserId());
    }
}