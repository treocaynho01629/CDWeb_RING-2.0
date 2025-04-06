package com.ring.bookstore.model.dto.response.dashboard;

import com.ring.bookstore.model.dto.response.coupons.CouponDTO;

import java.util.Map;

/**
 * Represents a chart values response as {@link ChartDTO}.
 */
public record ChartDTO(String name,
                       Map<String, Long> data) {
}
