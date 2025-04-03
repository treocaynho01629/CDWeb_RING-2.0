package com.ring.bookstore.repository;

import com.ring.bookstore.dtos.images.IImage;
import com.ring.bookstore.model.*;
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
import java.util.stream.Collectors;

import static org.junit.jupiter.api.Assertions.*;

@Testcontainers
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class ImageRepositoryTest {

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine");

    @Autowired
    private ImageRepository imageRepo;

    @Autowired
    private AccountProfileRepository profileRepo;

    @Autowired
    private BookRepository bookRepo;

    private Image image;
    private AccountProfile profile;
    private Book book;

    @BeforeEach
    void setUp() {
        image = Image.builder().name("image").publicId("image").build();
        Image image2 = Image.builder().name("image2").publicId("image2").build();
        Image image3 = Image.builder().name("image3").publicId("image3").build();
        List<Image> images = List.of(image, image2, image3);
        imageRepo.saveAll(images);

        Account account = Account.builder()
                .username("username")
                .pass("asd")
                .email("email")
                .build();
        account.setCreatedDate(LocalDateTime.now());
        profile = AccountProfile.builder()
                .dob(LocalDate.now())
                .user(account)
                .image(image2)
                .build();
        AccountProfile savedProfile = profileRepo.save(profile);

        book = Book.builder()
                .image(image)
                .slug("test")
                .title("book")
                .author("author")
                .price(10000.0)
                .discount(BigDecimal.valueOf(0))
                .amount((short) 88)
                .build();
        book.setCreatedDate(LocalDateTime.now());
        bookRepo.save(book);
    }

    @Test
    public void givenNewImage_whenSaveImage_ThenReturnImage() {
        Image image = Image.builder().name("test").build();

        Image savedImage = imageRepo.save(image);

        assertNotNull(savedImage);
        assertNotNull(savedImage.getId());
    }

    @Test
    public void whenUpdateImage_ThenReturnImage() {
        Image foundImage = imageRepo.findById(image.getId()).orElse(null);

        assertNotNull(foundImage);
        foundImage.setName("test");
        foundImage.setUrl("test.com");

        Image updatedImage = imageRepo.save(foundImage);

        assertNotNull(updatedImage);
        assertNotNull(updatedImage.getUrl());
        assertEquals("test", updatedImage.getName());
    }

    @Test
    public void whenDeleteImage_ThenFindNull() {
        imageRepo.deleteById(image.getId());

        Image foundImage = imageRepo.findById(image.getId()).orElse(null);

        assertNull(foundImage);
    }

    @Test
    public void whenFindPublicIds_ThenReturnPublicIds() {
        List<Image> images = imageRepo.findAll();
        List<Long> ids = images.stream().map(Image::getId).collect(Collectors.toList());

        List<String> foundPublicIds = imageRepo.findPublicIds(ids);

        assertNotNull(foundPublicIds);
        assertFalse(foundPublicIds.isEmpty());
    }

    @Test
    public void whenFindImagesByIds_ThenReturnImages() {
        List<Image> images = imageRepo.findAll();
        List<Long> ids = images.stream().map(Image::getId).collect(Collectors.toList());
        ids.remove(0);

        List<Image> foundImages = imageRepo.findImages(ids);

        assertNotNull(foundImages);
        assertEquals(2, foundImages.size());
    }

    @Test
    public void whenFindByProfile_ThenReturnImageDetails() {
        IImage foundImage = imageRepo.findByProfile(profile.getId()).orElse(null);

        assertNotNull(foundImage);
        assertEquals(profile.getImage().getPublicId(), foundImage.getPublicId());
    }

    @Test
    public void whenFindBookImage_ThenReturnImage() {
        Image foundImage = imageRepo.findBookImage(book.getId(), image.getId()).orElse(null);

        assertNotNull(foundImage);
        assertEquals(book.getImage().getId(), foundImage.getId());
    }

    @Test
    public void whenFindBookImagePublicIds_ThenReturnPublicIds() {
        List<String> foundPublicIds = imageRepo.findBookImagePublicIds(book.getId(), List.of(image.getId()));

        assertNotNull(foundPublicIds);
        assertEquals(1, foundPublicIds.size());
    }
}