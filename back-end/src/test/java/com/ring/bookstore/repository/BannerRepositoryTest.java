package com.ring.bookstore.repository;

import com.ring.bookstore.base.AbstractRepositoryTest;
import com.ring.bookstore.model.dto.projection.banners.IBanner;
import com.ring.bookstore.model.entity.Account;
import com.ring.bookstore.model.entity.Banner;
import com.ring.bookstore.model.entity.Image;
import com.ring.bookstore.model.entity.Shop;
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

class BannerRepositoryTest extends AbstractRepositoryTest {

    @Autowired
    private BannerRepository bannerRepo;

    @Autowired
    private ShopRepository shopRepo;

    @Autowired
    private ImageRepository imageRepo;

    @Autowired
    private AccountRepository accountRepo;

    private Banner banner;
    private Shop shop;
    private Image image;
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

        shop = Shop.builder().owner(savedAccount).build();
        shop.setCreatedDate(LocalDateTime.now());
        Shop savedShop = shopRepo.save(shop);

        image = Image.builder().name("image").build();
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
        List<Banner> banners = new ArrayList<>(List.of(banner, banner2, banner3));
        bannerRepo.saveAll(banners);
    }

    @Test
    public void givenNewBanner_whenSaveBanner_ThenReturnBanner() {

        // Given
        Image image = Image.builder().build();
        Banner banner = Banner.builder()
                .name("banner4")
                .image(image)
                .build();

        // When
        Banner savedBanner = bannerRepo.save(banner);

        // Then
        assertNotNull(savedBanner);
        assertNotNull(savedBanner.getId());
    }

    @Test
    public void whenUpdateBanner_ThenReturnBanner() {

        // Given
        Banner foundBanner = bannerRepo.findById(banner.getId()).orElse(null);
        assertNotNull(foundBanner);

        // When
        foundBanner.setDescription("tset");
        foundBanner.setUrl("/");

        Banner updatedBanner = bannerRepo.save(foundBanner);

        // Then
        assertNotNull(updatedBanner);
        assertNotNull(updatedBanner.getUrl());
        assertEquals("tset", updatedBanner.getDescription());
    }

    @Test
    public void whenDeleteBanner_ThenFindNull() {

        // When
        bannerRepo.deleteById(banner.getId());

        // Then
        Banner foundBanner = bannerRepo.findById(banner.getId()).orElse(null);
        Image foundImage = imageRepo.findById(image.getId()).orElse(null);
        Shop foundShop = shopRepo.findById(shop.getId()).orElse(null);

        assertNull(foundBanner);
        assertNull(foundImage);
        assertNotNull(foundShop);
    }

    @Test
    public void whenFindBanners_ThenReturnPagedResult() {

        // When
        Pageable pageable = PageRequest.of(0, 10);
        Page<IBanner> banners = bannerRepo.findBanners("banner", null, null, pageable);
        Page<IBanner> banners2 = bannerRepo.findBanners("", shop.getId(), null, pageable);

        // Then
        assertNotNull(banners);
        assertNotNull(banners2);
        assertEquals(3, banners.getContent().size());
        assertEquals(1, banners2.getContent().size());
    }

    @Test
    public void whenFindInverseIds_ThenReturnCorrectSize() {

        // Given
        Pageable pageable = PageRequest.of(0, 10);
        Page<IBanner> foundBanners = bannerRepo.findBanners("", null, null, pageable);
        List<Integer> foundIds = foundBanners.getContent().stream().map(IBanner::getId).collect(Collectors.toList());
        foundIds.remove(0);

        // When
        List<Integer> inverseIds = bannerRepo.findInverseIds("", null, null, null, foundIds);

        // Then
        assertNotNull(inverseIds);
        assertEquals(foundBanners.getTotalElements() - foundIds.size(), inverseIds.size());
    }

    @Test
    public void whenFindBannerIdsByInIdsAndOwner_ThenReturnIds() {

        // Given
        Pageable pageable = PageRequest.of(0, 10);
        Page<IBanner> foundBanners = bannerRepo.findBanners("", null, null, pageable);
        List<Integer> foundIds = foundBanners.getContent().stream().map(IBanner::getId).collect(Collectors.toList());

        // When
        List<Integer> bannerIds = bannerRepo.findBannerIdsByInIdsAndOwner(foundIds, account.getId());

        // Then
        assertNotNull(bannerIds);
        assertEquals(1, bannerIds.size());
    }
}