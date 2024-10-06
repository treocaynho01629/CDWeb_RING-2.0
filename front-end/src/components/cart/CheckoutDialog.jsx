import styled from 'styled-components'
import { useEffect, useMemo, useState } from 'react';
import { Sell as SellIcon, Payments as PaymentsIcon } from '@mui/icons-material';
import { Checkbox, Divider, Drawer, FormControlLabel, useMediaQuery, useTheme } from '@mui/material';
import useAuth from "../../hooks/useAuth";

//#region styled
const CheckoutContainer = styled.div`
    display: block;
    position: relative;
    height: 100%;

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

    ${props => props.theme.breakpoints.down("sm")} {
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

const PayButton = styled.button`
    background-color: ${props => props.theme.palette.primary.main};
    padding: 15px 20px;
    margin-top: 20px;
    font-size: 15px;
    font-weight: bold;
    width: 100%;
    height: 50px;
    font-weight: 500;
    border-radius: 0;
    border: none;
    flex-wrap: wrap;
    white-space: nowrap;
    overflow: hidden;
    display: flex;
    align-items: center;
    text-align: center;
    justify-content: center;
    cursor: pointer;
    transition: all .25s ease;

    ${props => props.theme.breakpoints.down("sm")} {
        width: 80%;
    }

    &:hover {
        background-color: ${props => props.theme.palette.action.hover};
        color: ${props => props.theme.palette.text.primary};
    }

    &:disabled {
        background-color: gray;
        color: darkslategray;
    }

    &:focus {
        outline: none;
        border: none;
    }
`
//#endregion

const CheckoutDialog = ({ testCart, selected, navigate, handleSelectAllClick, numSelected, rowCount }) => {
    const { token } = useAuth();
    const theme = useTheme();
    const desktopMode = useMediaQuery(theme.breakpoints.up('sm'));
    const [open, setOpen] = useState(false);
    // const [checkoutCart, setCheckoutCart] = useState([]);

    // useEffect(() => {
    //     let newProducts = cartProducts?.filter(product => selected.includes(product?.id));
    //     setCheckoutCart(newProducts);
    // }, [selected, cartProducts])

    //Test estimate
    const totalPrice = () => {
        // let total = 0;
        // checkoutCart?.forEach((item) => (totalPrice() += item.quantity * Math.round(item.price * (1 - item.discount))));
        // return total;

        let total = 0;
        testCart?.cart?.forEach((detail) => (
            detail?.items?.forEach((item) => (
                total += item.quantity * Math.round(item.price * (1 - item.discount)
            ))
        )));
        return total;
    }

    // const total = useMemo(() => totalPrice(), testCart);
    // const total = totalPrice();

    const toggleDrawer = (newOpen) => { setOpen(newOpen) };

    return (
        <>
            {desktopMode
                ?
                <CheckoutContainer>
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
                            <PayoutText>{totalPrice().toLocaleString()} đ</PayoutText>
                        </PayoutRow>
                        {/* <PayoutRow>
                            <PayoutText>VAT:</PayoutText>
                            <PayoutText>{testCart?.cart?.length ? 10 : 0}%</PayoutText>
                        </PayoutRow> */}
                        <PayoutRow>
                            <PayoutText>Phí vận chuyển:</PayoutText>
                            <PayoutText>{testCart?.cart?.length ? (10000 * testCart?.cart?.length) : 0}&nbsp;đ</PayoutText>
                        </PayoutRow>
                        <PayoutRow>
                            <PayoutText>Tổng:</PayoutText>
                            <PayoutPrice>{testCart?.cart?.length ? Math.round(totalPrice() + (10000 * testCart?.cart?.length)).toLocaleString() : 0}&nbsp;đ</PayoutPrice>
                        </PayoutRow>
                        <PayButton
                            disabled={rowCount == 0}
                            onClick={() => navigate('/checkout', { state: { products: checkoutCart } })}
                        >
                            <PaymentsIcon style={{ fontSize: 18 }} />&nbsp;
                            {token ? `THANH TOÁN (${rowCount} SẢN PHẨM)` : 'ĐĂNG NHẬP ĐỂ THANH TOÁN'}
                        </PayButton>
                    </Payout>
                </CheckoutContainer >
                :
                <AltCheckoutContainer>
                    <AltPayout>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    disableRipple
                                    disableFocusRipple
                                    indeterminate={numSelected > 0 && numSelected < rowCount}
                                    checked={rowCount > 0 && numSelected === rowCount}
                                    color="primary"
                                    inputProps={{ 'aria-label': 'select all' }}
                                    onChange={handleSelectAllClick}
                                />
                            }
                            sx={{ marginRight: 0 }}
                            label="Tất cả" />
                        <Divider orientation="vertical" flexItem />
                        <PayoutPrice onClick={toggleDrawer(true)} style={{ cursor: 'pointer' }}>
                            {testCart?.cart?.length ? Math.round(totalPrice() + (10000 * testCart?.cart?.length)).toLocaleString() : 0}&nbsp;đ
                        </PayoutPrice>
                    </AltPayout>
                    <PayButton
                        disabled={testCart?.cart?.length == 0}
                        onClick={() => navigate('/checkout', { state: { products: testCart } })}
                    >
                        {token ? `THANH TOÁN (${rowCount})` : 'ĐĂNG NHẬP'}
                    </PayButton>
                    <Drawer
                        anchor={'bottom'}
                        open={open}
                        onClose={toggleDrawer(false)}
                    >
                        <Payout style={{ marginBottom: 0 }}>
                            <PayoutTitle>THANH TOÁN</PayoutTitle>
                            <PayoutRow>
                                <PayoutText>Thành tiền:</PayoutText>
                                <PayoutText>{totalPrice().toLocaleString()} đ</PayoutText>
                            </PayoutRow>
                            {/* <PayoutRow>
                                <PayoutText>VAT:</PayoutText>
                                <PayoutText>{testCart?.cart?.length ? 10 : 0}%</PayoutText>
                            </PayoutRow> */}
                            <PayoutRow>
                                <PayoutText>Phí vận chuyển:</PayoutText>
                                <PayoutText>{testCart?.cart?.length ? (10000 * testCart?.cart?.length).toLocaleString() : 0}&nbsp;đ</PayoutText>
                            </PayoutRow>
                            <PayoutRow>
                                <PayoutText>Tổng:</PayoutText>
                                <PayoutPrice>{testCart?.cart?.length ? Math.round(totalPrice() + (10000 * testCart?.cart?.length)).toLocaleString() : 0}&nbsp;đ</PayoutPrice>
                            </PayoutRow>
                        </Payout>
                    </Drawer>
                </AltCheckoutContainer>
            }
        </>
    )
}

export default CheckoutDialog