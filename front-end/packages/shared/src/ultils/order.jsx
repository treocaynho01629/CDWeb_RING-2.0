export const orderType = [
  "COMPLETED",
  "PENDING",
  "SHIPPING",
  "CANCELED",
  "PENDING_REFUND",
  "REFUNDED",
];

export const orderTypes = {
  COMPLETED: { value: "COMPLETED", label: "Đã giao", color: "success" },
  PENDING: { value: "PENDING", label: "Đang chờ hàng", color: "warning" },
  SHIPPING: { value: "SHIPPING", label: "Đang giao", color: "info" },
  CANCELED: { value: "CANCELED", label: "Đã huỷ", color: "error" },
  PENDING_REFUND: {
    value: "PENDING_REFUND",
    label: "Chờ trả hàng",
    color: "warning",
  },
  REFUNDED: { value: "REFUNDED", label: "Đã hoàn tiền", color: "error" },
};

export const orderItems = [
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
    value: "PENDING_REFUND",
    label: "Chờ trả hàng",
  },
  {
    value: "REFUNDED",
    label: "Trả/Hoàn tiền",
  },
];
