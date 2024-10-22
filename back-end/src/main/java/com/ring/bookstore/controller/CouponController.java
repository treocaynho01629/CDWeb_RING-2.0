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
@CrossOrigin("http://localhost:5173")
@RequestMapping("/api/coupons")
@RequiredArgsConstructor
public class CouponController {

    private final CouponService couponService;

    //Get coupons
    @GetMapping
    public ResponseEntity<?> getCoupons(@RequestParam(value = "type", required = false) CouponType type,
                                        @RequestParam(value = "shopId", required = false) Long shopId,
                                        @RequestParam(value = "byShop", required = false) Boolean byShop,
                                        @RequestParam(value = "showExpired", required = false) Boolean showExpired,
                                        @RequestParam(value = "keyword", required = false) String keyword,
                                        @RequestParam(value = "rValue", required = false) Double recommendValue,
                                        @RequestParam(value = "rQuantity", required = false) Integer recommendQuantity,
                                        @RequestParam(value = "pSize", defaultValue = "5") Integer pageSize,
                                        @RequestParam(value = "pageNo", defaultValue = "0") Integer pageNo,
                                        @RequestParam(value = "sortBy", defaultValue = "detail.discount") String sortBy,
                                        @RequestParam(value = "sortDir", defaultValue = "desc") String sortDir) {
        return new ResponseEntity<>(couponService.getCoupons(pageNo, pageSize, sortBy, sortDir,
                type, keyword, shopId, byShop, showExpired, recommendValue, recommendQuantity), HttpStatus.OK);
    }

    //Get coupon by {code}
    @GetMapping("/{code}")
    public ResponseEntity<?> getCoupon(@PathVariable("code") String code,
                                       @RequestParam(value = "rValue", required = false) Double recommendValue,
                                       @RequestParam(value = "rQuantity", required = false) Integer recommendQuantity) {
        return new ResponseEntity<>(couponService.getCouponByCode(code, recommendValue, recommendQuantity), HttpStatus.OK);
    }

    //Get coupons
    @GetMapping("/recommend")
    public ResponseEntity<?> recommendCoupons(@RequestParam("shopIds") List<Long> shopIds) {
        return new ResponseEntity<>(couponService.recommendCoupons(shopIds), HttpStatus.OK);
    }

    //Add coupon
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','SELLER')")
    public ResponseEntity<?> createCoupon(@Valid @RequestPart("request") CouponRequest request,
                                          @CurrentAccount Account currUser) {
        return new ResponseEntity<>(couponService.addCoupon(request, currUser), HttpStatus.CREATED);
    }

    //Update coupon by id
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SELLER')")
    public ResponseEntity<?> updateCoupon(@PathVariable("id") Long id,
                                          @Valid @RequestPart("request") CouponRequest request,
                                          @CurrentAccount Account currUser) {
        return new ResponseEntity<>(couponService.updateCoupon(id, request, currUser), HttpStatus.CREATED);
    }

    //Delete coupon
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SELLER')")
    public ResponseEntity<?> deleteCoupon(@PathVariable("id") Long id, @CurrentAccount Account currUser) {
        return new ResponseEntity<>(couponService.deleteCoupon(id, currUser), HttpStatus.OK);
    }

    //Delete multiples coupons in a lists of {ids}
    @DeleteMapping("/delete-multiples")
    @PreAuthorize("hasAnyRole('ADMIN','SELLER')")
    public ResponseEntity<?> deleteCoupons(@RequestParam(value = "type", required = false) CouponType type,
                                           @RequestParam(value = "shopId", required = false) Long shopId,
                                           @RequestParam(value = "byShop", required = false) Boolean byShop,
                                           @RequestParam(value = "showExpired", required = false) Boolean showExpired,
                                           @RequestParam(value = "keyword", required = false) String keyword,
                                           @RequestParam("ids") List<Long> ids,
                                           @RequestParam(value = "isInverse", defaultValue = "false") Boolean isInverse,
                                           @CurrentAccount Account currUser
    ) {
        couponService.deleteCoupons(type, keyword, shopId, byShop, showExpired, ids, isInverse, currUser);
        return new ResponseEntity<>("Coupons deleted successfully!", HttpStatus.OK);
    }

    //Delete all coupons
    @DeleteMapping("/delete-all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteAllCoupons() {
        couponService.deleteAllCoupons();
        return new ResponseEntity<>("All coupons deleted successfully!", HttpStatus.OK);
    }
}
