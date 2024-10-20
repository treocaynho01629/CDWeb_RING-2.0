package com.ring.bookstore.dtos.orders;

import java.util.List;

public record CalculateDTO(Double total,
                           Double productsTotal,
                           Double shippingFee,
                           Double totalDiscount,
                           Double dealDiscount,
                           Double couponDiscount,
                           Double shippingDiscount,
                           String coupon,
                           List<CalculateDetailDTO> details) {

}
