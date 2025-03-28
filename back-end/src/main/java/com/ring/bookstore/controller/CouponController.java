package com.ring.bookstore.controller;

import com.ring.bookstore.config.CurrentAccount;
import com.ring.bookstore.enums.CouponType;
import com.ring.bookstore.model.Account;
import com.ring.bookstore.request.CouponRequest;
import com.ring.bookstore.service.CouponService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/coupons")
@RequiredArgsConstructor
public class CouponController {

    private final CouponService couponService;

    //Get coupons
    @GetMapping
    public ResponseEntity<?> getCoupons(@RequestParam(value = "types", required = false) List<CouponType> types,
                                        @RequestParam(value = "shopId", required = false) Long shopId,
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
                byShop,
                showExpired,
                checkValue,
                checkQuantity), HttpStatus.OK);
    }

    //Get coupon by {id}
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SELLER','GUEST') and hasAuthority('READ_PRIVILEGE')")
    public ResponseEntity<?> getCoupon(@PathVariable("id") Long id) {
        return new ResponseEntity<>(couponService.getCoupon(id), HttpStatus.OK);
    }

    //Get coupon by {code}
    @GetMapping("/code/{code}")
    public ResponseEntity<?> getCoupon(@PathVariable("code") String code,
                                       @RequestParam(value = "cValue", required = false) Double checkValue,
                                       @RequestParam(value = "cQuantity", required = false) Integer checkQuantity) {
        return new ResponseEntity<>(couponService.getCouponByCode(code, checkValue, checkQuantity), HttpStatus.OK);
    }

    //Get coupons
    @GetMapping("/recommend")
    public ResponseEntity<?> recommendCoupons(@RequestParam("shopIds") List<Long> shopIds) {
        return new ResponseEntity<>(couponService.recommendCoupons(shopIds), HttpStatus.OK);
    }

    @GetMapping("/analytics")
    @PreAuthorize("hasAnyRole('ADMIN','SELLER','GUEST') and hasAuthority('READ_PRIVILEGE')")
    public ResponseEntity<?> getCouponAnalytics(@RequestParam(value = "shopId", required = false) Long shopId) {
        return new ResponseEntity<>(couponService.getAnalytics(shopId), HttpStatus.OK);
    }

    //Add coupon
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','SELLER') and hasAuthority('CREATE_PRIVILEGE')")
    public ResponseEntity<?> createCoupon(@RequestBody @Valid CouponRequest request,
                                          @CurrentAccount Account currUser) {
        return new ResponseEntity<>(couponService.addCoupon(request, currUser), HttpStatus.CREATED);
    }

    //Update coupon by id
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SELLER') and hasAuthority('UPDATE_PRIVILEGE')")
    public ResponseEntity<?> updateCoupon(@PathVariable("id") Long id,
                                          @RequestBody @Valid CouponRequest request,
                                          @CurrentAccount Account currUser) {
        return new ResponseEntity<>(couponService.updateCoupon(id, request, currUser), HttpStatus.CREATED);
    }

    //Delete coupon
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SELLER') and hasAuthority('DELETE_PRIVILEGE')")
    public ResponseEntity<?> deleteCoupon(@PathVariable("id") Long id, @CurrentAccount Account currUser) {
        return new ResponseEntity<>(couponService.deleteCoupon(id, currUser), HttpStatus.OK);
    }

    //Delete multiples coupons in a lists of {ids}
    @DeleteMapping("/delete-multiples")
    @PreAuthorize("hasAnyRole('ADMIN','SELLER') and hasAuthority('DELETE_PRIVILEGE')")
    public ResponseEntity<?> deleteCoupons(@RequestParam("ids") List<Long> ids,
                                           @CurrentAccount Account currUser
    ) {
        couponService.deleteCoupons(ids, currUser);
        return new ResponseEntity<>("Coupons deleted successfully!", HttpStatus.OK);
    }

    //Delete multiple coupons not in lists of {ids}
    @DeleteMapping("/delete-inverse")
    @PreAuthorize("hasAnyRole('ADMIN','SELLER') and hasAuthority('DELETE_PRIVILEGE')")
    public ResponseEntity<?> deleteCouponsInverse(@RequestParam(value = "types", required = false) List<CouponType> types,
                                                  @RequestParam(value = "shopId", required = false) Long shopId,
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
                byShop,
                showExpired,
                ids,
                currUser);
        return new ResponseEntity<>("Coupons deleted successfully!", HttpStatus.OK);
    }

    //Delete all coupons
    @DeleteMapping("/delete-all")
    @PreAuthorize("hasAnyRole('ADMIN','SELLER') and hasAuthority('DELETE_PRIVILEGE')")
    public ResponseEntity<?> deleteAllCoupons(@RequestParam(value = "shopId", required = false) Long shopId,
                                              @CurrentAccount Account currUser) {
        couponService.deleteAllCoupons(shopId, currUser);
        return new ResponseEntity<>("All coupons deleted successfully!", HttpStatus.OK);
    }
}
