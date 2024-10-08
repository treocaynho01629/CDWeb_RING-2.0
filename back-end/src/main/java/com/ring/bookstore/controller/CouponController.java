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
                                        @RequestParam(value = "byShop", required=false) Boolean byShop,
                                        @RequestParam(value = "keyword", defaultValue = "") String keyword,
                                        @RequestParam(value = "pSize", defaultValue = "5") Integer pageSize,
                                        @RequestParam(value = "pageNo", defaultValue = "0") Integer pageNo,
                                        @RequestParam(value = "sortBy", defaultValue = "id") String sortBy,
                                        @RequestParam(value = "sortDir", defaultValue = "asc") String sortDir) {
        return new ResponseEntity<>(couponService.getCoupons(pageNo, pageSize, sortBy, sortDir, type, keyword, shopId, byShop), HttpStatus.OK);
    }

    //Get coupon by {code}
    @GetMapping("/{code}")
    public ResponseEntity<?> getCoupon(@PathVariable("code") String code) {
        return new ResponseEntity<>(couponService.getCouponByCode(code), HttpStatus.OK);
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
                                           @RequestParam(value = "byShop", required=false) Boolean byShop,
                                           @RequestParam(value = "keyword", defaultValue = "") String keyword,
                                           @RequestParam("ids") List<Long> ids,
                                           @RequestParam(value = "isInverse", defaultValue = "false") Boolean isInverse,
                                           @CurrentAccount Account currUser
    ) {
        couponService.deleteCoupons(type, keyword, shopId, byShop, ids, isInverse, currUser);
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
