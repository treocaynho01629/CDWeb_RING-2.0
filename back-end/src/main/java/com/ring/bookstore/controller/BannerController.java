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
                                        @RequestParam(value = "sortDir", defaultValue = "desc") String sortDir) {
        return new ResponseEntity<>(bannerService.getBanners(pageNo, pageSize, sortBy, sortDir, keyword, shopId, byShop), HttpStatus.OK);
    }

    //Add banner
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','SELLER') and hasAuthority('CREATE_PRIVILEGE')")
    public ResponseEntity<?> createBanner(@Valid @RequestPart("request") BannerRequest request,
                                          @CurrentAccount Account currUser) {
        return new ResponseEntity<>(bannerService.addBanner(request, currUser), HttpStatus.CREATED);
    }

    //Update banner by id
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SELLER') and hasAuthority('UPDATE_PRIVILEGE')")
    public ResponseEntity<?> updateBanner(@PathVariable("id") Long id,
                                          @Valid @RequestPart("request") BannerRequest request,
                                          @CurrentAccount Account currUser) {
        return new ResponseEntity<>(bannerService.updateBanner(id, request, currUser), HttpStatus.CREATED);
    }

    //Delete banner
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SELLER') and hasAuthority('DELETE_PRIVILEGE')")
    public ResponseEntity<?> deleteBanner(@PathVariable("id") Long id, @CurrentAccount Account currUser) {
        return new ResponseEntity<>(bannerService.deleteBanner(id, currUser), HttpStatus.OK);
    }

    //Delete multiples banners in a lists of {ids}
    @DeleteMapping("/delete-multiples")
    @PreAuthorize("hasAnyRole('ADMIN','SELLER') and hasAuthority('DELETE_PRIVILEGE')")
    public ResponseEntity<?> deleteBanners(@RequestParam("ids") List<Long> ids,
                                           @CurrentAccount Account currUser
    ) {
        bannerService.deleteBanners(ids, currUser);
        return new ResponseEntity<>("Banners deleted successfully!", HttpStatus.OK);
    }

    //Delete multiple banners not in lists of {ids}
    @DeleteMapping("/delete-inverse")
    @PreAuthorize("hasAnyRole('ADMIN','SELLER') and hasAuthority('DELETE_PRIVILEGE')")
    public ResponseEntity<?> deleteCouponsInverse(@RequestParam(value = "shopId", required = false) Long shopId,
                                                  @RequestParam(value = "byShop", required=false) Boolean byShop,
                                                  @RequestParam(value = "keyword", defaultValue = "") String keyword,
                                                  @RequestParam("ids") List<Long> ids,
                                                  @CurrentAccount Account currUser) {
        bannerService.deleteBannersInverse(keyword, shopId, byShop, ids, currUser);
        return new ResponseEntity<>("Banners deleted successfully!", HttpStatus.OK);
    }

    //Delete all banners
    @DeleteMapping("/delete-all")
    @PreAuthorize("hasAnyRole('ADMIN','SELLER') and hasAuthority('DELETE_PRIVILEGE')")
    public ResponseEntity<?> deleteAllBanners(@RequestParam(value = "shopId", required = false) Long shopId,
                                              @CurrentAccount Account currUser) {
        bannerService.deleteAllBanners(shopId, currUser);
        return new ResponseEntity<>("All banners deleted successfully!", HttpStatus.OK);
    }
}
