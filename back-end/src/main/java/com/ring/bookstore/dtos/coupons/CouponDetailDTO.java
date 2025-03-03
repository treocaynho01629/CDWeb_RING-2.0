package com.ring.bookstore.dtos.coupons;

import com.ring.bookstore.enums.CouponType;

import java.math.BigDecimal;
import java.time.LocalDate;

public record CouponDetailDTO(Long id,
                              String code,
                              CouponType type,
                              Double attribute,
                              Double maxDiscount,
                              BigDecimal discount,
                              LocalDate expDate,
                              Short usage,
                              Long shopId,
                              String shopName) {

}
