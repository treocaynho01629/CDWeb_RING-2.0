package com.ring.bookstore.repository;

import com.ring.bookstore.model.entity.Book;
import com.ring.bookstore.model.entity.Category;
import com.ring.bookstore.model.entity.Image;
import com.ring.bookstore.model.entity.Publisher;
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

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import static org.junit.jupiter.api.Assertions.*;

@Testcontainers
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class PublisherRepositoryTest {

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine");

    @Autowired
    private PublisherRepository pubRepo;

    @Autowired
    private CategoryRepository cateRepo;

    @Autowired
    private BookRepository bookRepo;

    @PersistenceContext
    private EntityManager entityManager;

    private Category cate;
    private Publisher pub;

    @BeforeEach
    void setUp() {
        pub = Publisher.builder()
                .name("test")
                .build();
        Publisher pub2 = Publisher.builder()
                .name("test2")
                .build();
        Publisher pub3 = Publisher.builder()
                .name("test3")
                .build();
        pubRepo.saveAll(List.of(pub, pub2, pub3));

        cate = Category.builder()
                .name("test")
                .slug("test")
                .build();
        Category savedCate = cateRepo.save(cate);
        Category cate2 = Category.builder()
                .name("testChild")
                .slug("slug")
                .parent(savedCate)
                .build();
        cateRepo.save(cate2);

        Image image = Image.builder().publicId("image").build();
        Image image2 = Image.builder().publicId("image2").build();
        Image image3 = Image.builder().publicId("image3").build();

        Book book = Book.builder()
                .image(image)
                .cate(cate)
                .publisher(pub)
                .build();
        Book book2 = Book.builder()
                .image(image2)
                .cate(cate)
                .publisher(pub)
                .build();
        Book book3 = Book.builder()
                .image(image3)
                .cate(cate2)
                .publisher(pub3)
                .build();
        book.setCreatedDate(LocalDateTime.now());
        book2.setCreatedDate(LocalDateTime.now());
        book3.setCreatedDate(LocalDateTime.now());
        List<Book> books = List.of(book, book2, book3);
        bookRepo.saveAll(books);

        entityManager.flush();
        entityManager.clear();
    }

    @Test
    public void givenNewPublisher_whenSavePublisher_ThenReturnPublisher() {
        Publisher pub = Publisher.builder()
                .name("NXBKimDong")
                .build();

        Publisher savedPub = pubRepo.save(pub);

        assertNotNull(savedPub);
        assertNotNull(savedPub.getId());
    }

    @Test
    public void whenUpdatePublisher_ThenReturnUpdatedPublisher() {
        Publisher foundPub = pubRepo.findById(pub.getId()).orElse(null);
        assertNotNull(foundPub);
        foundPub.setName("aaa");
        foundPub.setImage(Image.builder().name("testimage").build());

        Publisher updatedPub = pubRepo.save(foundPub);

        assertNotNull(updatedPub);
        assertNotNull(updatedPub.getImage());
        assertEquals("aaa", updatedPub.getName());
    }

    @Test
    public void whenDeletePublisher_ThenFindNull() {
        pubRepo.deleteById(pub.getId());

        Publisher foundPub = pubRepo.findById(pub.getId()).orElse(null);

        assertNull(foundPub);
    }

    @Test
    public void whenFindPublishers_ThenReturnPublishers() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Publisher> foundPubs = pubRepo.findPublishers(pageable);

        assertNotNull(foundPubs);
        assertEquals(3, foundPubs.getTotalElements());
    }

    @Test
    public void findRelevantPublishers_ThenReturnCorrectPublishers() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Publisher> foundPubs = pubRepo.findRelevantPublishers(cate.getId(), pageable);

        assertNotNull(foundPubs);
        assertEquals(2, foundPubs.getTotalElements());
    }

    @Test
    public void findPublisherWithImage_ThenReturnPublisher() {
        Publisher foundPub = pubRepo.findWithImageById(pub.getId()).orElse(null);

        assertNotNull(foundPub);
        assertEquals(pub.getId(), foundPub.getId());
    }

    @Test
    public void findInversePublisherIds_ThenReturnIds() {
        List<Publisher> pubs = pubRepo.findAll();
        List<Integer> ids = pubs.stream().map(Publisher::getId).collect(Collectors.toList());
        ids.remove(0);

        List<Integer> foundIds = pubRepo.findInverseIds(ids);

        assertNotNull(foundIds);
        assertEquals(pubs.size() - ids.size(), foundIds.size());
    }
}