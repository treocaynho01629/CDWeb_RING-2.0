package com.ring.bookstore.dtos.mappers;

import com.ring.bookstore.dtos.coupons.CouponDTO;
import com.ring.bookstore.dtos.coupons.CouponDetailDTO;
import com.ring.bookstore.dtos.coupons.ICoupon;
import com.ring.bookstore.enums.CouponType;
import com.ring.bookstore.model.Coupon;
import com.ring.bookstore.model.CouponDetail;
import com.ring.bookstore.request.CartStateRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.text.NumberFormat;
import java.util.Locale;
import java.util.function.Function;

@Service
public class CouponMapper {

    public CouponDTO couponToDTO(ICoupon projection) {
        Coupon coupon = projection.getCoupon();
        CouponDetail detail = coupon.getDetail();

        String fileDownloadUri = projection.getShopImage() != null ?
                ServletUriComponentsBuilder
                        .fromCurrentContextPath()
                        .path("/api/images/")
                        .path(projection.getShopImage())
                        .toUriString()
                : null;

        //Detail stuff
        NumberFormat percentFormat = NumberFormat.getPercentInstance();
        NumberFormat unitFormat = NumberFormat.getCurrencyInstance(
                new Locale.Builder().setLanguage("vi").setRegion("VN").build()
        );
        unitFormat.setMaximumFractionDigits(0);
        String summary = "Giảm " + (detail.getType().equals(CouponType.SHIPPING) ? "phí vận chuyển " : "") +
                percentFormat.format(detail.getDiscount()) + " - giảm tối đa " + unitFormat.format(detail.getMaxDiscount());

        String condition = (detail.getType().equals(CouponType.MIN_AMOUNT) ? "Khi mua " : "Đơn từ ") +
                unitFormat.format(detail.getAttribute()) + (detail.getType().equals(CouponType.MIN_AMOUNT) ? " sản phẩm" : "");

        return new CouponDTO(coupon.getId(),
                coupon.getCode(),
                coupon.getIsUsable(),
                detail.getType(),
                summary,
                condition,
                detail.getUsage(),
                detail.getExpDate(),
                coupon.getShop() != null ? coupon.getShop().getId() : null,
                projection.getShopName(),
                fileDownloadUri);
    }

    public CouponDTO couponToDTO(ICoupon projection, CartStateRequest request) {

        CouponDTO coupon = couponToDTO(projection);
        boolean isUsable = isUsable(projection, request);

        return new CouponDTO(coupon.id(),
                coupon.code(),
                isUsable,
                coupon.type(),
                coupon.summary(),
                coupon.condition(),
                coupon.usage(),
                coupon.expDate(),
                coupon.shopId(),
                coupon.shopName(),
                coupon.shopImage());
    }

    public CouponDetailDTO couponToDetailDTO(ICoupon projection) {
        Coupon coupon = projection.getCoupon();
        CouponDetail detail = coupon.getDetail();

        return new CouponDetailDTO(coupon.getId(),
                coupon.getCode(),
                detail.getType(),
                detail.getAttribute(),
                detail.getMaxDiscount(),
                detail.getDiscount(),
                detail.getExpDate(),
                detail.getUsage(),
                coupon.getShop() != null ? coupon.getShop().getId() : null,
                projection.getShopName());
    }

    protected boolean isUsable(ICoupon projection, CartStateRequest request) {
        Coupon coupon = projection.getCoupon();
        CouponDetail couponDetail = coupon.getDetail();
        CouponType type = couponDetail.getType();
        double attribute = couponDetail.getAttribute();
        boolean result = false;

        //Current
        double currValue = request.getValue() != null ? request.getValue() : -1;
        int currQuantity = request.getQuantity() != null ? request.getQuantity() : -1;

        //Check conditions & apply
        if (type.equals(CouponType.MIN_AMOUNT) && currValue > -1) {
            result = currQuantity >= attribute;
        } else if (currValue > -1 &&
                (type.equals(CouponType.MIN_VALUE) || type.equals(CouponType.SHIPPING))) {
            result = currValue >= attribute;
        }

        return result;
    }
}
