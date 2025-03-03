package com.ring.bookstore.controller;

import com.ring.bookstore.config.CurrentAccount;
import com.ring.bookstore.enums.CouponType;
import com.ring.bookstore.exception.ImageResizerException;
import com.ring.bookstore.model.Account;
import com.ring.bookstore.request.ShopRequest;
import com.ring.bookstore.service.ShopService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/shops")
@RequiredArgsConstructor
public class ShopController {

    private final ShopService shopService;

    //Get shops
    @GetMapping("/find")
    public ResponseEntity<?> getDisplayShops(
            @RequestParam(value = "keyword", defaultValue = "") String keyword,
            @RequestParam(value = "pSize", defaultValue = "15") Integer pageSize,
            @RequestParam(value = "pageNo", defaultValue = "0") Integer pageNo,
            @RequestParam(value = "sortBy", defaultValue = "id") String sortBy,
            @RequestParam(value = "sortDir", defaultValue = "desc") String sortDir,
            @RequestParam(value = "followed", required = false) Boolean followed,
            @CurrentAccount Account currUser) {
        return new ResponseEntity<>(shopService.getDisplayShops(
                pageNo,
                pageSize,
                sortBy,
                sortDir,
                keyword,
                followed,
                currUser), HttpStatus.OK);
    }

    //Get shops
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','SELLER','GUEST') and hasAuthority('READ_PRIVILEGE')")
    public ResponseEntity<?> getShops(
            @RequestParam(value = "keyword", defaultValue = "") String keyword,
            @RequestParam(value = "pSize", defaultValue = "15") Integer pageSize,
            @RequestParam(value = "pageNo", defaultValue = "0") Integer pageNo,
            @RequestParam(value = "sortBy", defaultValue = "id") String sortBy,
            @RequestParam(value = "sortDir", defaultValue = "desc") String sortDir,
            @RequestParam(value = "userId", required = false) Long userId,
            @CurrentAccount Account currUser) {
        return new ResponseEntity<>(shopService.getShops(
                pageNo,
                pageSize,
                sortBy,
                sortDir,
                keyword,
                userId,
                currUser), HttpStatus.OK);
    }

    @GetMapping("/preview")
    @PreAuthorize("hasAnyRole('ADMIN','SELLER','GUEST') and hasAuthority('READ_PRIVILEGE')")
    public ResponseEntity<?> getPreviewShops(@CurrentAccount Account currUser) {
        return new ResponseEntity<>(shopService.getShopsPreview(currUser), HttpStatus.OK);
    }

    //Get shop by {id}
    @GetMapping("/{id}")
    public ResponseEntity<?> getShopInfo(@PathVariable("id") Long id,
                                         @CurrentAccount Account currUser) {
        return new ResponseEntity<>(shopService.getShopInfo(id, currUser), HttpStatus.OK);
    }

    //Get shop by {id}
    @GetMapping("/detail/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SELLER','GUEST') and hasAuthority('READ_PRIVILEGE')")
    public ResponseEntity<?> getShopDetail(@PathVariable("id") Long id,
                                         @CurrentAccount Account currUser) {
        return new ResponseEntity<>(shopService.getShopDetail(id, currUser), HttpStatus.OK);
    }

    @GetMapping("/analytics")
    @PreAuthorize("hasAnyRole('ADMIN','GUEST') and hasAuthority('READ_PRIVILEGE')")
    public ResponseEntity<?> getShopAnalytics() {
        return new ResponseEntity<>(shopService.getAnalytics(), HttpStatus.OK);
    }

    //Follow
    @PutMapping("/follow/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> followShop(@PathVariable("id") Long id,
                                        @CurrentAccount Account currUser) {
        shopService.follow(id, currUser);
        return new ResponseEntity<>("Shop followed successfully!", HttpStatus.CREATED);
    }

    //Unfollow
    @PutMapping("/unfollow/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> unfollowShop(@PathVariable("id") Long id,
                                        @CurrentAccount Account currUser) {
        shopService.unfollow(id, currUser);
        return new ResponseEntity<>("Shop unfollowed successfully!", HttpStatus.CREATED);
    }

    //Add shop
    @PostMapping(consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    @PreAuthorize("hasAnyRole('ADMIN','SELLER') and hasAuthority('CREATE_PRIVILEGE')")
    public ResponseEntity<?> createShop(@Valid @RequestPart("request") ShopRequest request,
                                        @RequestPart(name = "image", required = false) MultipartFile file,
                                        @CurrentAccount Account currUser) throws ImageResizerException, IOException {
        return new ResponseEntity<>(shopService.addShop(request, file, currUser), HttpStatus.CREATED);
    }

    //Update shop by id
    @PutMapping(value = "/{id}", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    @PreAuthorize("hasAnyRole('ADMIN','SELLER') and hasAuthority('UPDATE_PRIVILEGE')")
    public ResponseEntity<?> updateShop(@PathVariable("id") Long id,
                                        @Valid @RequestPart("request") ShopRequest request,
                                        @RequestPart(name = "image", required = false) MultipartFile file,
                                        @CurrentAccount Account currUser) throws ImageResizerException, IOException {
        return new ResponseEntity<>(shopService.updateShop(id, request, file, currUser), HttpStatus.CREATED);
    }

    //Delete shop
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SELLER') and hasAuthority('DELETE_PRIVILEGE')")
    public ResponseEntity<?> deleteShop(@PathVariable("id") Long id, @CurrentAccount Account currUser) {
        return new ResponseEntity<>(shopService.deleteShop(id, currUser), HttpStatus.OK);
    }

    //Delete multiples shops in a lists of {ids}
    @DeleteMapping("/delete-multiples")
    @PreAuthorize("hasAnyRole('ADMIN','SELLER') and hasAuthority('DELETE_PRIVILEGE')")
    public ResponseEntity<?> deleteCoupons(@RequestParam("ids") List<Long> ids,
                                           @CurrentAccount Account currUser
    ) {
        shopService.deleteShops(ids, currUser);
        return new ResponseEntity<>("Shops deleted successfully!", HttpStatus.OK);
    }

    //Delete multiple shops not in lists of {ids}
    @DeleteMapping("/delete-inverse")
    @PreAuthorize("hasAnyRole('ADMIN','SELLER') and hasAuthority('DELETE_PRIVILEGE')")
    public ResponseEntity<?> deleteCouponsInverse(@RequestParam(value = "keyword", defaultValue = "") String keyword,
                                                  @RequestParam(value = "userId", required = false) Long userId,
                                                  @RequestParam("ids") List<Long> ids,
                                                  @CurrentAccount Account currUser) {
        shopService.deleteShopsInverse(
                keyword,
                userId,
                ids,
                currUser);
        return new ResponseEntity<>("Shops deleted successfully!", HttpStatus.OK);
    }

    //Delete all shops
    @DeleteMapping("/delete-all")
    @PreAuthorize("hasAnyRole('ADMIN','SELLER') and hasAuthority('DELETE_PRIVILEGE')")
    public ResponseEntity<?> deleteAllShops(@CurrentAccount Account currUser) {
        shopService.deleteAllShops(currUser);
        return new ResponseEntity<>("All shops deleted successfully!", HttpStatus.OK);
    }
}
