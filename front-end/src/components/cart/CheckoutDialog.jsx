import styled from 'styled-components'
import { useEffect, useState } from 'react';
import { Sell as SellIcon, Payments as PaymentsIcon } from '@mui/icons-material';
import useAuth from "../../hooks/useAuth";

//#region styled
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
    border: 0.5px solid lightgray;
    padding: 20px;
    margin-bottom: 20px;
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
    font-size: 14px;
    font-weight: 500;
    margin: 8px 0;
    display: flex;
    align-items: center;
`

const PayoutPrice = styled.p`
    font-size: 16px;
    font-weight: bold;
    color: red;
`

const CouponButton = styled.p`
    font-size: 14px;
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
    background-color: ${props => props.theme.palette.secondary.main};
    padding: 15px 20px;
    margin-top: 20px;
    font-size: 14px;
    font-weight: bold;
    width: 100%;
    font-weight: 500;
    border-radius: 0;
    border: none;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    text-align: center;
    justify-content: center;
    transition: all 0.5s ease;

    &:hover {
        background-color: lightgray;
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

const CheckoutDialog = ({ cartProducts, selected }) => {
    const { token } = useAuth();
    const [selectedProducts, setSelectedProducts] = useState([]);

    useEffect(() => {
        let newProducts = cartProducts?.filter(product => selected.includes(product?.id));
        setSelectedProducts(newProducts);
    }, [selected, cartProducts])

    const totalPrice = () => {
        let total = 0;
        selectedProducts?.forEach((item) => (total += item.quantity * item.price));
        return total;
    }

    return (
        <div>
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
                    <PayoutText>10%</PayoutText>
                </PayoutRow>
                <PayoutRow>
                    <PayoutText>Phí ship:</PayoutText>
                    <PayoutText>10,000 đ</PayoutText>
                </PayoutRow>
                <PayoutRow>
                    <PayoutText>Tổng:</PayoutText>
                    <PayoutPrice>{Math.round(totalPrice() * 1.1 + 10000).toLocaleString()}&nbsp;đ</PayoutPrice>
                </PayoutRow>
                <PayButton disabled={cartProducts?.length == 0}
                    onClick={() => navigate('/checkout')}>
                    <PaymentsIcon style={{ fontSize: 18 }} />&nbsp;{token ? 'THANH TOÁN' : 'ĐĂNG NHẬP ĐỂ THANH TOÁN'}
                </PayButton>
            </Payout>
        </div>
    )
}

export default CheckoutDialog