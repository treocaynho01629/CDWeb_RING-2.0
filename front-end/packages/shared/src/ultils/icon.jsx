import { lazy } from "react";

export const iconList = {
  LocalShipping: lazy(() => import("@mui/icons-material/LocalShipping")),
  LocalActivity: lazy(() => import("@mui/icons-material/LocalActivity")),
  ShoppingBasket: lazy(() => import("@mui/icons-material/ShoppingBasket")),
  LocalAtm: lazy(() => import("@mui/icons-material/LocalAtm")),
  CreditCard: lazy(() => import("@mui/icons-material/CreditCard")),
  Payments: lazy(() => import("@mui/icons-material/Payments")),
  BookOnline: lazy(() => import("@mui/icons-material/BookOnline")),
  LocalShippingOutlined: lazy(
    () => import("@mui/icons-material/LocalShippingOutlined")
  ),
  SavingsOutlined: lazy(() => import("@mui/icons-material/SavingsOutlined")),
  RocketLaunchOutlined: lazy(
    () => import("@mui/icons-material/RocketLaunchOutlined")
  ),
};
