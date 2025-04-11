package com.ring.bookstore.controller;

import com.ring.bookstore.config.CurrentAccount;
import com.ring.bookstore.model.enums.CouponType;
import com.ring.bookstore.model.entity.Account;
import com.ring.bookstore.model.dto.request.CouponRequest;
import com.ring.bookstore.service.CouponService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller named {@link CouponController} for handling coupon-related operations.
 * Exposes endpoints under "/api/coupons".
 */
@RestController
@RequestMapping("/api/coupons")
@RequiredArgsConstructor
public class CouponController {

    private final CouponService couponService;

    /**
     * Retrieves a list of coupons with optional filters and pagination.
     *
     * @param types         types of coupons to filter.
     * @param shopId        shop ID to filter coupons by.
     * @param userId        shop owner ID to filter coupons by.
     * @param byShop        if true, filters coupons created by shops, if false, filters coupons created by system, null will return both.
     * @param showExpired   if true, includes expired coupons.
     * @param codes         list of coupon codes to filter.
     * @param code          a single code to match.
     * @param checkValue    optional minimum value to validate.
     * @param checkQuantity optional minimum quantity to validate.
     * @param pageSize      size of each page.
     * @param pageNo        page number.
     * @param sortBy        sorting field.
     * @param sortDir       sorting direction.
     * @return paginated and filtered list of coupons.
     */
    @GetMapping
    public ResponseEntity<?> getCoupons(@RequestParam(value = "types", required = false) List<CouponType> types,
                                        @RequestParam(value = "shopId", required = false) Long shopId,
                                        @RequestParam(value = "userId", required = false) Long userId,
                                        @RequestParam(value = "byShop", required = false) Boolean byShop,
                                        @RequestParam(value = "showExpired", required = false) Boolean showExpired,
                                        @RequestParam(value = "codes", required = false) List<String> codes,
                                        @RequestParam(value = "code", required = false) String code,
                                        @RequestParam(value = "cValue", required = false) Double checkValue,
                                        @RequestParam(value = "cQuantity", required = false) Integer checkQuantity,
                                        @RequestParam(value = "pSize", defaultValue = "5") Integer pageSize,
                                        @RequestParam(value = "pageNo", defaultValue = "0") Integer pageNo,
                                        @RequestParam(value = "sortBy", defaultValue = "detail.discount") String sortBy,
                                        @RequestParam(value = "sortDir", defaultValue = "desc") String sortDir) {
        return new ResponseEntity<>(couponService.getCoupons(
                pageNo,
                pageSize,
                sortBy,
                sortDir,
                types,
                codes,
                code,
                shopId,
                userId,
                byShop,
                showExpired,
                checkValue,
                checkQuantity), HttpStatus.OK);
    }

    /**
     * Retrieves a coupon by its ID.
     *
     * @param id the coupon ID.
     * @return the coupon data.
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('SELLER','GUEST') and hasAuthority('read:coupon')")
    public ResponseEntity<?> getCoupon(@PathVariable("id") Long id) {
        return new ResponseEntity<>(couponService.getCoupon(id), HttpStatus.OK);
    }

    /**
     * Retrieves a coupon by its code with optional value/quantity validation.
     *
     * @param code the coupon code.
     * @param checkValue optional value to validate against.
     * @param checkQuantity optional quantity to validate against.
     * @return the matching coupon.
     */
    @GetMapping("/code/{code}")
    public ResponseEntity<?> getCoupon(@PathVariable("code") String code,
                                       @RequestParam(value = "cValue", required = false) Double checkValue,
                                       @RequestParam(value = "cQuantity", required = false) Integer checkQuantity) {
        return new ResponseEntity<>(couponService.getCouponByCode(code, checkValue, checkQuantity), HttpStatus.OK);
    }

    /**
     * Recommends coupons based on provided shop IDs.
     *
     * @param shopIds list of shop IDs.
     * @return recommended coupons for the shops.
     */
    @GetMapping("/recommend")
    public ResponseEntity<?> recommendCoupons(@RequestParam("shopIds") List<Long> shopIds) {
        return new ResponseEntity<>(couponService.recommendCoupons(shopIds), HttpStatus.OK);
    }

    /**
     * Provides analytics for coupons of a specific shop.
     *
     * @param shopId    optional shop ID.
     * @param userId    the shop owner ID.
     * @param currUser  the current authenticated user.
     * @return analytics data.
     */
    @GetMapping("/analytics")
    @PreAuthorize("hasAnyRole('SELLER','GUEST') and hasAuthority('read:coupon')")
    public ResponseEntity<?> getCouponAnalytics(@RequestParam(value = "shopId", required = false) Long shopId,
                                                @RequestParam(value = "userId", required = false) Long userId,
                                                @CurrentAccount Account currUser) {
        return new ResponseEntity<>(couponService.getAnalytics(shopId, userId, currUser), HttpStatus.OK);
    }

