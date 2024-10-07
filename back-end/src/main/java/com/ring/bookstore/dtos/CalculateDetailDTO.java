package com.ring.bookstore.dtos;

import java.util.List;

//Order detail
public record CalculateDetailDTO(Long id,
                                 Long shopId,
                                 String shopName,
                                 Double totalPrice,
                                 Double totalDiscount,
                                 Double shippingFee,
                                 Double shippingDiscount,
                                 List<OrderItemDTO> items) {

}
