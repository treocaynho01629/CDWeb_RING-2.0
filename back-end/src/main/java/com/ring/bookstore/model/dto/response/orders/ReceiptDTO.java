package com.ring.bookstore.model.dto.response.orders;

import lombok.Builder;

import java.time.LocalDateTime;
import java.util.List;

@Builder
public record ReceiptDTO(Long id,
                         String email,
                         String name,
                         String image,
                         String phone,
                         String address,
                         String message,
                         LocalDateTime date,
                         Double total,
                         Double totalDiscount,
                         String username,
                         List<OrderDTO> details) {

}
