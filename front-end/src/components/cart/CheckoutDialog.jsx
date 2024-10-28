import styled from 'styled-components'
import { lazy, useState, Suspense } from 'react';
import { ShoppingCartCheckout, LocalActivityOutlined, KeyboardArrowRight } from '@mui/icons-material';
import { useMediaQuery, useTheme, Button } from '@mui/material';
import useAuth from "../../hooks/useAuth";

const SwipeableDrawer = lazy(() => import('@mui/material/SwipeableDrawer'));
const CouponDisplay = lazy(() => import('../coupon/CouponDisplay'));

//#region styled
const CheckoutContainer = styled.div`
    position: relative;
    height: 100%;

    ${props => props.theme.breakpoints.down("sm")} {
        position: fixed;
        bottom: 0;
        left: 0;
        max-height: 100px;
        width: 100%;
        z-index: ${props => props.theme.zIndex.appBar};
        border-top: .5px solid ${props => props.theme.palette.divider};
        box-shadow: ${props => props.theme.shadows[12]};
        background-color: ${props => props.theme.palette.background.default};
    }
`

const CheckoutBox = styled.div`
    border: .5px solid ${props => props.theme.palette.action.focus};
    padding: 20px 16px;
    margin-bottom: ${props => props.theme.spacing(2)};
    background-color: ${props => props.theme.palette.background.default};

    &.sticky {
        margin-bottom: -0.5px;
        position: sticky;
        top: ${props => props.theme.mixins.toolbar.minHeight + 15}px;
    }

    ${props => props.theme.breakpoints.down("md_lg")} {
        margin: 0;
        padding-top: ${props => props.theme.spacing(1)};
    }
`

const CheckoutStack = styled.div`
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;

    &:first-child {
        border-bottom: .5px dashed ${props => props.theme.palette.divider};
        margin-bottom: ${props => props.theme.spacing(1)};
        padding-bottom: ${props => props.theme.spacing(1)};
    }

    ${props => props.theme.breakpoints.down("sm")} {
        width: 100%;
        height: 50px;

        &:first-child {
            margin-bottom: 0;
            padding: 0 5px;
        }
    }
`

const CheckoutPriceContainer = styled.div`
`

const AltCheckoutBox = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: start;
    padding: 5px 7px;
    white-space: nowrap;
`

const CheckoutTitle = styled.span`
    font-size: 16px;
    font-weight: bold;
    display: flex;
    justify-content: space-between;

    span {
        font-size: 12px;
        color: ${props => props.theme.palette.text.secondary};
        font-style: italic;
    }
`

const CheckoutRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 4px 0;
`

const CheckoutText = styled.span`
    font-size: 14px;
    font-weight: 400;

    &.bold { font-weight: bold; }
    &.error { color: ${props => props.theme.palette.error.main}}
`

const PriceContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: end;

    ${props => props.theme.breakpoints.down("md_lg")} {
        flex-direction: row;
        align-items: center;
    }

    ${props => props.theme.breakpoints.down("sm")} {
        flex-direction: column;
        align-items: end;
    }
`

const CheckoutPrice = styled.span`
    font-size: 18px;
    font-weight: bold;
    color: ${props => props.theme.palette.error.main};
    cursor: pointer;

    ${props => props.theme.breakpoints.down("md_lg")} {
        font-size: 16px;
    }
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

const DetailContainer = styled.div`
    padding: 10px 0;
    margin-bottom: 10px;
    border-bottom: .5px dashed ${props => props.theme.palette.divider};
`

const CouponButton = styled.b`
    font-size: 15px;
	white-space: nowrap;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;

    span {
        display: flex;
        align-items: center;
    }
    
    ${props => props.theme.breakpoints.down("sm")} {
        font-size: 14px;
        margin: 0;
        width: 100%;
    }
`

const MiniCouponContainer = styled.div`
    display: flex;
    align-items: center;
`

const CheckoutButton = styled(Button)`
    height: 100%;
    line-height: 1.5;
`
//#endregion

