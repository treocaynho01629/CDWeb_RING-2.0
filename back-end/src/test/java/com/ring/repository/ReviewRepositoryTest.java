package com.ring.repository;

import com.ring.base.AbstractRepositoryTest;
import com.ring.dto.projection.reviews.IReview;
import com.ring.model.entity.Account;
import com.ring.model.entity.Book;
import com.ring.model.entity.Image;
import com.ring.model.entity.Review;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import static org.junit.jupiter.api.Assertions.*;

class ReviewRepositoryTest extends AbstractRepositoryTest {

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
                List<Account> accounts = new ArrayList<>(List.of(account, account2));
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
                List<Book> books = new ArrayList<>(List.of(book, book2));
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
                List<Review> reviews = new ArrayList<>(List.of(review, review2, review3));
                reviewRepo.saveAll(reviews);
        }

        @Test
        public void givenNewReview_whenSaveReview_ThenReturnReview() {

                // Given
                Review review = Review.builder()
                                .book(book)
                                .user(account)
                                .rating(2)
                                .build();

                // When
                Review savedReview = reviewRepo.save(review);

                // Then
                assertNotNull(savedReview);
                assertNotNull(savedReview.getId());
        }

        @Test
        public void whenUpdateReview_ThenReturnUpdatedReview() {

                // Given
                Review foundReview = reviewRepo.findById(review.getId()).orElse(null);
                assertNotNull(foundReview);

                // When
                foundReview.setRating(4);
                foundReview.setRContent("asd");

                Review updatedReview = reviewRepo.save(foundReview);

                // Then
                assertNotNull(updatedReview);
                assertEquals("asd", updatedReview.getRContent());
                assertEquals(4, updatedReview.getRating());
        }

        @Test
        public void whenDeleteReview_ThenFindNull() {

                // Given
                reviewRepo.deleteById(review.getId());

                // When
                Review foundReview = reviewRepo.findById(review.getId()).orElse(null);
                Book foundBook = bookRepo.findById(book.getId()).orElse(null);
                Account foundAccount = accountRepo.findById(account.getId()).orElse(null);

                // Then
                assertNull(foundReview);
                assertNotNull(foundBook);
                assertNotNull(foundAccount);
        }

        @Test
        public void whenFindReviews_ThenReturnReviews() {

                // When
                Pageable pageable = PageRequest.of(0, 10);
                Page<IReview> foundReviews = reviewRepo.findReviews(
                                book.getId(),
                                null,
                                null,
                                "",
                                pageable);

                // Then
                assertNotNull(foundReviews);
                assertEquals(1, foundReviews.getContent().size());
        }

        @Test
        public void whenFindInverseIds_ThenReturnIds() {

                // Given
                Pageable pageable = PageRequest.of(0, 10);
                Page<IReview> reviews = reviewRepo.findReviews(
                                null,
                                account.getId(),
                                null,
                                "",
                                pageable);
                List<Long> ids = reviews.getContent().stream().map(projection -> projection.getReview().getId())
                                .collect(Collectors.toList());
                ids.remove(0);

                // When
                List<Long> inverseIds = reviewRepo.findInverseIds(
                                null,
                                account.getId(),
                                null,
                                "",
                                ids);

                // Then
                assertNotNull(inverseIds);
                assertEquals(reviews.getTotalElements() - ids.size(), inverseIds.size());
        }

        @Test
        public void whenFindReviewsByBookId_ThenReturnReviews() {

                // When
                Pageable pageable = PageRequest.of(0, 10);
                Page<IReview> foundReviews = reviewRepo.findReviewsByBookId(
                                book.getId(),
                                null,
                                pageable);

                // Then
                assertNotNull(foundReviews);
                assertEquals(1, foundReviews.getContent().size());
        }

        @Test
        public void whenFindUserReviews_ThenReturnReviews() {

                // When
                Pageable pageable = PageRequest.of(0, 10);
                Page<IReview> reviews = reviewRepo.findUserReviews(
                                account.getId(),
                                5,
                                pageable);

                // Then
                assertNotNull(reviews);
                assertEquals(1, reviews.getContent().size());
        }

        @Test
        public void whenFindUserBookReview_ThenReturnReview() {

                // When
                IReview review = reviewRepo.findUserBookReview(book.getId(), account.getId()).orElse(null);

                // Then
                assertNotNull(review);
                assertEquals(book.getId(), review.getBookId());
                assertEquals(account.getId(), review.getUserId());
        }
}