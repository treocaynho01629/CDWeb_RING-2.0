package com.ring.bookstore.repository;

import com.ring.bookstore.base.AbstractRepositoryTest;
import com.ring.bookstore.model.entity.Book;
import com.ring.bookstore.model.entity.Category;
import com.ring.bookstore.model.entity.Image;
import com.ring.bookstore.model.entity.Publisher;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
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

class PublisherRepositoryTest extends AbstractRepositoryTest {

    @Autowired
    private PublisherRepository pubRepo;

    @Autowired
    private CategoryRepository cateRepo;

    @Autowired
    private BookRepository bookRepo;

    @Autowired
    private ImageRepository imageRepo;

    @PersistenceContext
    private EntityManager entityManager;

    private Category cate;
    private Publisher pub;
    private Image pubImage;

    @BeforeEach
    void setUp() {
        Image image = Image.builder().publicId("image").build();
        Image image2 = Image.builder().publicId("image2").build();
        Image image3 = Image.builder().publicId("image3").build();
        pubImage = Image.builder().publicId("pubImage").build();

        pub = Publisher.builder().name("test").image(pubImage).build();
        Publisher pub2 = Publisher.builder().name("test2").build();
        Publisher pub3 = Publisher.builder().name("test3").build();
        pubRepo.saveAll(new ArrayList<>(List.of(pub, pub2, pub3)));

        cate = Category.builder().name("test").slug("test").build();
        Category savedCate = cateRepo.save(cate);
        Category cate2 = Category.builder()
                .name("testChild")
                .slug("slug")
                .parent(savedCate)
                .build();
        cateRepo.save(cate2);

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
        List<Book> books = new ArrayList<>(List.of(book, book2, book3));
        bookRepo.saveAll(books);

        entityManager.flush();
        entityManager.clear();
    }

    @Test
    public void givenNewPublisher_whenSavePublisher_ThenReturnPublisher() {

        // Given
        Publisher pub = Publisher.builder()
                .name("NXBKimDong")
                .build();

        // When
        Publisher savedPub = pubRepo.save(pub);

        // Then
        assertNotNull(savedPub);
        assertNotNull(savedPub.getId());
    }

    @Test
    public void whenUpdatePublisher_ThenReturnUpdatedPublisher() {

        // Given
        Publisher foundPub = pubRepo.findById(pub.getId()).orElse(null);
        assertNotNull(foundPub);

        // When
        foundPub.setName("aaa");
        foundPub.setImage(Image.builder().name("testimage").build());

        Publisher updatedPub = pubRepo.save(foundPub);

        // Then
        assertNotNull(updatedPub);
        assertNotNull(updatedPub.getImage());
        assertEquals("aaa", updatedPub.getName());
    }

    @Test
    public void whenDeletePublisher_ThenFindNull() {

        // When
        pubRepo.deleteById(pub.getId());

        // Then
        Publisher foundPub = pubRepo.findById(pub.getId()).orElse(null);
        Image foundImage = imageRepo.findById(pubImage.getId()).orElse(null);
        List<Book> foundBooks = bookRepo.findAll();

        assertNull(foundPub);
        assertNull(foundImage);
        assertNotNull(foundBooks);
        assertEquals(3, foundBooks.size());
    }

    @Test
    public void whenFindPublishers_ThenReturnPublishers() {

        // When
        Pageable pageable = PageRequest.of(0, 10);
        Page<Publisher> foundPubs = pubRepo.findPublishers(pageable);

        // Then
        assertNotNull(foundPubs);
        assertEquals(3, foundPubs.getTotalElements());
    }

    @Test
    public void findRelevantPublishers_ThenReturnCorrectPublishers() {

        // When
        Pageable pageable = PageRequest.of(0, 10);
        Page<Publisher> foundPubs = pubRepo.findRelevantPublishers(cate.getId(), pageable);

        // Then
        assertNotNull(foundPubs);
        assertEquals(2, foundPubs.getTotalElements());
    }

    @Test
    public void findPublisherWithImage_ThenReturnPublisher() {

        // When
        Publisher foundPub = pubRepo.findWithImageById(pub.getId()).orElse(null);

        // Then
        assertNotNull(foundPub);
        assertEquals(pub.getId(), foundPub.getId());
    }

    @Test
    public void findInversePublisherIds_ThenReturnIds() {

        // Given
        List<Publisher> pubs = pubRepo.findAll();
        List<Integer> ids = pubs.stream().map(Publisher::getId).collect(Collectors.toList());
        ids.remove(0);

        // When
        List<Integer> foundIds = pubRepo.findInverseIds(ids);

        // Then
        assertNotNull(foundIds);
        assertEquals(pubs.size() - ids.size(), foundIds.size());
    }
}