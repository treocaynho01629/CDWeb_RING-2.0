import {
  LocalShippingOutlined,
  RocketLaunchOutlined,
  SavingsOutlined,
} from "@mui/icons-material";

export const shippingType = ["STANDARD", "ECONOMY", "EXPRESS"];

export const shippingItems = [
  {
    value: "STANDARD",
    label: "Tiêu chuẩn",
    description: "2-4 ngày giao hàng",
    price: 10000,
    color: "",
    icon: <LocalShippingOutlined />,
  },
  {
    value: "ECONOMY",
    label: "Tiết kiệm",
    description: "5-7 ngày giao hàng",
    price: 2000,
    color: "success",
    icon: <SavingsOutlined />,
  },
  {
    value: "EXPRESS",
    label: "Hoả tốc",
    description: "1-2 ngày giao hàng",
    price: 15000,
    color: "warning",
    icon: <RocketLaunchOutlined />,
  },
];
