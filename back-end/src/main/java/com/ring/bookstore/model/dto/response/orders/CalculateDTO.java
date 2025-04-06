package com.ring.bookstore.model.dto.response.orders;

import com.ring.bookstore.model.dto.response.coupons.CouponDTO;

import java.util.List;

public record CalculateDTO(Double total,
                           Double productsTotal,
                           Double shippingFee,
                           Double totalDiscount,
                           Double dealDiscount,
                           Double couponDiscount,
                           Double shippingDiscount,
                           CouponDTO coupon,
                           List<CalculateDetailDTO> details) {

}
