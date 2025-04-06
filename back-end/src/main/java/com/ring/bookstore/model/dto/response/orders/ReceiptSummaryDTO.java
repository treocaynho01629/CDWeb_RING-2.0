package com.ring.bookstore.model.dto.response.orders;

import lombok.Builder;

import java.time.LocalDateTime;

//Order detail
@Builder
public record ReceiptSummaryDTO(Long id,
                                String image,
                                String name,
                                LocalDateTime date,
                                Double totalPrice,
                                Integer totalItems) {

}
