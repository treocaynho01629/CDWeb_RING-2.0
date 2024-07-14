import styled from "styled-components"

import {
    Facebook as FacebookIcon, YouTube as YouTubeIcon, Instagram as InstagramIcon, Twitter as TwitterIcon,
    QrCode as QrCodeIcon, LocalAtm as LocalAtmIcon, SystemSecurityUpdateGood as SystemSecurityUpdateGoodIcon, CreditCard as CreditCardIcon
} from '@mui/icons-material';

import Grid from '@mui/material/Grid';

//#region styled
const Container = styled.div`
    display: flex;
    flex-direction: column;
    background-color: #ebebeb;
    margin-top: 100px;
    width: 100%;
`

const Wrapper = styled.div`
    padding-right: 15px;
    padding-left: 15px;
    margin-right: auto;
    margin-left: auto;
    display: flex;

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
    background-color: lightgray;
    color: #424242;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 15px;
    font-weight: bold;
`

const Logo = styled.h1`
    font-size: 30px;
    font-family: abel;
    color: #63e399;
    display: flex;
    flex-wrap: wrap;
`

const Description = styled.p`
    margin: 14px 0px;
`

const Social = styled.div`
    display: flex;
    margin-top: 10px;
    flex-wrap: wrap;
`

const SocialIcon = styled.div`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    color: white;
    background-color: #${props => props.color};
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 20px;
    margin-bottom: 20px;
    cursor: pointer;
    transition: all 0.5s ease;

    &:hover{
        transform: scale(1.1);
        border-radius: 45%;
    }
`

const Left = styled.div`
    display: flex;
    flex-direction: column;
    padding: 50px 20px;
`

const Right = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 20px;
`

const Title = styled.h3`
    margin-bottom: 30px;
    `

const List = styled.ul`
    margin: 0;
    padding: 0;
    list-style: none;
`

const ListItem = styled.li`
width: 90%;
    font-size: 16px;
    margin-bottom: 10px;
    cursor: pointer;
    transition: all 0.5s ease;
    
    &:hover{
        color: #63e399;
    }
    `

const Payment = styled.div`
    width: 80px;
    justify-content: center;
    align-items: center;
    text-align: center;
    cursor: pointer;
    transition: all 0.5s ease;
    
    &:hover{
        color: #63e399;
    }
`

const BotText = styled.p`
    font-size: 14px;
    margin: 0 10px;
    font-weight: 400;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    text-align: center;
    justify-content: center;
    color: #424242;
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

const Group = styled.p`
    font-size: 14px;
    margin: 0 10px;
    font-weight: bold;
    display: none;
    flex-wrap: wrap;
    align-items: center;
    text-align: center;
    justify-content: center;
    color: black;
    text-decoration: underline;

    @media (min-width: 900px) {
        display: flex;
    }
`
//#endregion

const Footer = () => {
    return (
        <Container>
            <Wrapper>
                <Grid container>
                    <Grid item xs={12} md={3}>
                        <Left>
                            <Logo>RING!&nbsp; <p style={{ color: '#424242', margin: 0 }}>- BOOKSTORE</p></Logo>
                            <Description>Khu phố 6, Phường Linh Trung, TP. Thủ Đức - TP. Hồ Chí Minh</Description>
                            <Social>
                                <SocialIcon color="3B5999">
                                    <FacebookIcon />
                                </SocialIcon>
                                <SocialIcon color="FF0000">
                                    <YouTubeIcon />
                                </SocialIcon>
                                <SocialIcon color="E4405F">
                                    <InstagramIcon />
                                </SocialIcon>
                                <SocialIcon color="55ACEE">
                                    <TwitterIcon />
                                </SocialIcon>
                            </Social>
                        </Left>
                    </Grid>
                    <Grid item xs={12} md={9}>
                        <Right>
                            <Grid container spacing={1}>
                                <Grid item xs={6} md={3}>
                                    <Title>HỖ TRỢ</Title>
                                    <List>
                                        <ListItem>Chính sách đổi - trả - hoàn tiền</ListItem>
                                        <ListItem>Phương thức vận chuyển</ListItem>
                                        <ListItem>Phương thức thanh toán</ListItem>
                                        <ListItem>Câu hỏi thường gặp</ListItem>
                                        <ListItem>Hướng dẫn đặt hàng</ListItem>
                                    </List>
                                </Grid>
                                <Grid item xs={6} md={3}>
                                    <Title>THÔNG TIN</Title>
                                    <List>
                                        <ListItem>Giới thiệu</ListItem>
                                        <ListItem>Tuyển dụng</ListItem>
                                        <ListItem>Chính sách khiếu nại</ListItem>
                                        <ListItem>Điều khoản sử dụng</ListItem>
                                    </List>
                                </Grid>
                                <Grid item xs={6} md={3}>
                                    <Title>DỊCH VỤ</Title>
                                    <List>
                                        <ListItem>Chính sách bảo mật</ListItem>
                                        <ListItem>Hệ thống hàng</ListItem>
                                    </List>
                                </Grid>
                                <Grid item xs={6} md={3}>
                                    <Title>THANH TOÁN</Title>
                                    <List>
                                        <ListItem>Phương thức thanh toán</ListItem>
                                        <ListItem style={{ display: 'flex' }}>
                                            <Payment><QrCodeIcon sx={{ fontSize: 30 }} /><p style={{ fontSize: 14, margin: 0 }}>QR Code</p></Payment>
                                            <Payment><LocalAtmIcon sx={{ fontSize: 30 }} /><p style={{ fontSize: 14, margin: 0 }}>Tiền mặt</p></Payment>
                                        </ListItem>
                                        <ListItem style={{ display: 'flex' }}>
                                            <Payment><SystemSecurityUpdateGoodIcon sx={{ fontSize: 30 }} /><p style={{ fontSize: 14, margin: 0 }}>Internet Banking</p></Payment>
                                            <Payment><CreditCardIcon sx={{ fontSize: 30 }} /><p style={{ fontSize: 14, margin: 0 }}>Thẻ ATM</p></Payment>
                                        </ListItem>
                                    </List>
                                </Grid>
                            </Grid>
                        </Right>
                    </Grid>
                </Grid>
            </Wrapper>
            <BotFooter>
                <BotText>Giấy chứng nhận Đăng ý kính doanh do NLU - TP.HCM cấp ngày 01/01/2022.</BotText>
                <Group>DoraZ</Group>
            </BotFooter>
        </Container>
    )
}

export default Footer