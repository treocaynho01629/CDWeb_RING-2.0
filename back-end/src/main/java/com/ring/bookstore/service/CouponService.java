package com.ring.bookstore.service;

import com.ring.bookstore.model.dto.request.CartStateRequest;
import com.ring.bookstore.model.dto.request.CouponRequest;
import com.ring.bookstore.model.dto.response.coupons.CouponDTO;
import com.ring.bookstore.model.dto.response.coupons.CouponDetailDTO;
import com.ring.bookstore.model.dto.response.coupons.CouponDiscountDTO;
import com.ring.bookstore.model.dto.response.dashboard.StatDTO;
import com.ring.bookstore.model.entity.Account;
import com.ring.bookstore.model.entity.Coupon;
import com.ring.bookstore.model.enums.CouponType;
import org.springframework.data.domain.Page;

import java.util.List;

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
