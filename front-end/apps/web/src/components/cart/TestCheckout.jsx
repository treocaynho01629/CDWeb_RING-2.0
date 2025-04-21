import { useState, useEffect, useRef } from "react";
import { usePayOS } from "@payos/payos-checkout";
import { useCreatePaymentLinkMutation } from "../../features/orders/ordersApiSlice";
import { AuthTitle, ConfirmButton, Message } from "@ring/ui";
import { Box, Stack } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import styled from "@emotion/styled";
import { Link } from "react-router";
import { Check } from "@mui/icons-material";

//#region styled
const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding-top: ${({ theme }) => theme.spacing(2)};
`;
//#endregion

const TestCheckout = ({ pending, setPending, test }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const initRef = useRef(false);
  const [createPaymentLink, { isLoading, isError }] =
    useCreatePaymentLinkMutation();
  const [payOSConfig, setPayOSConfig] = useState({
    RETURN_URL: window.location.origin + "/profile/order", // required
    ELEMENT_ID: "embedded-payment-container", // required
    CHECKOUT_URL: null, // required
    embedded: true, // Nếu dùng giao diện nhúng
    onSuccess: (event) => {
      //TODO: Hành động sau khi người dùng thanh toán đơn hàng thành công
      setIsOpen(false);
      setMessage("Thanh toán thành công");
      enqueueSnackbar("Thanh toán thành công!", { variant: "success" });
    },
  });
  const { open, exit } = usePayOS(payOSConfig);
  const handleGetPaymentLink = async () => {
    if (pending || !test) return;
    setPending(true);
    exit();
    const { enqueueSnackbar } = await import("notistack");
    createPaymentLink(test)
      .unwrap()
      .then((data) => {
        // Stuff
        console.log(data);
        setPayOSConfig((oldConfig) => ({
          ...oldConfig,
          CHECKOUT_URL: data.checkoutUrl,
        }));
        setIsOpen(true);
        setPending(false);
      })
      .catch((err) => {
        enqueueSnackbar("Thanh toán thất bại!", { variant: "error" });
        console.error(err);
        setPending(false);
      });
  };
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;
    handleGetPaymentLink();
  }, []);
  useEffect(() => {
    if (payOSConfig.CHECKOUT_URL != null) {
      open();
    }
  }, [payOSConfig]);
  return message ? (
    <div className="main-box">
      <AuthTitle>Thanh toán thành công</AuthTitle>
      <Stack spacing={2.5} direction="column">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Check color="primary" sx={{ fontSize: "150px" }} />
          <Message>{message}</Message>
        </Box>
        <ButtonContainer>
          <Link
            to={"/profile/order"}
            style={{ width: "100%", marginRight: "8px" }}
          >
            <ConfirmButton variant="contained" color="primary" size="large">
              Xem đơn hàng
            </ConfirmButton>
          </Link>
        </ButtonContainer>
      </Stack>
    </div>
  ) : (
    <div className="main-box">
      <AuthTitle>Thanh toán đơn hàng</AuthTitle>
      <Stack spacing={2.5} direction="column">
        {isOpen && (
          <div style={{ padding: "2px" }}>
            Sau khi thực hiện thanh toán thành công, vui lòng đợi từ 5 - 10s để
            hệ thống tự động cập nhật.
          </div>
        )}
        <div
          id="embedded-payment-container"
          style={{
            height: "350px",
          }}
        ></div>
        <ButtonContainer>
          <Link
            to={"/profile/order"}
            style={{ width: "100%", marginRight: "8px" }}
          >
            <ConfirmButton variant="outlined" color="error" size="large">
              Thanh toán sau
            </ConfirmButton>
          </Link>
        </ButtonContainer>
      </Stack>
    </div>
  );
};

// const Message = ({ message }) => (
//   <div className="main-box">
//     <div className="checkout">
//       <div class="product" style={{ textAlign: "center", fontWeight: "500" }}>
//         <p>{message}</p>
//       </div>
//       <form action="/">
//         <button type="submit" id="create-payment-link-btn">
//           Quay lại trang thanh toán
//         </button>
//       </form>
//     </div>
//   </div>
// );

export default TestCheckout;
