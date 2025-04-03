package com.ring.bookstore.repository;

import com.ring.bookstore.dtos.banners.IBanner;
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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import static org.junit.jupiter.api.Assertions.*;

@Testcontainers
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class BannerRepositoryTest {

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine");

    @Autowired
    private BannerRepository bannerRepo;

    @Autowired
    private ShopRepository shopRepo;

    @Autowired
    private AccountRepository accountRepo;

    private Banner banner;

    @BeforeEach
    void setUp() {
        Account account = Account.builder()
                .username("initial")
                .pass("asd")
                .email("initialEmail@initial.com")
                .build();
        account.setCreatedDate(LocalDateTime.now());
        Account savedAccount = accountRepo.save(account);

        Shop shop = Shop.builder().owner(savedAccount).build();
        shop.setCreatedDate(LocalDateTime.now());
        Shop savedShop = shopRepo.save(shop);

        Image image = Image.builder().name("image").build();
        Image image2 = Image.builder().name("image2").build();
        Image image3 = Image.builder().name("image3").build();

        banner = Banner.builder()
                .name("banner1")
                .description("test")
                .image(image)
                .build();
        Banner banner2 = Banner.builder()
                .name("banner2")
                .description("test")
                .image(image2)
                .build();
        Banner banner3 = Banner.builder()
                .name("banner3")
                .description("test")
                .image(image3)
                .shop(savedShop)
                .build();
        List<Banner> banners = List.of(banner, banner2, banner3);
        bannerRepo.saveAll(banners);
    }

    @Test
    public void givenNewBanner_whenSaveBanner_ThenReturnBanner() {
        Image image = Image.builder().build();
        Banner banner = Banner.builder()
                .name("banner4")
                .image(image)
                .build();

        Banner savedBanner = bannerRepo.save(banner);

        assertNotNull(savedBanner);
        assertNotNull(savedBanner.getId());
    }

    @Test
    public void whenUpdateBanner_ThenReturnBanner() {
        Banner foundBanner = bannerRepo.findById(banner.getId()).orElse(null);

        assertNotNull(foundBanner);
        foundBanner.setDescription("tset");
        foundBanner.setUrl("/");

        Banner updatedBanner = bannerRepo.save(foundBanner);

        assertNotNull(updatedBanner);
        assertNotNull(updatedBanner.getUrl());
        assertEquals("tset", updatedBanner.getDescription());
    }

    @Test
    public void whenDeleteBanner_ThenFindNull() {
        bannerRepo.deleteById(banner.getId());

        Banner foundBanner = bannerRepo.findById(banner.getId()).orElse(null);

        assertNull(foundBanner);
    }

    @Test
    public void whenFindBanners_ThenReturnPagedResult() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<IBanner> banners = bannerRepo.findBanners("banner", null, null, pageable);

        Shop foundShop = shopRepo.findAll().get(0);
        Page<IBanner> banners2 = bannerRepo.findBanners("", foundShop.getId(), null, pageable);

        assertNotNull(banners);
        assertNotNull(banners2);
        assertEquals(3, banners.getContent().size());
        assertEquals(1, banners2.getContent().size());
    }

    @Test
    public void whenFindInverseIds_ThenReturnCorrectSize() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<IBanner> foundBanners = bannerRepo.findBanners("", null, null, pageable);
        List<Integer> foundIds = foundBanners.getContent().stream().map(IBanner::getId).collect(Collectors.toList());
        foundIds.remove(0);

        List<Integer> inverseIds = bannerRepo.findInverseIds("", null, null, null, foundIds);

        assertNotNull(inverseIds);
        assertEquals(foundBanners.getTotalElements() - foundIds.size(), inverseIds.size());
    }

    @Test
    public void whenFindBannerIdsByInIdsAndOwner_ThenReturnIds() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<IBanner> foundBanners = bannerRepo.findBanners("", null, null, pageable);
        List<Integer> foundIds = foundBanners.getContent().stream().map(IBanner::getId).collect(Collectors.toList());

        Account account = accountRepo.findByEmail("initialEmail@initial.com").orElse(null);
        assertNotNull(account);
        List<Integer> bannerIds = bannerRepo.findBannerIdsByInIdsAndOwner(foundIds, account.getId());

        assertNotNull(bannerIds);
        assertEquals(1, bannerIds.size());
    }
}