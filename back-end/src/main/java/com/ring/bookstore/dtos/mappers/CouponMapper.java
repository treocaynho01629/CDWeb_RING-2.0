package com.ring.bookstore.dtos.mappers;

import com.ring.bookstore.dtos.coupons.CouponDTO;
import com.ring.bookstore.enums.CouponType;
import com.ring.bookstore.model.Coupon;
import com.ring.bookstore.model.CouponDetail;
import org.springframework.stereotype.Service;

import java.text.NumberFormat;
import java.util.Locale;
import java.util.function.Function;

@Service
public class CouponMapper implements Function<Coupon, CouponDTO> {

    @Override
    public CouponDTO apply(Coupon coupon) {
        CouponDetail detail = coupon.getDetail();

        //Detail stuff
        NumberFormat percentFormat = NumberFormat.getPercentInstance();
        NumberFormat unitFormat = NumberFormat.getNumberInstance(Locale.US);
        unitFormat.setMaximumFractionDigits(0);
        String summary = "Giảm " + (detail.getType().equals(CouponType.SHIPPING) ? "phí vận chuyển " : "") +
                percentFormat.format(detail.getDiscount()) +
                " - giảm tối đa " + unitFormat.format(detail.getMaxDiscount()) + "đ";

        String condition = (detail.getType().equals(CouponType.MIN_AMOUNT) ? "Khi mua " : "Cho đơn hàng từ ") +
                unitFormat.format(detail.getAttribute()) + (detail.getType().equals(CouponType.SHIPPING) ? " sản phẩm" : "đ");

        return new CouponDTO(coupon.getId(),
                coupon.getCode(),
                coupon.getIsUsable(),
                detail.getType(),
                summary,
                condition,
                detail.getUsage(),
                detail.getExpDate(),
                coupon.getShop() != null ? coupon.getShop().getId() : null);
    }
}
