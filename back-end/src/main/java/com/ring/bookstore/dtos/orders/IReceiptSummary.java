package com.ring.bookstore.dtos.orders;

import java.time.LocalDateTime;

public interface IReceiptSummary {
    Long getId();
    String getImage();
    String getName();
    LocalDateTime getDate();
    Double getTotalPrice();
    Integer getTotalItems();
}
