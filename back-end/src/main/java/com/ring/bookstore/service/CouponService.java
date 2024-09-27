package com.ring.bookstore.service;

import com.ring.bookstore.enums.CouponType;
import com.ring.bookstore.model.Account;
import com.ring.bookstore.model.Coupon;
import com.ring.bookstore.request.CouponRequest;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface CouponService {

    Page<Coupon> getCoupons(Integer pageNo, Integer pageSize, String sortBy, String sortDir,
                            CouponType type, String keyword, Long shopId, Boolean byShop);

    Coupon getCouponByCode(String code);

    Coupon addCoupon(CouponRequest request, Account user);

    Coupon updateCoupon(Long id, CouponRequest request, Account user);

    Coupon deleteCoupon(Long id, Account user);

    void deleteCoupons(CouponType type, String keyword, Long shopId, Boolean byShop,
                       List<Long> ids, boolean isInverse, Account user);

    void deleteAllCoupons();
}
