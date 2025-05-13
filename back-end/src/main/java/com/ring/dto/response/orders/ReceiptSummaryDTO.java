package com.ring.dto.response.orders;

import lombok.Builder;

import java.time.LocalDateTime;

/**
 * Represents a receipt summary response as {@link ReceiptSummaryDTO}.
 */
@Builder
public record ReceiptSummaryDTO(Long id,
                                String image,
                                String name,
                                LocalDateTime date,
                                Double totalPrice,
                                Integer totalItems) {

}
