package com.ring.bookstore.controller;

import com.ring.bookstore.config.CurrentAccount;
import com.ring.bookstore.model.entity.Account;
import com.ring.bookstore.model.dto.request.ShopRequest;
import com.ring.bookstore.service.ShopService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * Controller named {@link ShopController} for handling shop-related operations.
 * Exposes endpoints under "/api/shops".
 */
@RestController
@RequestMapping("/api/shops")
@RequiredArgsConstructor
public class ShopController {

    private final ShopService shopService;

    /**
     * Retrieves shops for display with pagination, sorting, and optional filters.
     *
     * @param keyword   optional keyword to search in shop names or descriptions
     * @param pageSize  size of each page
     * @param pageNo    page number
     * @param sortBy    sorting field
     * @param sortDir   sorting direction
     * @param followed  optional filter to show only followed shops
     * @param currUser  the current authenticated user
     * @return a {@link ResponseEntity} containing the list of shops
     */
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

    /**
     * Retrieves all shops with pagination, sorting, and optional filters.
     *
     * @param keyword   optional keyword to search in shop names or descriptions
     * @param pageSize  size of each page
     * @param pageNo    page number
     * @param sortBy    sorting field
     * @param sortDir   sorting direction
     * @param userId    optional filter by user ID
     * @param currUser  the current authenticated seller
     * @return a {@link ResponseEntity} containing the list of shops
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('SELLER','GUEST') and hasAuthority('read:shop')")
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

    /**
     * Retrieves a preview of shops for selection.
     *
     * @param currUser the current authenticated seller
     * @return a {@link ResponseEntity} containing a preview list of shops
     */
    @GetMapping("/preview")
    @PreAuthorize("hasAnyRole('SELLER','GUEST') and hasAuthority('read:shop')")
    public ResponseEntity<?> getPreviewShops(@CurrentAccount Account currUser) {
        return new ResponseEntity<>(shopService.getShopsPreview(currUser), HttpStatus.OK);
    }

    /**
     * Retrieves detailed information about a specific shop.
     *
     * @param id        the shop ID
     * @param currUser  the current authenticated user
     * @return a {@link ResponseEntity} containing shop information
     */
    @GetMapping("info/{id}")
    public ResponseEntity<?> getShopInfo(@PathVariable("id") Long id,
                                         @CurrentAccount Account currUser) {
        return new ResponseEntity<>(shopService.getShopInfo(id, currUser), HttpStatus.OK);
    }

    /**
     * Retrieves display details for a specific shop.
     *
     * @param id        the shop ID
     * @param currUser  the current authenticated user
     * @return a {@link ResponseEntity} containing shop display details
     */
    @GetMapping("{id}")
    public ResponseEntity<?> getShopDisplayDetail(@PathVariable("id") Long id,
                                         @CurrentAccount Account currUser) {
        return new ResponseEntity<>(shopService.getShopDisplayDetail(id, currUser), HttpStatus.OK);
    }

    /**
     * Retrieves detailed information for a shop.
     *
     * @param id        the shop ID
     * @param currUser  the current authenticated user
     * @return a {@link ResponseEntity} containing detailed shop information
     */
    @GetMapping("/detail/{id}")
    @PreAuthorize("hasAnyRole('SELLER','GUEST') and hasAuthority('read:shop')")
    public ResponseEntity<?> getShopDetail(@PathVariable("id") Long id,
                                         @CurrentAccount Account currUser) {
        return new ResponseEntity<>(shopService.getShopDetail(id, currUser), HttpStatus.OK);
    }

    /**
     * Retrieves shop analytics.
     *
     * @return a {@link ResponseEntity} containing analytics data
     */
    @GetMapping("/analytics")
    @PreAuthorize("hasAnyRole('ADMIN','GUEST') and hasAuthority('read:shop')")
    public ResponseEntity<?> getShopAnalytics() {
        return new ResponseEntity<>(shopService.getAnalytics(), HttpStatus.OK);
    }

    /**
     * Follows a specific shop.
     *
     * @param id        the shop ID
     * @param currUser  the current authenticated user
     * @return a {@link ResponseEntity} with a success message
     */
    @PutMapping("/follow/{id}")
    @PreAuthorize("hasRole('USER') and hasAuthority('update:profile')")
    public ResponseEntity<?> followShop(@PathVariable("id") Long id,
                                        @CurrentAccount Account currUser) {
        shopService.follow(id, currUser);
        return new ResponseEntity<>("Shop followed successfully!", HttpStatus.CREATED);
    }

