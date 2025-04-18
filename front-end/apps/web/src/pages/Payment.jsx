import styled from "@emotion/styled";
import { useState, lazy, Suspense } from "react";
import { useLocation, useParams } from "react-router";
import { useReCaptcha } from "@ring/auth";
import SimpleNavbar from "@ring/ui/SimpleNavbar";
import TestCheckout from "../components/cart/TestCheckout";

const PendingModal = lazy(() => import("@ring/ui/PendingModal"));
const ForgotTab = lazy(() => import("../components/authorize/ForgotTab"));
const ResetTab = lazy(() => import("../components/authorize/ResetTab"));

//#region styled
const Wrapper = styled.div`
  display: flex;
  overflow: hidden;
  height: 100dvh;

  ${({ theme }) => theme.breakpoints.down("md")} {
    flex-direction: column-reverse;
  }
`;

const Container = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  height: 100%;
  width: 100%;

  ${({ theme }) => theme.breakpoints.down("md")} {
    margin-top: -${({ theme }) => theme.spacing(8)};
  }
`;

const ContentContainer = styled.div`
  margin-top: 150px;
  position: relative;
  width: 90%;
  max-width: 650px;
`;
//#endregion

function Payment() {
  const { token } = useParams();
  const [pending, setPending] = useState(false);
  const location = useLocation();
  const test = location.state?.test;
  console.log(test);

  //Recaptcha
  const { reCaptchaLoaded, generateReCaptchaToken } = useReCaptcha();

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
          <TestCheckout {...{ pending, setPending, test }} />
        </ContentContainer>
      </Container>
    </Wrapper>
  );
}

export default Payment;
