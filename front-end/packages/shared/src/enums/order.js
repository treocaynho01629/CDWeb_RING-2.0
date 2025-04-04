export const getOrderStatus = () => {
  return Object.freeze({
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
  });
};
