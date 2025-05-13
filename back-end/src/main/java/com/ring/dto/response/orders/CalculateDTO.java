package com.ring.dto.response.orders;

import com.ring.dto.response.coupons.CouponDTO;
import lombok.Builder;

import java.util.List;

/**
 * Represents a cart calculation response as {@link CalculateDTO}.
 */
@Builder
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
