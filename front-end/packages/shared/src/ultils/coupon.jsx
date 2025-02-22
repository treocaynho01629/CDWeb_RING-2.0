import {
  LocalActivity,
  LocalShipping,
  ShoppingBasket,
} from "@mui/icons-material";

export const couponType = ["SHIPPING", "MIN_VALUE", "MIN_VALUE"];

export const couponTypes = {
  SHIPPING: {
    icon: <LocalShipping />,
    value: "SHIPPING",
    label: "Giảm phí ship",
    color: "primary",
  },
  MIN_VALUE: {
    icon: <LocalActivity />,
    value: "MIN_VALUE",
    label: "Giảm theo giá",
    color: "error",
  },
  MIN_AMOUNT: {
    icon: <ShoppingBasket />,
    value: "MIN_AMOUNT",
    label: "Giảm theo số lượng",
    color: "warning",
  },
};

export const couponTypeItems = [
  {
    value: "SHIPPING",
    label: "Giảm phí ship",
  },
  {
    value: "MIN_VALUE",
    label: "Giảm theo giá",
  },
  {
    value: "MIN_AMOUNT",
    label: "Giảm theo số lượng",
  },
];
