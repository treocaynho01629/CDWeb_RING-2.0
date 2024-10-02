import styled from "styled-components"
import { Facebook, YouTube, Instagram, Twitter, QrCode, LocalAtm, SystemSecurityUpdateGood, CreditCard } from '@mui/icons-material';
import { Grid2 as Grid } from "@mui/material";

//#region styled
const Container = styled.div`
    background-color: ${props => props.theme.palette.divider};
    border-top: 2px solid ${props => props.theme.palette.primary.main};
    margin-top: 15dvh;
    padding-top: 20px;
    width: 100%;
`

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
`

const BotFooter = styled.div`
    height: 35px;
    padding: 0 30px;
    background-color: ${props => props.theme.palette.action.focus};
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 15px;
    font-weight: bold;
`

const Logo = styled.h1`
    font-size: 30px;
    font-family: abel;
    color: ${props => props.theme.palette.primary.main};
    display: flex;
    white-space: nowrap;

    p {
        color: ${props => props.theme.palette.text.secondary};
        margin: 0;
    }
`

const Description = styled.p`
    margin: 14px 0px;
    font-size: 13px;
`

const Social = styled.div`
    display: flex;
    margin-top: 10px;
    flex-wrap: wrap;
`

const SocialIcon = styled.div`
    width: 30px;
    height: 30px;
    border-radius: 50%;
    color: white;
    background-color: #${props => props.color};
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 7px;
    margin-bottom: 7px;
    transition: all .25s ease;
    cursor: pointer;

    svg {
        font-size: 20px;
    }

    &:hover{
        transform: scale(1.1);
        border-radius: 45%;
    }
`

const AddressContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding: 30px 0px;

    
    ${props => props.theme.breakpoints.down("lg")} {
        align-items: center;
        padding: 10px;
    }

    ${props => props.theme.breakpoints.down("sm")} {
        padding-top: 0;
    }
`


const Title = styled.h4`
    ${props => props.theme.breakpoints.down("sm")} {
        margin: 7px 0;
        text-align: center;
        color: ${props => props.theme.palette.primary.dark};
    }
`

const List = styled.ul`
    margin: 0;
    padding: 0;
    list-style: none;

    ${props => props.theme.breakpoints.down("sm")} {
        display: none;
    }
`

const ListItem = styled.li`
    width: 90%;
    font-size: 13px;
    margin-bottom: 10px;
    cursor: pointer;
    transition: all .25s ease;
    
    &:hover{
        color: ${props => props.theme.palette.primary.main};
    }
`

const PaymentList = styled.li`
    display: flex;
    flex-wrap: wrap;
`

const Payment = styled.div`
    width: 80px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: all .25s ease;
    font-size: 11px;
    margin-right: 3px;
    margin-bottom: 3px;
    border: .5px solid ${props => props.theme.palette.action.focus};
    
    &:hover{
        background-color: ${props => props.theme.palette.primary.light};
        color: ${props => props.theme.palette.primary.contrastText};
        transform: translateX(5px);
    }
`

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
`

const Me = styled.b`
    font-size: 14px;
    margin: 0 10px;
    text-decoration: underline;

    ${props => props.theme.breakpoints.down("sm")} {
        display: none;
    }
`
//#endregion

const Footer = () => {
    return (
        <Container>
            <Wrapper>
                <Grid container spacing={1} size="grow">
                    <Grid size={{ xs: 12, lg: 'auto' }} >
                        <AddressContainer>
                            <Logo>RING!&nbsp; <p>- BOOKSTORE</p></Logo>
                            <Description>Khu phố 6, Phường Linh Trung, TP. Thủ Đức - TP. Hồ Chí Minh</Description>
                            <Social>
                                <SocialIcon color="3B5999">
                                    <Facebook />
                                </SocialIcon>
                                <SocialIcon color="FF0000">
                                    <YouTube />
                                </SocialIcon>
                                <SocialIcon color="E4405F">
                                    <Instagram />
                                </SocialIcon>
                                <SocialIcon color="55ACEE">
                                    <Twitter />
                                </SocialIcon>
                            </Social>
                        </AddressContainer>
                    </Grid>
                    <Grid container spacing={.5} offset={{ xs: 0, lg: 'auto' }} size={{ xs: 12, lg: 'auto' }} mb={6}>
                        <Grid size={{ xs: 6, sm: 3 }}>
                            <Title>HỖ TRỢ</Title>
                            <List>
                                <ListItem>Chính sách đổi - trả - hoàn tiền</ListItem>
                                <ListItem>Phương thức vận chuyển</ListItem>
                                <ListItem>Phương thức thanh toán</ListItem>
                                <ListItem>Câu hỏi thường gặp</ListItem>
                                <ListItem>Hướng dẫn đặt hàng</ListItem>
                            </List>
                        </Grid>
                        <Grid size={{ xs: 6, sm: 3 }}>
                            <Title>THÔNG TIN</Title>
                            <List>
                                <ListItem>Giới thiệu</ListItem>
                                <ListItem>Tuyển dụng</ListItem>
                                <ListItem>Chính sách khiếu nại</ListItem>
                                <ListItem>Điều khoản sử dụng</ListItem>
                            </List>
                        </Grid>
                        <Grid size={{ xs: 6, sm: 3 }}>
                            <Title>DỊCH VỤ</Title>
                            <List>
                                <ListItem>Chính sách bảo mật</ListItem>
                                <ListItem>Hệ thống hàng</ListItem>
                            </List>
                        </Grid>
                        <Grid size={{ xs: 6, sm: 3 }}>
                            <Title>THANH TOÁN</Title>
                            <List>
                                <ListItem>Phương thức thanh toán</ListItem>
                                <PaymentList>
                                    <Payment><QrCode />QR Code</Payment>
                                    <Payment><LocalAtm />Tiền mặt</Payment>
                                    <Payment><SystemSecurityUpdateGood />Internet Banking</Payment>
                                    <Payment><CreditCard />Thẻ ATM</Payment>
                                </PaymentList>
                            </List>
                        </Grid>
                    </Grid>
                </Grid>
            </Wrapper>
            <BotFooter>
                <BotText>Giấy chứng nhận Đăng ý kính doanh do NLU - TP.HCM cấp ngày 01/01/2022.</BotText>
                <Me>DoraZ</Me>
            </BotFooter>
        </Container>
    )
}

export default Footer