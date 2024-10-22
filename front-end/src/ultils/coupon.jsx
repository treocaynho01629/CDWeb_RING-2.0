import { LocalActivity, LocalShipping, ShoppingBasket } from "@mui/icons-material";

export const getCouponSumary = (type) => {
    switch (type) {
        case 'SHIPPING':
            return { name: 'Mã giảm phí vận chuyển', sumary: 'Áp dụng cho đơn hàng từ', unit: 'đ', color: 'primary', icon: <LocalShipping /> };
        case 'MIN_VALUE':
            return { name: 'Mã giảm', sumary: 'Áp dụng cho đơn hàng từ', unit: 'đ', color: 'error', icon: <LocalActivity /> };
        case 'MIN_AMOUNT':
            return { name: 'Mã giảm', sumary: 'Áp dụng khi mua', unit: 'sản phẩm', color: 'warning', icon: <ShoppingBasket /> };
    }
}