package com.ring.bookstore.model.mappers;

import com.cloudinary.Cloudinary;
import com.cloudinary.Transformation;
import com.ring.bookstore.model.dto.response.coupons.CouponDTO;
import com.ring.bookstore.model.dto.response.coupons.CouponDetailDTO;
import com.ring.bookstore.model.dto.projection.coupons.ICoupon;
import com.ring.bookstore.model.enums.CouponType;
import com.ring.bookstore.model.entity.Coupon;
import com.ring.bookstore.model.entity.CouponDetail;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.text.NumberFormat;
import java.util.Locale;

@RequiredArgsConstructor
@Service
public class CouponMapper {

    private final Cloudinary cloudinary;

    public CouponDTO couponToDTO(ICoupon projection) {
        Coupon coupon = projection.getCoupon();
        CouponDetail detail = coupon.getDetail();
        String url = projection.getShopImage() != null ?
                cloudinary.url().transformation(new Transformation()
                                .aspectRatio("1.0")
                                .width(55)
                                .crop("thumb")
                                .chain()
                                .radius("max")
                                .quality(50)
                                .fetchFormat("auto"))
                        .secure(true).generate(projection.getShopImage().getPublicId())
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
                url);
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
}
