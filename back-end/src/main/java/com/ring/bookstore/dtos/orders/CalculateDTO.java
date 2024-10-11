package com.ring.bookstore.dtos.orders;

import java.util.List;

public record CalculateDTO(Double total,
                           Double totalDiscount,
                           String coupon,
                           List<CalculateDetailDTO> details) {

}
