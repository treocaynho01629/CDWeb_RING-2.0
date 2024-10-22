package com.ring.bookstore.dtos.orders;

import com.ring.bookstore.model.Coupon;

import java.util.List;

public record CalculateDetailDTO(Long shopId,
                                 String shopName,
                                 Double totalPrice,
                                 Double totalDiscount,
                                 Double couponDiscount,
                                 Double shippingFee,
                                 Double shippingDiscount,
                                 Coupon coupon,
                                 List<CalculateItemDTO> items) {

}
