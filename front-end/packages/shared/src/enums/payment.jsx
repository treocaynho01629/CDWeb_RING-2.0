export const PaymentType = Object.freeze({
  CASH: {
    value: "CASH",
    label: "Thanh toán tiền mặt",
    description: "",
    icon: "LocalAtm",
  },
  CREDIT_CARD: {
    value: "CREDIT_CARD",
    label: "Thẻ tín dụng",
    description: "",
    icon: "CreditCard",
  },
  DEBIT_CARD: {
    value: "DEBIT_CARD",
    label: "Thẻ ATM",
    description: "Hỗ trợ Internet Banking",
    icon: "Payments",
  },
  ONLINE_PAYMENT: {
    value: "ONLINE_PAYMENT",
    label: "Ví Online",
    description: "Quét Mã QR từ ứng dụng",
    icon: "BookOnline",
  },
});
