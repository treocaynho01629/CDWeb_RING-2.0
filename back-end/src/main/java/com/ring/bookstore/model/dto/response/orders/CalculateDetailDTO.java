package com.ring.bookstore.model.dto.response.orders;

import com.ring.bookstore.model.dto.response.coupons.CouponDTO;

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
