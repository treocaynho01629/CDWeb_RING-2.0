import styled from 'styled-components'
import { lazy, useMemo, useState, Suspense } from 'react';
import { Sell as SellIcon, Payments as PaymentsIcon, ShoppingCartCheckout, LocalActivityOutlined, KeyboardArrowRight } from '@mui/icons-material';
import { useMediaQuery, useTheme, Button } from '@mui/material';
import useAuth from "../../hooks/useAuth";

const SwipeableDrawer = lazy(() => import('@mui/material/SwipeableDrawer'));

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
    }
`

const CheckoutStack = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;

    &:first-child {
        border-bottom: .5px dashed ${props => props.theme.palette.divider};
        margin-bottom: ${props => props.theme.spacing(1)};
    }

    ${props => props.theme.breakpoints.down("sm")} {
        width: 100%;
        height: 50px;
        align-items: start;
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
        margin: 8px 0;
    }
`

const Coupon = styled.div`
    width: 100%;    
    position: relative;
    display: flex;
    overflow: hidden;
    white-space: nowrap;
    margin-right: 8px;
    cursor: pointer;
`

const CouponIcon = styled.div`
    float: left;
    width: 40px;
    height: 40px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    border: .5px solid ${props => props.theme.palette.divider};
    border-right: none;
    background-color: ${props => props.theme.palette.primary.light};
    color: ${props => props.theme.palette.primary.contrastText};

    &.error {
        background-color: ${props => props.theme.palette.error.light};
        color: ${props => props.theme.palette.error.contrastText};
    }

    &.warning {
        background-color: ${props => props.theme.palette.warning.light};
        color: ${props => props.theme.palette.warning.contrastText};
    }

    ${props => props.theme.breakpoints.down("md")} {
        width: 22px;
        height: 22px;
        background-color: ${props => props.theme.palette.primary.light};
        color: ${props => props.theme.palette.primary.dark};

        svg { font-size: 15px; }
    }
`

const CouponContent = styled.div`
    float: left;
    height: 40px;
    max-width: 130px;
    position: relative;
    display: flex;
    align-items: center;
    border-radius: 6px;
    padding: 0 10px;
    border: .5px solid ${props => props.theme.palette.divider};
    border-left: none;

    &::before, &::after {
        content: "";
        position: absolute;
        background-color: ${props => props.theme.palette.background.default};
        border: .5px solid ${props => props.theme.palette.divider};
        height: 10px;
        width: 10px;
        border-radius: 100%;
    }

    &::before{
        top: -5px;
        left: -5px;
    }

    &::after{
        bottom: -5px;
        left: -5px;
    }

    
    ${props => props.theme.breakpoints.down("md")} {
        height: 22px;
        max-width: 120px;

        &::before, &::after {
            height: 6px;
            width: 6px;

            &::before{
                top: -3px;
                left: -3px;
            }

            &::after{
                bottom: -3px;
                left: -3px;
            }
        }
    }
`

const CouponTitle = styled.div`
    text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
    font-weight: 450;
    font-size: 14px;

    ${props => props.theme.breakpoints.down("md")} {
        font-size: 12px;
        font-weight: 350;
        text-transform: uppercase;
    }
`

const CheckoutButton = styled(Button)`
    height: 100%;
    line-height: 1.5;
`
//#endregion

const tempShippingFee = 10000;

