export const getOrderStatus = () => {
  return Object.freeze({
    COMPLETED: { value: "COMPLETED", label: "Đã giao", color: "success" },
    PENDING_PAYMENT: {
      value: "PENDING_PAYMENT",
      label: "Chờ thanh toán",
      color: "warning",
    },
    PENDING: { value: "PENDING", label: "Đang chờ hàng", color: "warning" },
    SHIPPING: { value: "SHIPPING", label: "Đang giao", color: "info" },
    CANCELED: { value: "CANCELED", label: "Đã huỷ", color: "error" },
    PENDING_RETURN: {
      value: "PENDING_RETURN",
      label: "Chờ trả hàng",
      color: "warning",
    },
    PENDING_REFUND: {
      value: "PENDING_REFUND",
      label: "Chờ hoàn tiền",
      color: "warning",
    },
    REFUNDED: { value: "REFUNDED", label: "Đã hoàn tiền", color: "error" },
  });
};
