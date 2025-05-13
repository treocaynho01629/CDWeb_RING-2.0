package com.ring.service;

import com.ring.dto.request.CartStateRequest;
import com.ring.dto.request.CouponRequest;
import com.ring.dto.response.PagingResponse;
import com.ring.dto.response.coupons.CouponDTO;
import com.ring.dto.response.coupons.CouponDetailDTO;
import com.ring.dto.response.coupons.CouponDiscountDTO;
import com.ring.dto.response.dashboard.StatDTO;
import com.ring.model.entity.Account;
import com.ring.model.entity.Coupon;
import com.ring.model.enums.CouponType;

import java.util.List;

public interface CouponService {

    PagingResponse<CouponDTO> getCoupons(Integer pageNo,
            Integer pageSize,
            String sortBy,
            String sortDir,
            List<CouponType> types,
            List<String> codes,
            String code,
            Long shopId,
            Long userId,
            Boolean byShop,
            Boolean showExpired,
            Double cValue,
            Integer cQuantity);

    CouponDetailDTO getCoupon(Long id);

    CouponDTO getCouponByCode(String code,
            Long shopId,
            Double cValue,
            Integer cQuantity);

    List<CouponDTO> recommendCoupons(List<Long> shopIds);

    CouponDTO recommendCoupon(Long shopId,
            CartStateRequest state);

    StatDTO getAnalytics(Long shopId,
            Long userId,
            Account user);

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
            Long userId,
            Boolean byShop,
            Boolean showExpired,
            List<Long> ids,
            Account user);

    void deleteAllCoupons(Long shopId, Account user);
}
