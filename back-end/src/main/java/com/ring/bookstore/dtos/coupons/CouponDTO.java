package com.ring.bookstore.dtos.coupons;

import com.ring.bookstore.enums.CouponType;

import java.math.BigDecimal;
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
