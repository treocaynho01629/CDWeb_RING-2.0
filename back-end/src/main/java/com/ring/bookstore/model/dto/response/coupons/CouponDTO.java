package com.ring.bookstore.model.dto.response.coupons;

import com.ring.bookstore.model.enums.CouponType;

import java.time.LocalDate;

public record CouponDTO(Long id,
                        String code,
                        Boolean isUsable,
                        CouponType type,
                        String summary,
                        String condition,
                        Short usage,
                        LocalDate expDate,
                        Long shopId,
                        String shopName,
                        String shopImage) {

}
