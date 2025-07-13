import styled from "@emotion/styled";

//#region styled
const Message = styled.span`
  ${({ theme }) => theme.breakpoints.down("sm")} {
    font-size: 14px;
  }
`;

const Title = styled.h4`
  margin: ${({ theme }) => theme.spacing(1.5)} 0;
  margin-top: 0;
  font-weight: 420;
`;
//#endregion

export const getPaymentContent = (method) => {
  switch (method) {
    case "CASH":
      return (
        <>
          <Title>THANH TOÁN KHI NHẬN HÀNG</Title>
          <Message>
            Tiền mặt: &emsp;Phí thu hộ: 0đ. Ưu đãi về phí vận chuyển (nếu có) áp
            dụng cả với phí thu hộ.
          </Message>
        </>
      );
    case "ONLINE_PAYMENT":
      return (
        <>
          <Title>THANH TOÁN ONLINE</Title>
          <Message>Quét mã để thanh toán</Message>
        </>
      );
  }
};
