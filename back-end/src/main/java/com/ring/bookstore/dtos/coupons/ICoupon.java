package com.ring.bookstore.dtos.coupons;

import com.ring.bookstore.dtos.images.IImage;
import com.ring.bookstore.model.Coupon;

public interface ICoupon {

    Coupon getCoupon();

    String getShopName();

    IImage getShopImage();
}