    /**
     * Unfollows a specific shop.
     *
     * @param id        the shop ID
     * @param currUser  the current authenticated user
     * @return a {@link ResponseEntity} with a success message
     */
    @PutMapping("/unfollow/{id}")
    @PreAuthorize("hasRole('USER') and hasAuthority('update:profile')")
    public ResponseEntity<?> unfollowShop(@PathVariable("id") Long id,
                                        @CurrentAccount Account currUser) {
        shopService.unfollow(id, currUser);
        return new ResponseEntity<>("Shop unfollowed successfully!", HttpStatus.CREATED);
    }

    /**
     * Creates a new shop.
     *
     * @param request   the {@link ShopRequest} data
     * @param file      optional image for the shop
     * @param currUser  the current authenticated seller
     * @return a {@link ResponseEntity} with the created shop data
     */
    @PostMapping(consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    @PreAuthorize("hasRole('SELLER')  and hasAuthority('create:Shop')")
    public ResponseEntity<?> createShop(@Valid @RequestPart("request") ShopRequest request,
                                        @RequestPart(name = "image", required = false) MultipartFile file,
                                        @CurrentAccount Account currUser) {
        return new ResponseEntity<>(shopService.addShop(request, file, currUser), HttpStatus.CREATED);
    }

    /**
     * Updates an existing shop.
     *
     * @param id        the shop ID
     * @param request   the updated {@link ShopRequest} data
     * @param file      optional new image for the shop
     * @param currUser  the current authenticated seller
     * @return a {@link ResponseEntity} with the updated shop data
     */
    @PutMapping(value = "/{id}", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    @PreAuthorize("hasRole('SELLER')  and hasAuthority('update:Shop')")
    public ResponseEntity<?> updateShop(@PathVariable("id") Long id,
                                        @Valid @RequestPart("request") ShopRequest request,
                                        @RequestPart(name = "image", required = false) MultipartFile file,
                                        @CurrentAccount Account currUser) {
        return new ResponseEntity<>(shopService.updateShop(id, request, file, currUser), HttpStatus.CREATED);
    }

    /**
     * Deletes a shop by its ID.
     *
     * @param id        the shop ID
     * @param currUser  the current authenticated seller
     * @return a {@link ResponseEntity} with a success message
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SELLER')  and hasAuthority('delete:Shop')")
    public ResponseEntity<?> deleteShop(@PathVariable("id") Long id, @CurrentAccount Account currUser) {
        return new ResponseEntity<>(shopService.deleteShop(id, currUser), HttpStatus.OK);
    }

    /**
     * Deletes multiple books by a list of IDs.
     *
     * @param ids       the list of shop IDs to delete
     * @param currUser  the current authenticated seller
     * @return a {@link ResponseEntity} with a success message
     */
    @DeleteMapping("/delete-multiples")
    @PreAuthorize("hasRole('SELLER')  and hasAuthority('delete:Shop')")
    public ResponseEntity<?> deleteCoupons(@RequestParam("ids") List<Long> ids,
                                           @CurrentAccount Account currUser
    ) {
        shopService.deleteShops(ids, currUser);
        return new ResponseEntity<>("Shops deleted successfully!", HttpStatus.OK);
    }

    /**
     * Deletes shops that are NOT in the given list of IDs.
     *
     * @param keyword   optional filter by keyword
     * @param userId    optional filter by user ID
     * @param ids       list of shop IDs to exclude from deletion
     * @param currUser  the current authenticated seller
     * @return a {@link ResponseEntity} with a success message
     */
    @DeleteMapping("/delete-inverse")
    @PreAuthorize("hasRole('SELLER')  and hasAuthority('delete:Shop')")
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

    /**
     * Deletes all shops
     *
     * @param currUser the current authenticated seller
     * @return a {@link ResponseEntity} with a success message
     */
    @DeleteMapping("/delete-all")
    @PreAuthorize("hasRole('SELLER')  and hasAuthority('delete:Shop')")
    public ResponseEntity<?> deleteAllShops(@CurrentAccount Account currUser) {
        shopService.deleteAllShops(currUser);
        return new ResponseEntity<>("All shops deleted successfully!", HttpStatus.OK);
    }
}
