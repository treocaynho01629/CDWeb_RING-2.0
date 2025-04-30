package com.ring.bookstore.model.dto.projection.orders;

import com.ring.bookstore.model.enums.PaymentStatus;
import com.ring.bookstore.model.enums.PaymentType;

import java.time.LocalDateTime;

/**
 * Represents a receipt detail projection as {@link IReceiptDetail}
 */
public interface IReceiptDetail {

    Long getId();

    String getEmail();

    String getPhone();

    String getName();

    String getCompanyName();

    String getCity();

    String getAddress();

    LocalDateTime getOrderedDate();

    LocalDateTime getDate();

    Double getTotal();

    Double getTotalDiscount();

    PaymentType getPaymentType();

    PaymentStatus getPaymentStatus();

    LocalDateTime getExpiredAt();
}
