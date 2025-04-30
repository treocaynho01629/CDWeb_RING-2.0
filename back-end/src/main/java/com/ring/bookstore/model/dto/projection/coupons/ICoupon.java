package com.ring.bookstore.model.dto.projection.coupons;

import com.ring.bookstore.model.dto.projection.images.IImage;
import com.ring.bookstore.model.entity.Coupon;

/**
 * Represents a coupon projection as {@link ICoupon}, containing details about the coupon,
 * the shop offering the coupon, and the shop's image.
 */
public interface ICoupon {

    Coupon getCoupon();

    String getShopName();

    IImage getShopImage();
}
