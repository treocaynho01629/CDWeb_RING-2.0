package com.ring.bookstore.dtos.orders;

import com.ring.bookstore.dtos.images.IImage;

import java.time.LocalDateTime;

public interface IReceiptSummary {
    Long getId();

    IImage getImage();

    String getName();

    LocalDateTime getDate();

    Double getTotalPrice();

    Integer getTotalItems();
}