const CheckoutDialog = ({ checkoutCart, navigate, calculating, calculated, numSelected }) => {
    const { token } = useAuth();
    const theme = useTheme();
    const mobileMode = useMediaQuery(theme.breakpoints.down('sm'));
    const tabletMode = useMediaQuery(theme.breakpoints.down('md_lg'));

    const [estimating, setEstimating] = useState(false);
    const [open, setOpen] = useState(undefined);

    //Estimate before receive caculated price from server
    const estimatePrice = () => {
        let estimate = { deal: 0, total: 0, shipping: 0, subTotal: 0 }; //Initial value
        setEstimating(true);

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
            estimate = { deal, total, shipping, subTotal: (total + shipping - deal) };
        }

        setEstimating(false);
        return estimate;
    }

    const calculatedInfo = () => {
        let info;

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
    const pending = (estimating || calculating);
    const estimate = useMemo(() => estimatePrice(), [checkoutCart]);
    const info = useMemo(() => calculatedInfo(), [calculated]);
    const displayInfo = {
        deal: (pending || !info) ? estimate.deal : info.deal,
        total: (pending || !info) ? estimate.total : info.total,
        shipping: (pending || !info) ? estimate.shipping : info.shipping,
        couponDiscount: info?.couponDiscount || 0,
        totalDiscount: info?.totalDiscount || 0,
        shippingDiscount: info?.shippingDiscount || 0,
        subTotal: (pending || !info) ? estimate.subTotal : info.subTotal
    }

    //Component stuff
    let checkoutDetail = <>
        <DetailContainer>
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
        </DetailContainer>
        <CheckoutRow>
            <CheckoutText className="bold">Tổng:</CheckoutText>
            {!numSelected ?
                <CheckoutText className="error">Vui lòng chọn sản phẩm</CheckoutText>
                : <PriceContainer>
                    <CheckoutPrice>{displayInfo.subTotal.toLocaleString()}đ</CheckoutPrice>
                    {(!pending && displayInfo.totalDiscount > 0) &&
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
                            <CouponButton onClick={() => handleOpenDialog(id)}>
                                <span>
                                    <LocalActivityOutlined color="error" />&nbsp;
                                    Chọn mã giảm giá
                                </span>
                                <KeyboardArrowRight fontSize="small" />
                            </CouponButton>
                        </CheckoutStack>
                        <CheckoutStack>
                            <AltCheckoutBox onClick={() => toggleDrawer(true)}>
                                <CheckoutText className="bold">Tổng:</CheckoutText>
                                {!numSelected ?
                                    <CheckoutText className="error">Vui lòng chọn sản phẩm</CheckoutText>
                                    : <PriceContainer>
                                        <CheckoutPrice>{displayInfo.subTotal.toLocaleString()}đ</CheckoutPrice>
                                        {(!pending && displayInfo.totalDiscount > 0) &&
                                            <SavePrice>Tiết kiệm {Math.round(displayInfo.totalDiscount).toLocaleString()}đ</SavePrice>}
                                    </PriceContainer>
                                }
                            </AltCheckoutBox>
                            <CheckoutButton
                                variant="contained"
                                size="large"
                                fullWidth
                                sx={{ maxWidth: '40%' }}
                                disabled={!numSelected || pending}
                                onClick={() => navigate('/checkout', { state: { products: checkoutCart } })}
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
                                        {/* <Coupon>
                                    <CouponIcon className={couponSumary.color}>{couponSumary.icon}</CouponIcon>
                                    <CouponContent>
                                        <CouponTitle>{`${couponSumary.name} ${coupon.detail.discount * 100}%`}</CouponTitle>
                                    </CouponContent>
                                </Coupon> */}
                                    </CheckoutRow>
                                    <CouponButton onClick={() => handleOpenDialog(id)}>
                                        <span>
                                            <LocalActivityOutlined color="error" />&nbsp;
                                            Chọn mã giảm giá
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
                                                {Math.round(displayInfo.subTotal).toLocaleString()}đ
                                            </CheckoutPrice>&emsp;
                                            {(!pending && displayInfo.totalDiscount > 0) &&
                                                <SavePrice>Tiết kiệm {Math.round(displayInfo.totalDiscount).toLocaleString()}đ</SavePrice>}
                                        </PriceContainer>
                                    </CheckoutPriceContainer>
                                    <CheckoutButton
                                        variant="contained"
                                        size="large"
                                        fullWidth
                                        sx={{ maxWidth: '35%' }}
                                        disabled={!numSelected || pending}
                                        onClick={() => navigate('/checkout', { state: { products: checkoutCart } })}
                                        startIcon={<ShoppingCartCheckout />}
                                    >
                                        {token ? 'Thanh toán' : 'Đăng nhập'}
                                    </CheckoutButton>
                                </CheckoutStack>
                            </CheckoutBox>
                        </>
                        : <>
                            <CheckoutBox>
                                <CheckoutTitle>KHUYẾN MÃI</CheckoutTitle>
                                <CheckoutRow>
                                    {/* <Coupon>
                                    <CouponIcon className={couponSumary.color}>{couponSumary.icon}</CouponIcon>
                                    <CouponContent>
                                        <CouponTitle>{`${couponSumary.name} ${coupon.detail.discount * 100}%`}</CouponTitle>
                                    </CouponContent>
                                </Coupon> */}
                                </CheckoutRow>
                                <CouponButton onClick={() => handleOpenDialog(id)}>
                                    <span>
                                        <LocalActivityOutlined color="error" />&nbsp;
                                        Chọn mã giảm giá
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
                                    disabled={!numSelected || pending}
                                    onClick={() => navigate('/checkout', { state: { products: checkoutCart } })}
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