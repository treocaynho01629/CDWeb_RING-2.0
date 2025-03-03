package com.ring.bookstore.service;

import com.ring.bookstore.dtos.coupons.CouponDTO;
import com.ring.bookstore.dtos.coupons.CouponDetailDTO;
import com.ring.bookstore.dtos.coupons.CouponDiscountDTO;
import com.ring.bookstore.dtos.coupons.ICoupon;
import com.ring.bookstore.dtos.dashboard.StatDTO;
import com.ring.bookstore.enums.CouponType;
import com.ring.bookstore.model.Account;
import com.ring.bookstore.model.Coupon;
import com.ring.bookstore.request.CartStateRequest;
import com.ring.bookstore.request.CouponRequest;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface CouponService {

    Page<CouponDTO> getCoupons(Integer pageNo,
                               Integer pageSize,
                               String sortBy,
                               String sortDir,
                               List<CouponType> types,
                               List<String> codes,
                               String code,
                               Long shopId,
                               Boolean byShop,
                               Boolean showExpired,
                               Double cValue,
                               Integer cQuantity);

    CouponDetailDTO getCoupon(Long id);

    CouponDTO getCouponByCode(String code,
                              Double cValue,
                              Integer cQuantity);

    List<CouponDTO> recommendCoupons(List<Long> shopIds);

    CouponDTO recommendCoupon(Long shopId,
                              CartStateRequest state);

    StatDTO getAnalytics(Long shopId);

    Coupon addCoupon(CouponRequest request,
                     Account user);

    Coupon updateCoupon(Long id,
                        CouponRequest request,
                        Account user);

    Coupon deleteCoupon(Long id,
                        Account user);

    CouponDiscountDTO applyCoupon(Coupon coupon,
                                  CartStateRequest request,
                                  Account user);

    boolean isExpired(Coupon coupon);

    void deleteCoupons(List<Long> ids,
                       Account user);

    void deleteCouponsInverse(List<CouponType> types,
                              List<String> codes,
                              String code,
                              Long shopId,
                              Boolean byShop,
                              Boolean showExpired,
                              List<Long> ids,
                              Account user);

    void deleteAllCoupons(Long shopId, Account user);
}