    /**
     * Creates a new coupon.
     *
     * @param request coupon data.
     * @param currUser the current authenticated seller.
     * @return the created coupon.
     */
    @PostMapping
    @PreAuthorize("hasRole('SELLER') and hasAuthority('create:coupon')")
    public ResponseEntity<?> createCoupon(@RequestBody @Valid CouponRequest request,
                                          @CurrentAccount Account currUser) {
        return new ResponseEntity<>(couponService.addCoupon(request, currUser), HttpStatus.CREATED);
    }

    /**
     * Updates an existing coupon by its ID.
     *
     * @param id the coupon ID.
     * @param request updated coupon data.
     * @param currUser the current authenticated seller.
     * @return the updated coupon.
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('SELLER') and hasAuthority('update:coupon')")
    public ResponseEntity<?> updateCoupon(@PathVariable("id") Long id,
                                          @RequestBody @Valid CouponRequest request,
                                          @CurrentAccount Account currUser) {
        return new ResponseEntity<>(couponService.updateCoupon(id, request, currUser), HttpStatus.CREATED);
    }

    /**
     * Deletes a coupon by its ID.
     *
     * @param id the coupon ID.
     * @param currUser the current authenticated seller.
     * @return success message.
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SELLER') and hasAuthority('delete:coupon')")
    public ResponseEntity<?> deleteCoupon(@PathVariable("id") Long id, @CurrentAccount Account currUser) {
        return new ResponseEntity<>(couponService.deleteCoupon(id, currUser), HttpStatus.OK);
    }

    /**
     * Deletes multiple coupons by a list of IDs.
     *
     * @param ids list of coupon IDs to delete.
     * @param currUser the current authenticated seller.
     * @return success message.
     */
    @DeleteMapping("/delete-multiple")
    @PreAuthorize("hasRole('SELLER') and hasAuthority('delete:coupon')")
    public ResponseEntity<?> deleteCoupons(@RequestParam("ids") List<Long> ids,
                                           @CurrentAccount Account currUser
    ) {
        couponService.deleteCoupons(ids, currUser);
        return new ResponseEntity<>("Coupons deleted successfully!", HttpStatus.OK);
    }

    /**
     * Deletes all coupons except those specified by a list of IDs.
     *
     * @param types         optional filter for coupon types.
     * @param shopId        optional shop ID.
     * @param userId        shop owner ID to filter coupons by.
     * @param byShop        if true, filters coupons created by shops, if false, filters coupons created by system, null will return both.
     * @param showExpired   whether to include expired coupons.
     * @param code          optional coupon code.
     * @param codes         optional list of coupon codes.
     * @param ids           list of IDs to exclude from deletion.
     * @param currUser      the current authenticated seller.
     * @return success message.
     */
    @DeleteMapping("/delete-inverse")
    @PreAuthorize("hasRole('SELLER') and hasAuthority('delete:coupon')")
    public ResponseEntity<?> deleteCouponsInverse(@RequestParam(value = "types", required = false) List<CouponType> types,
                                                  @RequestParam(value = "shopId", required = false) Long shopId,
                                                  @RequestParam(value = "userId", required = false) Long userId,
                                                  @RequestParam(value = "byShop", required = false) Boolean byShop,
                                                  @RequestParam(value = "showExpired", required = false) Boolean showExpired,
                                                  @RequestParam(value = "code", required = false) String code,
                                                  @RequestParam(value = "codes", required = false) List<String> codes,
                                                  @RequestParam("ids") List<Long> ids,
                                                  @CurrentAccount Account currUser) {
        couponService.deleteCouponsInverse(
                types,
                codes,
                code,
                shopId,
                userId,
                byShop,
                showExpired,
                ids,
                currUser);
        return new ResponseEntity<>("Coupons deleted successfully!", HttpStatus.OK);
    }

    /**
     * Deletes all coupons for a specific shop or globally.
     *
     * @param shopId optional shop ID.
     * @param currUser the current authenticated seller.
     * @return success message.
     */
    @DeleteMapping("/delete-all")
    @PreAuthorize("hasRole('SELLER') and hasAuthority('delete:coupon')")
    public ResponseEntity<?> deleteAllCoupons(@RequestParam(value = "shopId", required = false) Long shopId,
                                              @CurrentAccount Account currUser) {
        couponService.deleteAllCoupons(shopId, currUser);
        return new ResponseEntity<>("All coupons deleted successfully!", HttpStatus.OK);
    }
}
