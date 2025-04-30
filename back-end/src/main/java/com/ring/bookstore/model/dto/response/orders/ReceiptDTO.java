package com.ring.bookstore.model.dto.response.orders;

import lombok.Builder;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Represents a receipt response as {@link ReceiptDTO}.
 */
@Builder
public record ReceiptDTO(Long id,
        String email,
        String name,
        String image,
        String phone,
        String address,
        LocalDateTime date,
        Double total,
        Double totalDiscount,
        String username,
        List<OrderDTO> details) {

}
