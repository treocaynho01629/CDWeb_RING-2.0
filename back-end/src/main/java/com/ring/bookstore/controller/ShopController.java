package com.ring.bookstore.controller;

import com.ring.bookstore.config.CurrentAccount;
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
    @GetMapping
    public ResponseEntity<?> getShops(
            @RequestParam(value = "keyword", defaultValue = "") String keyword,
            @RequestParam(value = "ownerId", required = false) Long ownerId,
            @RequestParam(value = "pSize", defaultValue = "5") Integer pageSize,
            @RequestParam(value = "pageNo", defaultValue = "0") Integer pageNo,
            @RequestParam(value = "sortBy", defaultValue = "id") String sortBy,
            @RequestParam(value = "sortDir", defaultValue = "asc") String sortDir) {
        return new ResponseEntity<>(shopService.getShops(pageNo, pageSize, sortBy, sortDir, keyword, ownerId), HttpStatus.OK);
    }

    //Get shop by {id}
    @GetMapping("/{id}")
    public ResponseEntity<?> getShopById(@PathVariable("id") Long id,
                                         @CurrentAccount Account currUser) {
        return new ResponseEntity<>(shopService.getShopById(id, currUser), HttpStatus.OK);
    }

    //Follow
    @PutMapping("/follow/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> followShop(@PathVariable("id") Long id,
                                        @CurrentAccount Account currUser) {
        shopService.follow(id, currUser);
        return new ResponseEntity<>("Theo dõi thành công", HttpStatus.CREATED);
    }

    //Unfollow
    @PutMapping("/unfollow/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> unfollowShop(@PathVariable("id") Long id,
                                        @CurrentAccount Account currUser) {
        shopService.unfollow(id, currUser);
        return new ResponseEntity<>("Bỏ theo dõi thành công", HttpStatus.CREATED);
    }

    //Add shop
    @PostMapping(consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    @PreAuthorize("hasAnyRole('ADMIN','SELLER')")
    public ResponseEntity<?> createShop(@Valid @RequestPart("request") ShopRequest request,
                                        @RequestPart(name = "image", required = false) MultipartFile file,
                                        @CurrentAccount Account currUser) throws ImageResizerException, IOException {
        return new ResponseEntity<>(shopService.addShop(request, file, currUser), HttpStatus.CREATED);
    }

    //Update shop by id
    @PutMapping(value = "/{id}", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    @PreAuthorize("hasAnyRole('ADMIN','SELLER')")
    public ResponseEntity<?> updateShop(@PathVariable("id") Long id,
                                        @Valid @RequestPart("request") ShopRequest request,
                                        @RequestPart(name = "image", required = false) MultipartFile file,
                                        @CurrentAccount Account currUser) throws ImageResizerException, IOException {
        return new ResponseEntity<>(shopService.updateShop(id, request, file, currUser), HttpStatus.CREATED);
    }

    //Delete shop
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SELLER')")
    public ResponseEntity<?> deleteShop(@PathVariable("id") Long id, @CurrentAccount Account currUser) {
        return new ResponseEntity<>(shopService.deleteShop(id, currUser), HttpStatus.OK);
    }

    //Delete multiples shops in a lists of {ids}
    @DeleteMapping("/delete-multiples")
    @PreAuthorize("hasAnyRole('ADMIN','SELLER')")
    public ResponseEntity<?> deleteShops(@RequestParam(value = "keyword", defaultValue = "") String keyword,
                                         @RequestParam(value = "ownerId", required = false) Long ownerId,
                                         @RequestParam("ids") List<Long> ids,
                                         @RequestParam(value = "isInverse", defaultValue = "false") Boolean isInverse,
                                         @CurrentAccount Account currUser
    ) {
        shopService.deleteShops(keyword, ownerId, ids, isInverse, currUser);
        return new ResponseEntity<>("Shops deleted successfully!", HttpStatus.OK);
    }

    //Delete all shops
    @DeleteMapping("/delete-all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteAllShops() {
        shopService.deleteAllShops();
        return new ResponseEntity<>("All shops deleted successfully!", HttpStatus.OK);
    }
}
