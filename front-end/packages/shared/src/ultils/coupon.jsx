import { LocalActivity, LocalShipping, ShoppingBasket } from "@mui/icons-material";

export const couponType = ['SHIPPING', 'MIN_VALUE', 'MIN_VALUE'];

export const couponTypes = {
    SHIPPING: { icon: <LocalShipping />, color: 'primary' },
    MIN_VALUE: { icon: <LocalActivity />, color: 'error' },
    MIN_AMOUNT: { icon: <ShoppingBasket />, color: 'warning' },
}