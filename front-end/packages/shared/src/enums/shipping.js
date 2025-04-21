import { store } from "@ring/redux";

export const getShippingType = () => {
  const enums = store?.getState()?.enum?.enums;

  return (
    enums?.["ShippingType"]?.enums ??
    Object.freeze({
      ECONOMY: {
        color: "",
        multiplier: 1,
        icon: "LocalShippingOutlined",
        description: "2-4 ngày giao hàng",
        label: "Tiêu chuẩn",
        value: "ECONOMY",
      },
      STANDARD: {
        color: "success",
        multiplier: 0.2,
        icon: "SavingsOutlined",
        description: "5-7 ngày giao hàng",
        label: "Tiết kiệm",
        value: "STANDARD",
      },
      EXPRESS: {
        color: "warning",
        multiplier: 1.5,
        icon: "RocketLaunchOutlined",
        description: "1-2 ngày giao hàng",
        label: "Hoả tốc",
        value: "EXPRESS",
      },
    })
  );
};
