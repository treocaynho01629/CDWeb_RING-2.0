package com.ring.bookstore.dtos.orders;

import java.util.List;

public record CalculateDetailDTO(Long shopId,
                                 String shopName,
                                 Double totalPrice,
                                 Double totalDiscount,
                                 Double shippingFee,
                                 Double shippingDiscount,
                                 String coupon,
                                 List<CalculateItemDTO> items) {

}