const CheckoutDialog = ({ coupon, navigate, handleOpenDialog, calculating, estimated, calculated, numSelected }) => {
    const { token } = useAuth();
    const theme = useTheme();
    const mobileMode = useMediaQuery(theme.breakpoints.down('sm'));
    const tabletMode = useMediaQuery(theme.breakpoints.down('md_lg'));
    const [open, setOpen] = useState(undefined);
  
    const toggleDrawer = (newOpen) => { setOpen(newOpen) };

    //Info
    const displayInfo = {
        deal: (calculating || !calculated) ? estimated?.deal : calculated?.dealDiscount,
        subTotal: (calculating || !calculated) ? estimated?.subTotal : calculated?.productsTotal,
        shipping: (calculating || !calculated) ? estimated?.shipping : calculated?.shippingFee,
        couponDiscount: calculated?.couponDiscount || 0,
        totalDiscount: calculated?.totalDiscount || 0,
        shippingDiscount: calculated?.shippingDiscount || 0,
        total: (calculating || !calculated) ? estimated?.total : calculated?.total - calculated?.totalDiscount
    }

    //Component stuff
    let checkoutDetail = <>
        <DetailContainer>
            <CheckoutRow>
                <CheckoutText>Tiền hàng:</CheckoutText>
                <CheckoutText>{(displayInfo.subTotal).toLocaleString()}đ</CheckoutText>
            </CheckoutRow>
            <CheckoutRow>
                <CheckoutText>Phí vận chuyển:</CheckoutText>
                <CheckoutText>{displayInfo.shipping.toLocaleString()}đ</CheckoutText>
            </CheckoutRow>
            {(!calculating && displayInfo.shippingDiscount > 0) &&
                <CheckoutRow>
                    <CheckoutText>Khuyến mãi vận chuyển:</CheckoutText>
                    <CheckoutText>-{displayInfo.shippingDiscount.toLocaleString()}đ</CheckoutText>
                </CheckoutRow>
            }
            {displayInfo.deal > 0 &&
                <CheckoutRow>
                    <CheckoutText>Giảm giá sản phẩm:</CheckoutText>
                    <CheckoutText>-{displayInfo.deal.toLocaleString()}đ</CheckoutText>
                </CheckoutRow>
            }
            {(!calculating && displayInfo.couponDiscount > 0) &&
                <CheckoutRow>
                    <CheckoutText>Giảm giá từ coupon:</CheckoutText>
                    <CheckoutText>-{displayInfo.couponDiscount.toLocaleString()}đ</CheckoutText>
                </CheckoutRow>
            }
        </DetailContainer>
        <CheckoutRow>
            <CheckoutText className="bold">Tổng:</CheckoutText>
            {!numSelected ?
                <CheckoutText className="error">Vui lòng chọn sản phẩm</CheckoutText>
                : <PriceContainer>
                    <CheckoutPrice>{displayInfo.total.toLocaleString()}đ</CheckoutPrice>
                    {(!calculating && displayInfo.totalDiscount > 0) &&
                        <SavePrice>Tiết kiệm {Math.round(displayInfo.totalDiscount).toLocaleString()}đ</SavePrice>}
                    <SubText>(Đã bao gồm VAT nếu có)</SubText>
                </PriceContainer>
            }
        </CheckoutRow>
    </>

    return (
        <>
            <CheckoutContainer>
                {mobileMode
                    ? <>
                        <CheckoutStack>
                            <CouponButton onClick={() => handleOpenDialog()}>
                                <span>
                                    <LocalActivityOutlined color="error" />&nbsp;
                                    Chọn mã giảm giá {coupon && 'khác'}
                                </span>
                                <MiniCouponContainer>
                                    {(coupon && numSelected > 0) && <CouponDisplay coupon={coupon} />}
                                    <KeyboardArrowRight fontSize="small" />
                                </MiniCouponContainer>
                            </CouponButton>
                        </CheckoutStack>
                        <CheckoutStack>
                            <AltCheckoutBox onClick={() => toggleDrawer(true)}>
                                <CheckoutText className="bold">Tổng:</CheckoutText>
                                {!numSelected ?
                                    <CheckoutText className="error">Vui lòng chọn sản phẩm</CheckoutText>
                                    : <PriceContainer>
                                        <CheckoutPrice>{displayInfo.total.toLocaleString()}đ</CheckoutPrice>
                                        {(!calculating && displayInfo.totalDiscount > 0) &&
                                            <SavePrice>Tiết kiệm {Math.round(displayInfo.totalDiscount).toLocaleString()}đ</SavePrice>}
                                    </PriceContainer>
                                }
                            </AltCheckoutBox>
                            <CheckoutButton
                                variant="contained"
                                size="large"
                                fullWidth
                                sx={{ maxWidth: '42%' }}
                                disabled={!numSelected || calculating}
                                onClick={() => navigate('/checkout', { state: { products: '' } })}
                            >
                                {token ? `Thanh toán (${numSelected})` : 'Đăng nhập'}
                            </CheckoutButton>
                        </CheckoutStack>
                    </>
                    : tabletMode
                        ? <>
                            <CheckoutBox className="sticky">
                                <CheckoutStack>
                                    <CheckoutRow>
                                        {(coupon && numSelected > 0) && <CouponDisplay coupon={coupon} />}
                                    </CheckoutRow>
                                    <CouponButton onClick={() => handleOpenDialog()}>
                                        <span>
                                            <LocalActivityOutlined color="error" />&nbsp;
                                            Chọn mã giảm giá {coupon && 'khác'}
                                        </span>
                                        <KeyboardArrowRight fontSize="small" />
                                    </CouponButton>
                                </CheckoutStack>
                                <CheckoutStack>
                                    <CheckoutPriceContainer>
                                        <CheckoutText className="bold">
                                            Tổng thanh toán: ({numSelected} Sản phẩm)&emsp;
                                            {numSelected && <SubText>(Đã bao gồm VAT)</SubText>}
                                        </CheckoutText>
                                        <PriceContainer>
                                            <CheckoutPrice onClick={() => toggleDrawer(true)}>
                                                {Math.round(displayInfo.total).toLocaleString()}đ
                                            </CheckoutPrice>&emsp;
                                            {(!calculating && displayInfo.totalDiscount > 0) &&
                                                <SavePrice>Tiết kiệm {Math.round(displayInfo.totalDiscount).toLocaleString()}đ</SavePrice>}
                                        </PriceContainer>
                                    </CheckoutPriceContainer>
                                    <CheckoutButton
                                        variant="contained"
                                        size="large"
                                        fullWidth
                                        sx={{ maxWidth: '35%' }}
                                        disabled={!numSelected || calculating}
                                        onClick={() => navigate('/checkout', { state: { products: '' } })}
                                        startIcon={<ShoppingCartCheckout />}
                                    >
                                        {token ? 'Thanh toán' : 'Đăng nhập'}
                                    </CheckoutButton>
                                </CheckoutStack>
                            </CheckoutBox>
                        </>
                        : <>
                            <CheckoutBox>
                                <CheckoutTitle>
                                    KHUYẾN MÃI
                                    {(coupon && numSelected > 0) && <span>Đã áp dụng</span>}
                                </CheckoutTitle>
                                <CheckoutRow>
                                    {(coupon && numSelected > 0) && <CouponDisplay coupon={coupon} />}
                                </CheckoutRow>
                                <CouponButton onClick={() => handleOpenDialog()}>
                                    <span>
                                        <LocalActivityOutlined color="error" />&nbsp;
                                        Chọn mã giảm giá {coupon && 'khác'}
                                    </span>
                                    <KeyboardArrowRight fontSize="small" />
                                </CouponButton>
                            </CheckoutBox>
                            <CheckoutBox className="sticky">
                                <CheckoutTitle>THANH TOÁN</CheckoutTitle>
                                {checkoutDetail}
                                <CheckoutButton
                                    variant="contained"
                                    size="large"
                                    fullWidth
                                    sx={{ padding: '11px', mt: 1 }}
                                    disabled={!numSelected || calculating}
                                    onClick={() => navigate('/checkout', { state: { products: '' } })}
                                    startIcon={<ShoppingCartCheckout />}
                                >
                                    {token ? `Thanh toán (${numSelected})` : 'Đăng nhập để Thanh toán'}
                                </CheckoutButton>
                            </CheckoutBox>
                        </ >
                }
            </CheckoutContainer>
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
                            {checkoutDetail}
                        </CheckoutBox>
                    </SwipeableDrawer>
                }
            </Suspense>
        </>
    )
}

export default CheckoutDialog