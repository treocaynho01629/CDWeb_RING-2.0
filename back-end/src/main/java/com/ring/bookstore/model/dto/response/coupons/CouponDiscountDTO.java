package com.ring.bookstore.model.dto.response.coupons;

/**
 * Represents a coupon discount response as {@link CouponDiscountDTO}.
 */
public record CouponDiscountDTO(Double discountValue,
                                Double discountShipping) {

}
