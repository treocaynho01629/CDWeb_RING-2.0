export const getPaymentType = () => {
  return Object.freeze({
    CASH: {
      value: "CASH",
      label: "Thanh toán bằng tiền mặt",
      description: "",
      icon: "LocalAtm",
    },
    ONLINE_PAYMENT: {
      value: "ONLINE_PAYMENT",
      label: "Ví Online/Chuyển khoản",
      description: "Quét Mã QR từ ứng dụng hoặc chuyển khoản",
      icon: "BookOnline",
    },
  });
};

export const getPaymentStatus = () => {
  return Object.freeze({
    PENDING: { value: "PENDING", label: "Chờ thanh toán", color: "warning" },
    PAID: { value: "PAID", label: "Đã thanh toán", color: "success" },
    CANCELED: { value: "CANCELED", label: "Đã huỷ", color: "error" },
    PENDING_REFUND: {
      value: "PENDING_REFUND",
      label: "Chờ hoàn tiền",
      color: "warning",
    },
    REFUNDED: { value: "REFUNDED", label: "Đã hoàn tiền", color: "error" },
  });
};
