package com.ring.bookstore.model.dto.response.orders;

import com.ring.bookstore.model.dto.response.images.IImage;

import java.time.LocalDateTime;

public interface IReceiptSummary {
    Long getId();

    IImage getImage();

    String getName();

    LocalDateTime getDate();

    Double getTotalPrice();

    Integer getTotalItems();
}
