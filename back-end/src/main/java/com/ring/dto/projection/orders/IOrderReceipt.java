package com.ring.dto.projection.orders;

import com.ring.dto.projection.images.IImage;

import java.time.LocalDateTime;

/**
 * Represents an order receipt projection as {@link IOrderReceipt}
 */
public interface IOrderReceipt {

    Long getId();

    String getEmail();

    String getPhone();

    String getName();

    String getUsername();

    IImage getImage();

    String getAddress();

    LocalDateTime getDate();

    Double getTotal();

    Double getTotalDiscount();
}
