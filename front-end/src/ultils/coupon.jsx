import { LocalActivity, LocalShipping, ShoppingBasket } from "@mui/icons-material";

export const getCouponSummary = (type) => {
    switch (type) {
        case 'SHIPPING':
            return { color: 'primary', icon: <LocalShipping /> };
        case 'MIN_VALUE':
            return { color: 'error', icon: <LocalActivity /> };
        case 'MIN_AMOUNT':
            return { color: 'warning', icon: <ShoppingBasket /> };
    }
}

export const couponType = ['SHIPPING', 'MIN_VALUE', 'MIN_VALUE'];