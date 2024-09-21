package com.ring.bookstore.dtos;

import java.time.LocalDateTime;
import java.util.List;

public record OrderDTO(Long id,
                       String fullName,
                       String email,
                       String phone,
                       String address,
                       String message,
                       LocalDateTime date,
                       Double total,
                       String username,
                       List<OrderDetailDTO> orderDetails) {

}
