package com.ring.bookstore.model.dto.response.orders;

import com.ring.bookstore.model.dto.response.coupons.CouponDTO;

import java.util.List;

/**
 * Represents a cart detail response as {@link CalculateDetailDTO}.
 */
public record CalculateDetailDTO(Long shopId,
                                 String shopName,
                                 Double totalPrice,
                                 Double totalDiscount,
                                 Double couponDiscount,
                                 Double shippingFee,
                                 Double shippingDiscount,
                                 CouponDTO coupon,
                                 List<CalculateItemDTO> items) {

}
