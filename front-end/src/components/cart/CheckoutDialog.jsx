import styled from 'styled-components'
import { lazy, useMemo, useState, Suspense } from 'react';
import { Sell as SellIcon, Payments as PaymentsIcon } from '@mui/icons-material';
import { useMediaQuery, useTheme, Button } from '@mui/material';
import useAuth from "../../hooks/useAuth";

const SwipeableDrawer = lazy(() => import('@mui/material/SwipeableDrawer'));

//#region styled
const CheckoutContainer = styled.div`
    display: block;
    position: relative;
    height: 100%;

    ${props => props.theme.breakpoints.down("md_lg")} {
        position: sticky;
        bottom: 20px;
    }

    ${props => props.theme.breakpoints.down("sm")} {
        display: none;
    }
`

const AltCheckoutContainer = styled.div`
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 50px;
    z-index: 99;
    box-shadow: ${props => props.theme.shadows[12]};
    background-color: ${props => props.theme.palette.background.default};
    align-items: flex-end;
    justify-content: space-between;
    display: none;

    ${props => props.theme.breakpoints.down("md_lg")} {
        display: flex;
    }
`

const SecondaryTitleContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 20px 0px;
`

const Title = styled.h3`
    margin: 0;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    text-align: center;
    justify-content: center;
`

const Payout = styled.div`
    border: .5px solid ${props => props.theme.palette.action.focus};
    padding: 20px;
    margin-bottom: 20px;

    &.sticky {
        position: sticky;
        top: ${props => props.theme.mixins.toolbar.minHeight + 15}px;
    }
`

const AltPayout = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 7px;
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

const BuyButton = styled(Button)`
    margin-top: 15px;
    height: 100%;
    line-height: 1.5;
`
//#endregion

const CheckoutDialog = ({ checkoutCart, navigate, rowCount }) => {
    const { token } = useAuth();
    const theme = useTheme();
    const mobileMode = useMediaQuery(theme.breakpoints.down('md'));
    const tabletMode = useMediaQuery(theme.breakpoints.down('md_lg'));
    const [open, setOpen] = useState(undefined);

    //Test estimate
    const shippingPrice = () => {
        return (10000 * (checkoutCart?.cart?.length ?? 0));
    }

    const totalPrice = () => {
        let total = 0;
        checkoutCart?.cart?.forEach((detail) => (
            detail?.items?.forEach((item) => (
                total += item.quantity * Math.round(item.price * (1 - item.discount)
                ))
            )));
        return total;
    }

    const shipping = useMemo(() => shippingPrice(), [checkoutCart]);
    const total = useMemo(() => totalPrice(), [checkoutCart]);

    const toggleDrawer = (newOpen) => { setOpen(newOpen) };

    return (
        <>
            {mobileMode
                ? <AltCheckoutContainer>
                    <AltPayout>
                        <PayoutPrice onClick={() => toggleDrawer(true)} style={{ cursor: 'pointer' }}>
                            {Math.round(total + (10000 * checkoutCart?.cart?.length)).toLocaleString()}&nbsp;đ
                        </PayoutPrice>
                    </AltPayout>
                    <BuyButton
                        variant="contained"
                        size="large"
                        fullWidth
                        disabled={!checkoutCart?.cart?.length}
                        onClick={() => navigate('/checkout', { state: { products: checkoutCart } })}
                    >
                        {token ? `THANH TOÁN (${rowCount})` : 'ĐĂNG NHẬP'}
                    </BuyButton>
                    <Suspense fallback={null}>
                        <SwipeableDrawer
                            anchor="bottom"
                            open={open}
                            onOpen={() => toggleDrawer(true)}
                            onClose={() => toggleDrawer(false)}
                        >
                            <Payout style={{ marginBottom: 0 }}>
                                <PayoutTitle>THANH TOÁN</PayoutTitle>
                                <PayoutRow>
                                    <PayoutText>Thành tiền:</PayoutText>
                                    <PayoutText>{total.toLocaleString()}&nbsp;đ</PayoutText>
                                </PayoutRow>
                                <PayoutRow>
                                    <PayoutText>Phí vận chuyển:</PayoutText>
                                    <PayoutText>{shipping.toLocaleString()}&nbsp;đ</PayoutText>
                                </PayoutRow>
                                <PayoutRow>
                                    <PayoutText>Tổng:</PayoutText>
                                    <PayoutPrice>{Math.round(total + shipping).toLocaleString()}&nbsp;đ</PayoutPrice>
                                </PayoutRow>
                            </Payout>
                        </SwipeableDrawer>
                    </Suspense>
                </AltCheckoutContainer>
                : tabletMode
                    ? <CheckoutContainer>
                        <Payout>
                            <BuyButton
                                variant="contained"
                                size="large"
                                fullWidth
                                disabled={!checkoutCart?.cart?.length}
                                onClick={() => navigate('/checkout', { state: { products: checkoutCart } })}
                            >
                                <PaymentsIcon style={{ fontSize: 18 }} />&nbsp;
                                {token ? `THANH TOÁN (${rowCount} SẢN PHẨM)` : 'ĐĂNG NHẬP ĐỂ THANH TOÁN'}
                            </BuyButton>
                        </Payout>
                    </CheckoutContainer>
                    : <CheckoutContainer>
                        <SecondaryTitleContainer>
                            <Title>ĐƠN DỰ TÍNH&nbsp;</Title><SellIcon />
                        </SecondaryTitleContainer>
                        <Payout>
                            <PayoutTitle>KHUYẾN MÃI</PayoutTitle>
                            <PayoutRow>
                                <PayoutText>Voucher RING:</PayoutText>
                                <CouponButton>Chọn hoặc nhập mã&nbsp;
                                    <SellIcon />
                                </CouponButton>
                            </PayoutRow>
                        </Payout>
                        <Payout className="sticky">
                            <PayoutTitle>THANH TOÁN</PayoutTitle>
                            <PayoutRow>
                                <PayoutText>Thành tiền:</PayoutText>
                                <PayoutText>{total.toLocaleString()}&nbsp;đ</PayoutText>
                            </PayoutRow>
                            <PayoutRow>
                                <PayoutText>Phí vận chuyển:</PayoutText>
                                <PayoutText>{shipping.toLocaleString()}&nbsp;đ</PayoutText>
                            </PayoutRow>
                            <PayoutRow>
                                <PayoutText>Tổng:</PayoutText>
                                <PayoutPrice>{Math.round(total + shipping).toLocaleString()}&nbsp;đ</PayoutPrice>
                            </PayoutRow>
                            <BuyButton
                                variant="contained"
                                size="large"
                                fullWidth
                                disabled={!checkoutCart?.cart?.length}
                                onClick={() => navigate('/checkout', { state: { products: checkoutCart } })}
                            >
                                <PaymentsIcon style={{ fontSize: 18 }} />&nbsp;
                                {token ? `THANH TOÁN (${rowCount} SẢN PHẨM)` : 'ĐĂNG NHẬP ĐỂ THANH TOÁN'}
                            </BuyButton>
                        </Payout>
                    </CheckoutContainer >
            }
        </>
    )
}

export default CheckoutDialog