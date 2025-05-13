package com.ring.dto.projection.orders;

import com.ring.dto.projection.images.IImage;

import java.time.LocalDateTime;

/**
 * Represents a receipt summary projection as {@link IReceiptSummary}, containing details about the receipt's ID,
 * product's image, name, date, total price, and total items.
 */
public interface IReceiptSummary {

    Long getId();

    IImage getImage();

    String getName();

    LocalDateTime getDate();

    Double getTotalPrice();

    Integer getTotalItems();
}
