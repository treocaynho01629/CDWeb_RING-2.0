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
