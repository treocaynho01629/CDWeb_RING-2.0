package com.ring.bookstore.model.dto.response.orders;

import com.ring.bookstore.model.enums.PaymentStatus;
import com.ring.bookstore.model.enums.PaymentType;
import lombok.Builder;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Represents a receipt response as {@link ReceiptDetailDTO}.
 */
@Builder
public record ReceiptDetailDTO(Long id,
                               String name,
                               String phone,
                               String address,
                               String email,
                               LocalDateTime orderedDate,
                               LocalDateTime date,
                               Double total,
                               Double totalDiscount,
                               PaymentType paymentType,
                               PaymentStatus paymentStatus,
                               LocalDateTime expiredAt,
                               List<OrderDTO> details) {

}
