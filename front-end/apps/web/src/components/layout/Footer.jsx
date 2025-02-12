import styled from "@emotion/styled";
import {
  Facebook,
  YouTube,
  LinkedIn,
  Twitter,
  QrCode,
  LocalAtm,
  SystemSecurityUpdateGood,
  CreditCard,
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";
import { Grid2 as Grid } from "@mui/material";
import { useState } from "react";

//#region styled
const Container = styled.div`
  background-color: ${(props) => props.theme.palette.divider};
  border-top: 2px solid ${(props) => props.theme.palette.primary.main};
  margin-top: 15dvh;
  padding-top: 20px;
  width: 100%;
`;

const Wrapper = styled.div`
  padding-right: 15px;
  padding-left: 15px;
  margin-right: auto;
  margin-left: auto;
  display: flex;
  justify-content: center;

  @media (min-width: 768px) {
    width: 750px;
  }
  @media (min-width: 992px) {
    width: 970px;
  }
  @media (min-width: 1200px) {
    width: 1170px;
  }
`;

const BotFooter = styled.div`
  height: 35px;
  padding: 0 30px;
  background-color: ${(props) => props.theme.palette.action.focus};
  display: flex;
  justify-content: space-between;
  align-items: center;

  ${(props) => props.theme.breakpoints.down("sm")} {
    padding: 0 15px;
    justify-content: center;
  }
`;

const Logo = styled.img`
  max-height: 70px;
  width: auto;
  object-fit: contain;
  object-position: left;

  ${(props) => props.theme.breakpoints.down("md")} {
    max-height: 55px;
  }

  ${(props) => props.theme.breakpoints.down("sm")} {
    max-height: 40px;
    margin: 10px 0;
  }
`;

const Description = styled.p`
  margin: 14px 0px;
  font-size: 13px;

  ${(props) => props.theme.breakpoints.down("sm")} {
    text-align: center;
    margin: 5px 0;
  }
`;

const Social = styled.div`
  display: flex;
  margin-top: 10px;
  flex-wrap: wrap;
`;

const SocialIcon = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  color: ${(props) => props.theme.palette.common.white};
  background-color: #${(props) => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 7px;
  margin-bottom: 7px;
  transition: all 0.25s ease;
  cursor: pointer;

  svg {
    font-size: 20px;
  }

  &:hover {
    transform: scale(1.1);
    border-radius: 45%;
  }
`;

const AddressContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 30px 0px;

  ${(props) => props.theme.breakpoints.down("lg")} {
    align-items: center;
    padding: 10px;
  }

  ${(props) => props.theme.breakpoints.down("sm")} {
    padding-top: 0;
    margin-bottom: 5px;
    border-bottom: 0.5px solid ${(props) => props.theme.palette.divider};
  }
`;

const Title = styled.h4`
  display: flex;
  justify-content: space-between;
  align-items: center;

  svg {
    display: none;
  }

  ${(props) => props.theme.breakpoints.down("sm")} {
    margin: 5px 10px;
    color: ${(props) => props.theme.palette.primary.dark};

    svg {
      display: block;
    }
  }
`;

const List = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;

  ${(props) => props.theme.breakpoints.down("sm")} {
    display: none;
  }
`;

const MobileList = styled.ul`
  margin: 5px 0;
  list-style: none;
  display: none;

  ${(props) => props.theme.breakpoints.down("sm")} {
    display: block;
  }
`;

const ListItem = styled.li`
  width: 90%;
  font-size: 13px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: all 0.25s ease;

  &:hover {
    color: ${(props) => props.theme.palette.primary.main};
  }
`;

const PaymentList = styled.li`
  display: flex;
  flex-wrap: wrap;
`;

const Payment = styled.div`
  width: 80px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.25s ease;
  font-size: 11px;
  margin-right: 3px;
  margin-bottom: 3px;
  border: 0.5px solid ${(props) => props.theme.palette.action.focus};

  &:hover {
    background-color: ${(props) => props.theme.palette.primary.light};
    color: ${(props) => props.theme.palette.primary.contrastText};
    transform: translateX(5px);
  }
`;

const BotText = styled.p`
  font-size: 13px;
  margin: 0 10px;
  font-weight: 400;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  text-align: center;
  justify-content: center;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;

  @supports (-webkit-line-clamp: 1) {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: initial;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
  }

  ${(props) => props.theme.breakpoints.down("sm")} {
    width: 100%;
    margin: 0;
    font-size: 11px;
  }
`;

const Name = styled.b`
  font-size: 14px;
  margin: 0 10px;
  text-decoration: underline;

  ${(props) => props.theme.breakpoints.down("sm")} {
    display: none;
  }
`;
//#endregion

const support = (
  <>
    <ListItem>Chính sách đổi - trả - hoàn tiền</ListItem>
    <ListItem>Phương thức vận chuyển</ListItem>
    <ListItem>Phương thức thanh toán</ListItem>
    <ListItem>Câu hỏi thường gặp</ListItem>
    <ListItem>Hướng dẫn đặt hàng</ListItem>
  </>
);

const information = (
  <>
    <ListItem>Giới thiệu</ListItem>
    <ListItem>Tuyển dụng</ListItem>
    <ListItem>Chính sách khiếu nại</ListItem>
    <ListItem>Điều khoản sử dụng</ListItem>
  </>
);

const services = (
  <>
    <ListItem>Chính sách bảo mật</ListItem>
    <ListItem>Hệ thống hàng</ListItem>
  </>
);

const payments = (
  <>
    <ListItem>Phương thức thanh toán</ListItem>
    <PaymentList>
      <Payment>
        <QrCode />
        QR Code
      </Payment>
      <Payment>
        <LocalAtm />
        Tiền mặt
      </Payment>
      <Payment>
        <SystemSecurityUpdateGood />
        Internet Banking
      </Payment>
      <Payment>
        <CreditCard />
        Thẻ ATM
      </Payment>
    </PaymentList>
  </>
);

const Footer = () => {
  const [open, setOpen] = useState(false);
  const handleClick = (tab) => {
    setOpen((prev) => ({ ...prev, [tab]: !prev[tab] }));
  };

  return (
    <Container>
      <Wrapper>
        <Grid container spacing={1} size="grow">
          <Grid size={{ xs: 12, lg: "auto" }}>
            <AddressContainer>
              <Logo src="/full-logo.svg" alt="RING! logo" />
              <Description>
                Khu phố 6, Phường Linh Trung, TP. Thủ Đức - TP. Hồ Chí Minh
              </Description>
              <Social>
                <SocialIcon color="3B5999">
                  <Facebook />
                </SocialIcon>
                <SocialIcon color="FF0000">
                  <YouTube />
                </SocialIcon>
                <SocialIcon color="0A66C2">
                  <LinkedIn />
                </SocialIcon>
                <SocialIcon color="55ACEE">
                  <Twitter />
                </SocialIcon>
              </Social>
            </AddressContainer>
          </Grid>
          <Grid
            container
            spacing={0.5}
            offset={{ xs: 0, lg: "auto" }}
            size={{ xs: 12, lg: "auto" }}
            mb={{ xs: 3, sm: 6 }}
          >
            <Grid size={{ xs: 12, sm: 3 }}>
              <Title onClick={() => handleClick("support")}>
                HỖ TRỢ {open["support"] ? <ExpandLess /> : <ExpandMore />}
              </Title>
              <List>{support}</List>
              {open["support"] && <MobileList>{support}</MobileList>}
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <Title onClick={() => handleClick("information")}>
                THÔNG TIN{" "}
                {open["information"] ? <ExpandLess /> : <ExpandMore />}
              </Title>
              <List>{information}</List>
              {open["information"] && <MobileList>{information}</MobileList>}
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <Title onClick={() => handleClick("services")}>
                DỊCH VỤ {open["services"] ? <ExpandLess /> : <ExpandMore />}
              </Title>
              <List>{services}</List>
              {open["services"] && <MobileList>{information}</MobileList>}
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <Title onClick={() => handleClick("payments")}>
                THANH TOÁN {open["payments"] ? <ExpandLess /> : <ExpandMore />}
              </Title>
              <List>{payments}</List>
              {open["payments"] && <MobileList>{payments}</MobileList>}
            </Grid>
          </Grid>
        </Grid>
      </Wrapper>
      <BotFooter>
        <BotText>
          Giấy chứng nhận Đăng ý kính doanh do TP.HCM cấp ngày 01/01/2022.
        </BotText>
        <Name>DoraZ</Name>
      </BotFooter>
    </Container>
  );
};

export default Footer;
