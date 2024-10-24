package com.ring.bookstore.controller;

import com.ring.bookstore.config.CurrentAccount;
import com.ring.bookstore.model.Account;
import com.ring.bookstore.request.BannerRequest;
import com.ring.bookstore.service.BannerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/banners")
@RequiredArgsConstructor
public class BannerController {

    private final BannerService bannerService;

    //Get banners
    @GetMapping
    public ResponseEntity<?> getBanners(@RequestParam(value = "shopId", required = false) Long shopId,
                                        @RequestParam(value = "byShop", required=false) Boolean byShop,
                                        @RequestParam(value = "keyword", defaultValue = "") String keyword,
                                        @RequestParam(value = "pSize", defaultValue = "5") Integer pageSize,
                                        @RequestParam(value = "pageNo", defaultValue = "0") Integer pageNo,
                                        @RequestParam(value = "sortBy", defaultValue = "id") String sortBy,
                                        @RequestParam(value = "sortDir", defaultValue = "asc") String sortDir) {
        return new ResponseEntity<>(bannerService.getBanners(pageNo, pageSize, sortBy, sortDir, keyword, shopId, byShop), HttpStatus.OK);
    }

    //Add banner
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','SELLER')")
    public ResponseEntity<?> createBanner(@Valid @RequestPart("request") BannerRequest request,
                                          @CurrentAccount Account currUser) {
        return new ResponseEntity<>(bannerService.addBanner(request, currUser), HttpStatus.CREATED);
    }

    //Update banner by id
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SELLER')")
    public ResponseEntity<?> updateBanner(@PathVariable("id") Long id,
                                          @Valid @RequestPart("request") BannerRequest request,
                                          @CurrentAccount Account currUser) {
        return new ResponseEntity<>(bannerService.updateBanner(id, request, currUser), HttpStatus.CREATED);
    }

    //Delete banner
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SELLER')")
    public ResponseEntity<?> deleteBanner(@PathVariable("id") Long id, @CurrentAccount Account currUser) {
        return new ResponseEntity<>(bannerService.deleteBanner(id, currUser), HttpStatus.OK);
    }

    //Delete multiples banners in a lists of {ids}
    @DeleteMapping("/delete-multiples")
    @PreAuthorize("hasAnyRole('ADMIN','SELLER')")
    public ResponseEntity<?> deleteBanners(@RequestParam(value = "shopId", required = false) Long shopId,
                                           @RequestParam(value = "byShop", required=false) Boolean byShop,
                                           @RequestParam(value = "keyword", defaultValue = "") String keyword,
                                           @RequestParam("ids") List<Long> ids,
                                           @RequestParam(value = "isInverse", defaultValue = "false") Boolean isInverse,
                                           @CurrentAccount Account currUser
    ) {
        bannerService.deleteBanners(keyword, shopId, byShop, ids, isInverse, currUser);
        return new ResponseEntity<>("Banners deleted successfully!", HttpStatus.OK);
    }

    //Delete all banners
    @DeleteMapping("/delete-all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteAllBanners() {
        bannerService.deleteAllBanners();
        return new ResponseEntity<>("All banners deleted successfully!", HttpStatus.OK);
    }
}
