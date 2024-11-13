package com.ring.bookstore.dtos.orders;

import java.time.LocalDateTime;
import java.util.List;

public record ReceiptDTO(Long id,
                         String fullName,
                         String email,
                         String phone,
                         String address,
                         String message,
                         LocalDateTime date,
                         Double total,
                         Double totalDiscount,
                         String username,
                         List<OrderDTO> details) {

}
