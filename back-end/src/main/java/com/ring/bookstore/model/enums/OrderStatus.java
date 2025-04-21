package com.ring.bookstore.model.enums;

/**
 * Enum representing the order status as {@link OrderStatus}.
 */
public enum OrderStatus {
    PENDING_PAYMENT,
    PENDING,
    SHIPPING,
    COMPLETED,
    CANCELED,
    PENDING_RETURN,
    PENDING_REFUND,
    REFUNDED,
}
