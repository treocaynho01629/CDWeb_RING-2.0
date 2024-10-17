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
        bottom: 0;
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

const CheckoutBox = styled.div`
    border: .5px solid ${props => props.theme.palette.action.focus};
    padding: 20px;
    margin-bottom: 20px;
    background-color: ${props => props.theme.palette.background.default};

    &.sticky {
        margin-bottom: -0.5px;
        position: sticky;
        top: ${props => props.theme.mixins.toolbar.minHeight + 15}px;
    }
`

const CheckoutStack = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
`

const CheckoutPriceContainer = styled.div`
`

const AltCheckoutBox = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 7px;
`

const CheckoutTitle = styled.span`
    font-size: 16px;
`

const CheckoutRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 4px 0;
`

const CheckoutText = styled.span`
    font-size: 14px;
    font-weight: 400;
`

const CheckoutPrice = styled.span`
    font-size: 16px;
    font-weight: bold;
    color: ${props => props.theme.palette.error.main};
    cursor: pointer;
`

const SavePrice = styled.span`
    font-size: 14px;
    font-weight: 450;
    color: ${props => props.theme.palette.success.dark};
`

const SubText = styled.span`
    font-size: 12px;
    color: ${props => props.theme.palette.text.secondary};
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

const CheckoutButton = styled(Button)`
    height: 100%;
    line-height: 1.5;
`
//#endregion

const tempShippingFee = 10000;

