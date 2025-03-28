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
        description: "Tiêu chuẩn",
        label: "Tiêu chuẩn",
        value: "ECONOMY",
      },
      STANDARD: {
        color: "success",
        multiplier: 0.2,
        icon: "SavingsOutlined",
        description: "Tiết kiệm",
        label: "Tiết kiệm",
        value: "STANDARD",
      },
      EXPRESS: {
        color: "warning",
        multiplier: 1.5,
        icon: "RocketLaunchOutlined",
        description: "Hoả tốc",
        label: "Hoả tốc",
        value: "EXPRESS",
      },
    })
  );
};
