package com.ring.bookstore.dtos.orders;

import com.ring.bookstore.dtos.coupons.CouponDTO;

import java.util.List;

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
