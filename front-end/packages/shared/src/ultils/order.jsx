export const orderType = [
  "COMPLETED",
  "PENDING",
  "SHIPPING",
  "CANCELED",
  "REFUNDED",
];

export const orderTypes = {
  COMPLETED: { label: "Đã giao", color: "success" },
  PENDING: { label: "Đang chờ hàng", color: "primary" },
  SHIPPING: { label: "Đang giao", color: "info" },
  CANCELED: { label: "Đã huỷ", color: "error" },
  REFUNDED: { label: "Đã hoàn tiền", color: "warning" },
};

export const orderItems = [
  {
    value: "",
    label: "Tất cả",
  },
  {
    value: "PENDING",
    label: "Chờ hàng",
  },
  {
    value: "SHIPPING",
    label: "Đang giao",
  },
  {
    value: "COMPLETED",
    label: "Hoàn thành",
  },
  {
    value: "CANCELED",
    label: "Đã huỷ",
  },
  {
    value: "REFUNDED",
    label: "Trả/Hoàn tiền",
  },
];
