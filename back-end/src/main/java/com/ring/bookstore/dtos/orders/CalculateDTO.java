package com.ring.bookstore.dtos.orders;

import com.ring.bookstore.model.Coupon;

import java.util.List;

public record CalculateDTO(Double total,
                           Double productsTotal,
                           Double shippingFee,
                           Double totalDiscount,
                           Double dealDiscount,
                           Double couponDiscount,
                           Double shippingDiscount,
                           Coupon coupon,
                           List<CalculateDetailDTO> details) {

}
