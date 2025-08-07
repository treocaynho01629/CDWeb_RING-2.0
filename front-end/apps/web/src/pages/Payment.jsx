import styled from "@emotion/styled";
import useReCaptcha from "@ring/auth/useReCaptcha";
import { useState, useEffect, useRef, lazy, Suspense } from "react";
import { usePayOS } from "@payos/payos-checkout";
import { keyframes } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { Link, useNavigate, useSearchParams, useParams } from "react-router";
import { useCreatePaymentLinkMutation } from "../features/orders/ordersApiSlice";
import { AuthTitle, ConfirmButton } from "@ring/ui/AuthComponents";
import { Instruction } from "@ring/ui/Components";
import SimpleNavbar from "@ring/ui/SimpleNavbar";
import HighlightOff from "@mui/icons-material/HighlightOff";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import TaskAlt from "@mui/icons-material/TaskAlt";

const PendingModal = lazy(() => import("@ring/ui/PendingModal"));
const ReCaptcha = lazy(() => import("@ring/auth/ReCaptcha"));

//#region styled
const pop = keyframes`
    0% { 
        transform: scale(0) rotate(-5deg) translateZ(0);
    }
    40% { 
        transform: scale(1.1) rotate(5deg) translateZ(0);
    }
    100% { 
        transform: scale(1) rotate(0deg) translateZ(0);
    }
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100dvh;
`;

const IconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.spacing(2)};
  animation: ${pop} 0.5s ease-in-out;

  svg {
    font-size: 180px;
  }
`;

const Container = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-top: ${({ theme }) => theme.spacing(-4)};

  ${({ theme }) => theme.breakpoints.down("md")} {
    margin-top: ${({ theme }) => theme.spacing(4)};
  }
`;

const ContentContainer = styled.div`
  position: relative;
  width: 90%;
  max-width: 650px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding-top: ${({ theme }) => theme.spacing(2)};
`;

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  svg {
    font-size: 32px;
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Message = styled.p`
  font-size: 16px;
  width: 100%;

  ${({ theme }) => theme.breakpoints.down("md")} {
    font-size: 14px;
  }
`;

const PaymentContainer = styled.div`
  height: 335px;
  width: 320px;

  ${({ theme }) => theme.breakpoints.down("sm")} {
    height: 450px;
  }
`;
//#endregion

function Payment() {
  const { id } = useParams();
  const initRef = useRef(false);
  const navigate = useNavigate();
  const [pending, setPending] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [err, setErr] = useState(null);
  const [createPaymentLink] = useCreatePaymentLinkMutation();
  const [payOSConfig, setPayOSConfig] = useState({
    RETURN_URL: window.location.origin + "/payment?state=success", // required
    ELEMENT_ID: "embedded-payment-container", // required
    CHECKOUT_URL: null, // required
    embedded: true,
    onSuccess: (event) => {
      setIsOpen(false);
      navigate("/payment?state=success", { replace: true });
      enqueueSnackbar("Thanh toán thành công!", { variant: "success" });
    },
    onCancel: (event) => {
      setIsOpen(false);
      navigate("/payment?state=cancel", { replace: true });
      enqueueSnackbar("Thanh toán thất bại!", { variant: "error" });
    },
  });
  const { open, exit } = usePayOS(payOSConfig);

  //Recaptcha
  const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
  const recaptchaV3SiteKey = import.meta.env.VITE_RECAPTCHA_V3_SITE_KEY;
  const { reCaptchaLoaded, generateReCaptchaToken } =
    useReCaptcha(recaptchaV3SiteKey);
  const [challenge, setChallenge] = useState(false); //Toggle if marked suspicious by v3
  const [token, setToken] = useState("");

  const handleGetPaymentLink = async () => {
    if (pending || !id) return;
    setPending(true);
    exit();

    const recaptchaToken = challenge
      ? token
      : await generateReCaptchaToken("payment");

    createPaymentLink({
      token: recaptchaToken,
      source: challenge ? "v2" : "v3",
      id,
    })
      .unwrap()
      .then((data) => {
        // Stuff
        setPayOSConfig((oldConfig) => ({
          ...oldConfig,
          CHECKOUT_URL: data?.checkoutUrl,
        }));
        if (!data?.checkoutUrl) navigate("/error", { replace: true });
        setPending(false);
      })
      .catch((err) => {
        console.error(err);

        setErr(err);
        if (!err?.status) {
          setErrMsg("Server không phản hồi");
        } else if (err?.status === 404) {
          navigate("/error", { replace: true });
        } else if (err?.status === 403) {
          setErrMsg("Bạn không có quyền làm điều này!");
        } else if (err?.status === 412) {
          setChallenge(true);
          setErrMsg("Yêu cầu của bạn cần xác thực lại!");
        } else {
          setErrMsg("Tạo đường dẫn liên kết thanh toán thất bại!");
        }

        setPending(false);
      });
  };

  useEffect(() => {
    if (!reCaptchaLoaded || initRef.current) return;
    initRef.current = true;
    handleGetPaymentLink();
  }, [reCaptchaLoaded]);

  useEffect(() => {
    if (payOSConfig.CHECKOUT_URL != null) {
      open();
      setIsOpen(true);
    }
  }, [payOSConfig]);

  const state = searchParams.get("state");

  return (
    <Wrapper>
      {pending && (
        <Suspense fallBack={null}>
          <PendingModal open={pending} message="Đang gửi yêu cầu..." />
        </Suspense>
      )}
      <SimpleNavbar />
      <Container>
        <ContentContainer>
          {state ? (
            <div className="main-box">
              <AuthTitle>
                {state == "success"
                  ? "Thanh toán thành công!"
                  : "Thanh toán thất bại!"}
              </AuthTitle>
              <Content>
                <IconContainer key={state}>
                  {state == "success" ? (
                    <TaskAlt color="success" />
                  ) : (
                    state == "cancel" && <HighlightOff color="error" />
                  )}
                </IconContainer>
                <ButtonContainer>
                  <Link
                    to={id ? `/profile/order/checkout/${id}` : "/profile/order"}
                    style={{ width: "100%" }}
                  >
                    <ConfirmButton
                      variant="contained"
                      color="primary"
                      size="large"
                      sx={{ width: { xs: "100%", sm: "auto" } }}
                    >
                      Xem đơn hàng
                    </ConfirmButton>
                  </Link>
                </ButtonContainer>
              </Content>
            </div>
          ) : (
            <div className="main-box">
              <TitleContainer>
                <Link
                  to={id ? `/profile/order/checkout/${id}` : "/profile/order"}
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <KeyboardArrowLeft />
                </Link>
                <AuthTitle>Thanh toán đơn hàng</AuthTitle>
              </TitleContainer>
              <Instruction
                display={errMsg ? "block" : "none"}
                aria-live="assertive"
              >
                {errMsg}
              </Instruction>
              {reCaptchaLoaded && challenge && (
                <Suspense fallback={null}>
                  <ReCaptcha
                    onVerify={(token) => setToken(token)}
                    recaptchaSiteKey={recaptchaSiteKey}
                  />
                </Suspense>
              )}
              <Content>
                {isOpen && (
                  <Message>
                    Sau khi thực hiện thanh toán thành công, vui lòng đợi từ 5 -
                    10s để hệ thống tự động cập nhật.
                  </Message>
                )}
                <PaymentContainer id="embedded-payment-container"></PaymentContainer>
              </Content>
            </div>
          )}
        </ContentContainer>
      </Container>
    </Wrapper>
  );
}

export default Payment;