const CheckoutDialog = ({ checkoutCart, navigate, pending, calculated, numSelected }) => {
    const { token } = useAuth();
    const theme = useTheme();
    const mobileMode = useMediaQuery(theme.breakpoints.down('md'));
    const tabletMode = useMediaQuery(theme.breakpoints.down('md_lg'));
    const [open, setOpen] = useState(undefined);

    //Estimate before receive caculated price from server
    const estimatePrice = () => {
        let estimate = { deal: 0, total: 0, shipping: 0, subTotal: 0 }; //Initial value

        if (checkoutCart?.cart?.length) {
            let deal = 0;
            let total = 0;
            const shipping = tempShippingFee * (checkoutCart?.cart?.length || 0);

            //Loop & calculate
            checkoutCart?.cart?.forEach((detail) => (
                detail?.items?.forEach((item) => {
                    const discount = Math.round(item.price * item.discount);

                    //Both deal & total price
                    deal += item.quantity * discount;
                    total += item.quantity * item.price;
                })
            ));

            //Set values
            estimate = { deal, total, shipping, subTotal: total + shipping - deal };
        }
        return estimate;
    }
    const calculatedInfo = () => {
        let info = {
            deal: 0,
            total: 0,
            shipping: 0,
            couponDiscount: 0,
            totalDiscount: 0,
            shippingDiscount: 0,
            subTotal: 0,
        }

        if (calculated) {
            let deal = 0;
            let total = 0;
            let shipping = 0;
            let shippingDiscount = 0;
            const totalDiscount = calculated?.totalDiscount || 0;
            const finalTotal = calculated?.total || 0;

            //Loop & calculate shipping discount
            calculated?.details?.forEach((detail) => {
                detail?.items?.forEach((item) => {
                    const discount = Math.round(item.price * item.discount);

                    //Both deal & total price
                    deal += item.quantity * discount;
                    total += item.quantity * item.price;
                })

                //Shipping
                shipping += detail?.shippingFee;
                shippingDiscount += detail?.shippingDiscount;
            });

            //Set info values
            info = {
                deal,
                total: finalTotal - shipping,
                shipping,
                couponDiscount: totalDiscount - shippingDiscount - deal,
                totalDiscount,
                shippingDiscount,
                subTotal: (calculated?.total || 0) - totalDiscount,
            }
        }
        return info;
    }

    const toggleDrawer = (newOpen) => { setOpen(newOpen) };

    //Info
    const estimate = useMemo(() => estimatePrice(), [checkoutCart]);
    const info = useMemo(() => calculatedInfo(), [calculated]);
    const displayInfo = {
        deal: (pending && !info)  ? estimate.deal : info.deal,
        total: (pending && !info)  ? estimate.total : info.total,
        shipping: (pending && !info) ? estimate.shipping : info.shipping,
        couponDiscount: info.couponDiscount,
        totalDiscount: info.totalDiscount,
        shippingDiscount: info.shippingDiscount,
        subTotal: (pending && !info)  ? estimate.subTotal : info.subTotal
    }

    return (
        <>
            {mobileMode
                ? <AltCheckoutContainer>
                    <AltCheckoutBox>
                        <CheckoutPrice onClick={() => toggleDrawer(true)}>
                            {Math.round(displayInfo.subTotal).toLocaleString()}đ
                        </CheckoutPrice>
                    </AltCheckoutBox>
                    <CheckoutButton
                        variant="contained"
                        size="large"
                        fullWidth
                        disabled={!numSelected || pending}
                        onClick={() => navigate('/checkout', { state: { products: checkoutCart } })}
                    >
                        {token ? `Thanh toán (${numSelected})` : 'Đăng nhập'}
                    </CheckoutButton>
                </AltCheckoutContainer>
                : tabletMode
                    ? <CheckoutContainer>
                        <CheckoutBox className="sticky">
                            <CheckoutStack>
                                <CheckoutPriceContainer>
                                    <CheckoutText>
                                        Tổng thanh toán: ({numSelected} Sản phẩm)&emsp;
                                        {numSelected && <SubText>(Đã bao gồm VAT)</SubText>}
                                    </CheckoutText>
                                    <CheckoutPrice onClick={() => toggleDrawer(true)}>
                                        {Math.round(displayInfo.subTotal).toLocaleString()}đ
                                    </CheckoutPrice>&emsp;
                                    <SavePrice>
                                        {pending ? 'Đang tạm tính'
                                            : `Tiết kiệm ${Math.round(displayInfo.totalDiscount).toLocaleString()}đ`}
                                    </SavePrice>
                                </CheckoutPriceContainer>
                                <CheckoutButton
                                    variant="contained"
                                    size="large"
                                    fullWidth
                                    sx={{ maxWidth: '35%' }}
                                    disabled={!numSelected || pending}
                                    onClick={() => navigate('/checkout', { state: { products: checkoutCart } })}
                                >
                                    {token ? 'Thanh toán' : 'Đăng nhập'}
                                </CheckoutButton>
                            </CheckoutStack>
                        </CheckoutBox>
                    </CheckoutContainer>
                    : <CheckoutContainer>
                        <SecondaryTitleContainer>
                            <Title>ĐƠN DỰ TÍNH&nbsp;</Title><SellIcon />
                        </SecondaryTitleContainer>
                        <CheckoutBox>
                            <CheckoutTitle>KHUYẾN MÃI</CheckoutTitle>
                            <CheckoutRow>
                                <CheckoutText>Voucher RING:</CheckoutText>
                                <CouponButton>Chọn hoặc nhập mã&nbsp;
                                    <SellIcon />
                                </CouponButton>
                            </CheckoutRow>
                        </CheckoutBox>
                        <CheckoutBox className="sticky">
                            <CheckoutTitle>THANH TOÁN</CheckoutTitle>
                            <CheckoutRow>
                                <CheckoutText>Tiền hàng:</CheckoutText>
                                <CheckoutText>{(displayInfo.total).toLocaleString()}đ</CheckoutText>
                            </CheckoutRow>
                            <CheckoutRow>
                                <CheckoutText>Phí vận chuyển:</CheckoutText>
                                <CheckoutText>{displayInfo.shipping.toLocaleString()}đ</CheckoutText>
                            </CheckoutRow>
                            {(!pending && displayInfo.shippingDiscount > 0) &&
                                <CheckoutRow>
                                    <CheckoutText>Khuyến mãi vận chuyển:</CheckoutText>
                                    <CheckoutText>-{displayInfo.shippingDiscount.toLocaleString()}đ</CheckoutText>
                                </CheckoutRow>
                            }
                            {(!pending && displayInfo.deal > 0) &&
                                <CheckoutRow>
                                    <CheckoutText>Giảm giá sản phẩm:</CheckoutText>
                                    <CheckoutText>-{displayInfo.deal.toLocaleString()}đ</CheckoutText>
                                </CheckoutRow>
                            }
                            {(!pending && displayInfo.couponDiscount > 0) &&
                                <CheckoutRow>
                                    <CheckoutText>Giảm giá từ coupon:</CheckoutText>
                                    <CheckoutText>-{displayInfo.couponDiscount.toLocaleString()}đ</CheckoutText>
                                </CheckoutRow>
                            }
                            <CheckoutRow>
                                <CheckoutText>Tổng:</CheckoutText>
                                <CheckoutPrice>{Math.round(displayInfo.subTotal).toLocaleString()}đ</CheckoutPrice>
                            </CheckoutRow>
                            <CheckoutButton
                                variant="contained"
                                size="large"
                                fullWidth
                                disabled={!numSelected || pending}
                                onClick={() => navigate('/checkout', { state: { products: checkoutCart } })}
                                startIcon={<PaymentsIcon />}
                            >
                                {token ? `Thanh toán (${numSelected})` : 'Đăng nhập để Thanh toán'}
                            </CheckoutButton>
                        </CheckoutBox>
                    </CheckoutContainer >
            }
            <Suspense fallback={null}>
                {open != undefined &&
                    <SwipeableDrawer
                        anchor="bottom"
                        open={open}
                        onOpen={() => toggleDrawer(true)}
                        onClose={() => toggleDrawer(false)}
                    >
                        <CheckoutBox>
                            <CheckoutTitle>THANH TOÁN</CheckoutTitle>
                            <CheckoutRow>
                                <CheckoutText>Tiền hàng:</CheckoutText>
                                <CheckoutText>{(displayInfo.total).toLocaleString()}đ</CheckoutText>
                            </CheckoutRow>
                            <CheckoutRow>
                                <CheckoutText>Phí vận chuyển:</CheckoutText>
                                <CheckoutText>{displayInfo.shipping.toLocaleString()}đ</CheckoutText>
                            </CheckoutRow>
                            <CheckoutRow>
                                <CheckoutText>Khuyến mãi vận chuyển:</CheckoutText>
                                <CheckoutText>-{displayInfo.shippingDiscount.toLocaleString()}đ</CheckoutText>
                            </CheckoutRow>
                            <CheckoutRow>
                                <CheckoutText>Giảm giá sản phẩm:</CheckoutText>
                                <CheckoutText>-{displayInfo.deal.toLocaleString()}đ</CheckoutText>
                            </CheckoutRow>
                            <CheckoutRow>
                                <CheckoutText>Giảm giá từ coupon:</CheckoutText>
                                <CheckoutText>-{displayInfo.couponDiscount.toLocaleString()}đ</CheckoutText>
                            </CheckoutRow>
                            <CheckoutRow>
                                <CheckoutText>Tổng:</CheckoutText>
                                <CheckoutPrice>{Math.round(displayInfo.subTotal).toLocaleString()}đ</CheckoutPrice>
                            </CheckoutRow>
                        </CheckoutBox>
                    </SwipeableDrawer>
                }
            </Suspense>
        </>
    )
}

export default CheckoutDialog