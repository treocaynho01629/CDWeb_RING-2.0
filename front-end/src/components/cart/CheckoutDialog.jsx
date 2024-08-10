import styled from 'styled-components'
import { useEffect, useState } from 'react';
import { Sell as SellIcon, Payments as PaymentsIcon } from '@mui/icons-material';
import { Checkbox, Divider, Drawer, FormControlLabel, useMediaQuery, useTheme } from '@mui/material';
import useAuth from "../../hooks/useAuth";

//#region styled
const CheckoutContainer = styled.div`
    display: block;

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
    background-color: white;
    box-shadow: 3px 3px 10px 3px #b7b7b7;
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
    transition: all 0.5s ease;

    ${props => props.theme.breakpoints.down("sm")} {
        width: 80%;
    }

    &:hover {
        background-color: ${props => props.theme.palette.action.hover};
        color: black;
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

const CheckoutDialog = ({ cartProducts, selected, navigate, handleSelectAllClick, numSelected, rowCount }) => {
    const { token } = useAuth();
    const theme = useTheme();
    const desktopMode = useMediaQuery(theme.breakpoints.up('sm'));
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        let newProducts = cartProducts?.filter(product => selected.includes(product?.id));
        setSelectedProducts(newProducts);
    }, [selected, cartProducts])

    const totalPrice = () => {
        let total = 0;
        selectedProducts?.forEach((item) => (total += item.quantity * item.price));
        return total;
    }

    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };

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
                    <Payout>
                        <PayoutTitle>THANH TOÁN</PayoutTitle>
                        <PayoutRow>
                            <PayoutText>Thành tiền:</PayoutText>
                            <PayoutText>{totalPrice().toLocaleString()} đ</PayoutText>
                        </PayoutRow>
                        <PayoutRow>
                            <PayoutText>VAT:</PayoutText>
                            <PayoutText>{selectedProducts?.length ? 10 : 0}%</PayoutText>
                        </PayoutRow>
                        <PayoutRow>
                            <PayoutText>Phí vận chuyển:</PayoutText>
                            <PayoutText>{selectedProducts?.length ? '10,000' : 0}&nbsp;đ</PayoutText>
                        </PayoutRow>
                        <PayoutRow>
                            <PayoutText>Tổng:</PayoutText>
                            <PayoutPrice>{selectedProducts?.length ? Math.round(totalPrice() * 1.1 + 10000).toLocaleString() : 0}&nbsp;đ</PayoutPrice>
                        </PayoutRow>
                        <PayButton
                            disabled={selectedProducts?.length == 0}
                            onClick={() => navigate('/checkout', { state: { products: selectedProducts } })}
                        >
                            <PaymentsIcon style={{ fontSize: 18 }} />&nbsp;
                            {token ? `THANH TOÁN (${selectedProducts.length} SẢN PHẨM)` : 'ĐĂNG NHẬP ĐỂ THANH TOÁN'}
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
                                    inputProps={{
                                        'aria-label': 'select all',
                                    }}
                                    onChange={handleSelectAllClick}
                                />
                            }
                            sx={{ marginRight: 0 }}
                            label="Tất cả" />
                        <Divider orientation="vertical" flexItem />
                        <PayoutPrice onClick={toggleDrawer(true)} style={{ cursor: 'pointer' }}>
                            {selectedProducts?.length ? Math.round(totalPrice() * 1.1 + 10000).toLocaleString() : 0}&nbsp;đ
                        </PayoutPrice>
                    </AltPayout>
                    <PayButton
                        disabled={selectedProducts?.length == 0}
                        onClick={() => navigate('/checkout', { state: { products: selectedProducts } })}
                    >
                        {token ? `THANH TOÁN (${selectedProducts.length})` : 'ĐĂNG NHẬP'}
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
                            <PayoutRow>
                                <PayoutText>VAT:</PayoutText>
                                <PayoutText>{selectedProducts?.length ? 10 : 0}%</PayoutText>
                            </PayoutRow>
                            <PayoutRow>
                                <PayoutText>Phí vận chuyển:</PayoutText>
                                <PayoutText>{selectedProducts?.length ? '10,000' : 0}&nbsp;đ</PayoutText>
                            </PayoutRow>
                            <PayoutRow>
                                <PayoutText>Tổng:</PayoutText>
                                <PayoutPrice>{selectedProducts?.length ? Math.round(totalPrice() * 1.1 + 10000).toLocaleString() : 0}&nbsp;đ</PayoutPrice>
                            </PayoutRow>
                        </Payout>
                    </Drawer>
                </AltCheckoutContainer>
            }
        </>
    )
}

export default CheckoutDialog