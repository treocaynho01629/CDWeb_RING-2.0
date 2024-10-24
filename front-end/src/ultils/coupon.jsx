import { LocalActivity, LocalShipping, ShoppingBasket } from "@mui/icons-material";

export const getCouponSumary = (type) => {
    switch (type) {
        case 'SHIPPING':
            return { name: 'Giảm phí vận chuyển', sumary: 'Cho đơn hàng từ', unit: 'đ', color: 'primary', icon: <LocalShipping /> };
        case 'MIN_VALUE':
            return { name: 'Giảm', sumary: 'Cho đơn hàng từ', unit: 'đ', color: 'error', icon: <LocalActivity /> };
        case 'MIN_AMOUNT':
            return { name: 'Giảm', sumary: 'Khi mua', unit: ' sản phẩm', color: 'warning', icon: <ShoppingBasket /> };
    }
}