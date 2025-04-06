package com.ring.bookstore.model.dto.response.coupons;

import com.ring.bookstore.model.dto.response.images.IImage;
import com.ring.bookstore.model.entity.Coupon;

public interface ICoupon {

    Coupon getCoupon();

    String getShopName();

    IImage getShopImage();
}
