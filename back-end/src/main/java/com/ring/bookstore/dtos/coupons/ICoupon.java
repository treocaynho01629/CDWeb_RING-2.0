package com.ring.bookstore.dtos.coupons;

import com.ring.bookstore.model.Coupon;

public interface ICoupon {

    Coupon getCoupon();

    String getShopName();

    String getShopImage();
}
