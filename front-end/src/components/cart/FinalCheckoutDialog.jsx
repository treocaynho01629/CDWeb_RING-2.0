import styled from 'styled-components'
import { Check, CreditCard, LocalAtm, Payments, QrCode, Sell, SystemSecurityUpdateGood } from '@mui/icons-material';
import { Grid2 as Grid, Radio, RadioGroup, FormControlLabel, Box, TextField } from '@mui/material';

//#region styled
const Payout = styled.div`
    border: .5px solid ${props => props.theme.palette.action.focus};
    padding: 20px;
    margin-bottom: 20px;
    width: 100%;
`

const PayoutTitle = styled.h5`
    margin: 0;
`

const PayoutRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: ${props => props.theme.palette.action.focus};
    margin-top: 10px;
    padding: 0px 10px;
`

const PayoutText = styled.p`
    font-size: 15px;
    font-weight: 500;
    margin: 8px 0;
    display: flex;
    align-items: center;
`

const PayoutPrice = styled.p`
    font-size: 16px;
    font-weight: bold;
    color: red;
    margin: 0;
    text-align: end;
`

const CouponButton = styled.p`
    font-size: 15px;
    font-weight: 500;
    margin: 8px 0;
    display: flex;
    align-items: center;
    color: ${props => props.theme.palette.info.dark};
    cursor: pointer;

    &:hover {
        text-decoration: underline;
    }
`

const SmallContainer = styled.div`
    border: 0.5px solid ${props => props.theme.palette.action.focus};
    padding: 20px;
`
//#endregion

const FinalCheckoutDialog = ({ MiniTitle, Title, handleChange, value, products, handleSubmit, validAddressInfo, AltCheckoutContainer, PayButton }) => {

    const totalPrice = () => {
        let total = 0;
        products.forEach((item) => (total += item.quantity * item.price));
        return total;
    }

    return (
        <>
            <MiniTitle style={{ marginTop: 0 }}><CreditCard />&nbsp;Hình thức thanh toán</MiniTitle>
            <SmallContainer>
                <RadioGroup spacing={1} row value={value} onChange={handleChange}>
                    <FormControlLabel value="1" control={<Radio color="primary" />}
                        label={<div style={{ display: 'flex', alignItems: 'center' }}>
                            <LocalAtm sx={{ fontSize: 30 }} />Tiền mặt
                        </div>} />
                    <FormControlLabel value="2" control={<Radio color="primary" />}
                        label={<div style={{ display: 'flex', alignItems: 'center' }}>
                            <CreditCard sx={{ fontSize: 30 }} />Thẻ ATM
                        </div>} />
                    <FormControlLabel value="3" control={<Radio color="primary" />}
                        label={<div style={{ display: 'flex', alignItems: 'center' }}>
                            <SystemSecurityUpdateGood sx={{ fontSize: 30 }} />Internet Banking
                        </div>} />
                    <FormControlLabel value="4" control={<Radio color="primary" />}
                        label={<div style={{ display: 'flex', alignItems: 'center' }}>
                            <QrCode sx={{ fontSize: 30 }} />QR Code
                        </div>} />
                </RadioGroup>
            </SmallContainer>
            <MiniTitle><Sell />&nbsp;Khuyến mãi</MiniTitle>
            <SmallContainer>
                <Grid container spacing={1} size="grow">
                    <Grid size="auto">
                        <TextField placeholder='Nhập mã giảm giá ...'
                            size="small"
                            fullWidth
                            slotProps={{
                                input: {
                                    endAdornment: <Sell style={{ color: "gray" }} />
                                }
                            }}
                        />
                    </Grid>
                    <Grid size="auto" offset="auto" display="flex" justifyContent="flex-end">
                        <CouponButton>Hoặc chọn mã&nbsp;
                            <Sell />
                        </CouponButton>
                    </Grid>
                </Grid>
            </SmallContainer>
            <Title><Check />&nbsp;XÁC THỰC ĐẶT HÀNG</Title>
            <Grid container>
                <Grid size={{ xs: 12, lg: 6 }} displau="flex">
                    <Payout>
                        <PayoutTitle>THANH TOÁN</PayoutTitle>
                        <PayoutRow>
                            <PayoutText>Thành tiền:</PayoutText>
                            <PayoutText>{totalPrice().toLocaleString()} đ</PayoutText>
                        </PayoutRow>
                        <PayoutRow>
                            <PayoutText>VAT:</PayoutText>
                            <PayoutText>10%</PayoutText>
                        </PayoutRow>
                        <PayoutRow>
                            <PayoutText>Phí vận chuyển:</PayoutText>
                            <PayoutText>10,000 đ</PayoutText>
                        </PayoutRow>
                        <PayoutRow>
                            <PayoutText>Tổng:</PayoutText>
                            <PayoutPrice>{Math.round(totalPrice() * 1.1 + 10000).toLocaleString()}&nbsp;đ</PayoutPrice>
                        </PayoutRow>
                        <Box display={{ xs: 'none', sm: 'block' }}>
                            <PayButton onClick={handleSubmit} disabled={!validAddressInfo}>
                                <Payments style={{ fontSize: 18 }} />&nbsp;ĐẶT HÀNG
                            </PayButton>
                        </Box>
                    </Payout>
                </Grid>
            </Grid>
            <AltCheckoutContainer>
                <Box sx={{ padding: '0px 5px' }}>
                    <strong>Tổng thanh toán:</strong>
                    <PayoutPrice>
                        {Math.round(totalPrice() * 1.1 + 10000).toLocaleString()}&nbsp;đ
                    </PayoutPrice>
                </Box>
                <PayButton onClick={handleSubmit} disabled={!validAddressInfo}>
                    ĐẶT HÀNG
                </PayButton>
            </AltCheckoutContainer>
        </>
    )
}

export default FinalCheckoutDialog