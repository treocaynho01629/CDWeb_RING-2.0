import { lazy, useState, Suspense } from 'react';
import { AltCheckoutBox, CheckoutBox, CheckoutButton, CheckoutContainer, CheckoutPrice, CheckoutPriceContainer, CheckoutRow, CheckoutStack, CheckoutText, CheckoutTitle, CouponButton, DetailContainer, MiniCouponContainer, PriceContainer, SavePrice, SubText } from '../custom/CartComponents';
import { ShoppingCartCheckout, LocalActivityOutlined, KeyboardArrowRight } from '@mui/icons-material';
import { useMediaQuery, useTheme } from '@mui/material';
import useAuth from "../../hooks/useAuth";

const SwipeableDrawer = lazy(() => import('@mui/material/SwipeableDrawer'));
const CouponDisplay = lazy(() => import('../coupon/CouponDisplay'));

const CheckoutDialog = ({ coupon, shopCoupon, selected, navigate, handleOpenDialog, calculating, estimated, calculated }) => {
    const { token } = useAuth();
    const theme = useTheme();
    const mobileMode = useMediaQuery(theme.breakpoints.down('sm'));
    const tabletMode = useMediaQuery(theme.breakpoints.down('md_lg'));
    const [open, setOpen] = useState(undefined);
    const numSelected = selected?.length;
    const checkoutCart = {
        selected,
        coupon,
        shopCoupon
    }

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
            {!numSelected ?
                <CheckoutText className="error">Vui lòng chọn sản phẩm</CheckoutText>
                : <PriceContainer>
                    <CheckoutPrice><b>Tổng:</b>{displayInfo.total.toLocaleString()}đ</CheckoutPrice>
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
                                    <Suspense fallback={null}>
                                        {(coupon && numSelected > 0) && <CouponDisplay coupon={coupon} />}
                                    </Suspense>
                                    <KeyboardArrowRight fontSize="small" />
                                </MiniCouponContainer>
                            </CouponButton>
                        </CheckoutStack>
                        <CheckoutStack>
                            <AltCheckoutBox onClick={() => toggleDrawer(true)}>
                                {!numSelected ?
                                    <CheckoutText className="error">Vui lòng chọn sản phẩm</CheckoutText>
                                    : <PriceContainer>
                                        <CheckoutPrice><b>Tổng:</b>{displayInfo.total.toLocaleString()}đ</CheckoutPrice>
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
                                onClick={() => navigate('/checkout', { state: checkoutCart })}
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
                                        <Suspense fallback={null}>
                                            {(coupon && numSelected > 0) && <CouponDisplay coupon={coupon} />}
                                        </Suspense>
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
                                        onClick={() => navigate('/checkout', { state: checkoutCart })}
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
                                    <Suspense fallback={null}>
                                        {(coupon && numSelected > 0) && <CouponDisplay coupon={coupon} />}
                                    </Suspense>
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
                                    onClick={() => navigate('/checkout', { state: checkoutCart })}
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
                        disableSwipeToOpen={true}
                        disabled={calculating}
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