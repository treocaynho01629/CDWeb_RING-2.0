package com.ring.bookstore.dtos.orders;

import org.springframework.cglib.core.Local;

import java.time.LocalDateTime;
import java.util.List;

public record ReceiptDTO(Long id,
                         String email,
                         String name,
                         String phone,
                         String address,
                         String message,
                         LocalDateTime date,
                         Double total,
                         Double totalDiscount,
                         String username,
                         List<OrderDTO> details) {

}
