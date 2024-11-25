import styled from '@emotion/styled'
import { AltCheckoutBox, CheckoutBox, CheckoutButton, CheckoutContainer, CheckoutPrice, CheckoutPriceContainer, CheckoutRow, CheckoutStack, CheckoutText, CheckoutTitle, CouponButton, DetailContainer, MiniCouponContainer, PriceContainer, SavePrice, SubText } from '../custom/CartComponents';
import { useMediaQuery, useTheme } from '@mui/material';
import { Edit, KeyboardArrowRight, LocalActivityOutlined, ShoppingCartCheckout } from '@mui/icons-material';
import { lazy, Suspense, useState } from 'react';
import { getAddress } from '../../ultils/address';
import CouponDisplay from '../coupon/CouponDisplay';

const SwipeableDrawer = lazy(() => import('@mui/material/SwipeableDrawer'));

//#region styled
const UserInfo = styled.b`
    font-size: 14px;
    margin: ${props => props.theme.spacing(1)} 0;

    ${props => props.theme.breakpoints.down("sm")} {
        font-size: 13px;
    }
`

const AddressContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
`

const AddressContent = styled.div`
    width: 100%;
    display: flex;
    text-overflow: ellipsis;
	overflow: hidden;
    margin-right: ${props => props.theme.spacing(2)};
    white-space: nowrap;
`

const Address = styled.span`
    font-size: 14px;
    line-height: 1.75em;
    margin-top: ${props => props.theme.spacing(1)};
    color: ${props => props.theme.palette.text.secondary};
`

const AddressTag = styled.span`
    font-size: 12px;
    font-weight: bold;
    margin-right: ${props => props.theme.spacing(.5)};
    padding: ${props => props.theme.spacing(.5)} ${props => props.theme.spacing(1)};
    border: .5px solid ${props => props.theme.palette.primary.main};
    color: ${props => props.theme.palette.primary.main};

    &.info {
        color: ${props => props.theme.palette.info.main};
        border-color: ${props => props.theme.palette.info.main};
    }
`

const EditButton = styled.div`
    font-size: 12px;
    color: ${props => props.theme.palette.info.main};
    display: flex;
    align-items: center;
    cursor: pointer;

    svg {
        font-size: 16px;
        margin-right: ${props => props.theme.spacing(.5)};
    }

    &:hover {
        color: ${props => props.theme.palette.info.light};
    }
`
//#endregion

const FinalCheckoutDialog = ({ coupon, productCount, estimated, calculated, calculating, addressInfo,
    activeStep, backFirstStep, handleOpenDialog }) => {
    const theme = useTheme();
    const mobileMode = useMediaQuery(theme.breakpoints.down('sm'));
    const tabletMode = useMediaQuery(theme.breakpoints.down('md_lg'));
    const [open, setOpen] = useState(undefined);
    const fullAddress = [addressInfo?.city, addressInfo?.address].join(", ");

    const toggleDrawer = (newOpen) => { setOpen(newOpen) };
    const address = addressInfo?.type ? getAddress(addressInfo.type) : null;

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
            <PriceContainer>
                <CheckoutPrice><b>Tổng:</b>{displayInfo.total.toLocaleString()}đ</CheckoutPrice>
                {(!calculating && displayInfo.totalDiscount > 0) &&
                    <SavePrice>Tiết kiệm {Math.round(displayInfo.totalDiscount).toLocaleString()}đ</SavePrice>}
                <SubText>(Giá này đã bao gồm thuế GTGT, phí đóng gói, phí vận chuyển và các chi phí phát sinh khác)</SubText>
            </PriceContainer>
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
                                    {coupon && <CouponDisplay coupon={coupon} />}
                                    <KeyboardArrowRight fontSize="small" />
                                </MiniCouponContainer>
                            </CouponButton>
                        </CheckoutStack>
                        <CheckoutStack>
                            <AltCheckoutBox onClick={() => toggleDrawer(true)}>
                                <PriceContainer>
                                    <CheckoutPrice><b>Tổng:</b>{displayInfo.total.toLocaleString()}đ</CheckoutPrice>
                                    {(!calculating && displayInfo.totalDiscount > 0) &&
                                        <SavePrice>Tiết kiệm {Math.round(displayInfo.totalDiscount).toLocaleString()}đ</SavePrice>}
                                </PriceContainer>
                            </AltCheckoutBox>
                            <CheckoutButton
                                variant="contained"
                                size="large"
                                fullWidth
                                sx={{ maxWidth: '42%' }}
                                disabled={calculating}
                            >
                                Đặt hàng
                            </CheckoutButton>
                        </CheckoutStack>
                    </>
                    : tabletMode
                        ? <>
                            <CheckoutBox className="sticky">
                                <CheckoutStack>
                                    <CheckoutRow>
                                        {coupon && <CouponDisplay coupon={coupon} />}
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
                                            Tổng thanh toán: ({productCount} Sản phẩm)&emsp;
                                            <SubText>(Đã bao gồm VAT)</SubText>
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
                                        disabled={calculating}
                                        startIcon={<ShoppingCartCheckout />}
                                    >
                                        Đặt hàng
                                    </CheckoutButton>
                                </CheckoutStack>
                            </CheckoutBox>
                        </>
                        : <>
                            {(activeStep > 0 && addressInfo) &&
                                <CheckoutBox>
                                    <CheckoutTitle>
                                        GIAO TỚI
                                        {coupon && <EditButton onClick={backFirstStep}><Edit /> Thay đổi</EditButton>}
                                    </CheckoutTitle>
                                    <CheckoutRow>
                                        <AddressContainer>
                                            <AddressContent>
                                                <UserInfo>{addressInfo?.companyName ?? addressInfo?.name}&nbsp;</UserInfo>
                                                {addressInfo?.phone && <UserInfo>{`(+84) ${addressInfo.phone}`}</UserInfo>}
                                            </AddressContent>
                                            <Address>
                                                {address && <AddressTag className={address.color}>{address.label}</AddressTag>}
                                                {fullAddress.length > 2 ? fullAddress : 'Không xác định'}
                                            </Address>
                                        </AddressContainer>
                                    </CheckoutRow>
                                </CheckoutBox>
                            }
                            {activeStep > 0 &&
                                <CheckoutBox>
                                    <CheckoutTitle>
                                        KHUYẾN MÃI
                                        {coupon && <span>Đã áp dụng</span>}
                                    </CheckoutTitle>
                                    <CheckoutRow>
                                        {coupon && <CouponDisplay coupon={coupon} />}
                                    </CheckoutRow>
                                    <CouponButton onClick={() => handleOpenDialog()}>
                                        <span>
                                            <LocalActivityOutlined color="error" />&nbsp;
                                            Chọn mã giảm giá {coupon && 'khác'}
                                        </span>
                                        <KeyboardArrowRight fontSize="small" />
                                    </CouponButton>
                                </CheckoutBox>
                            }
                            <CheckoutBox className="sticky">
                                <CheckoutTitle>THANH TOÁN</CheckoutTitle>
                                {checkoutDetail}
                                <CheckoutButton
                                    variant="contained"
                                    size="large"
                                    fullWidth
                                    sx={{ padding: '11px', mt: 1 }}
                                    disabled={calculating}
                                    startIcon={<ShoppingCartCheckout />}
                                >
                                    Đặt hàng
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
                            <CheckoutTitle>ĐẶT HÀNG</CheckoutTitle>
                            {checkoutDetail}
                        </CheckoutBox>
                    </SwipeableDrawer>
                }
            </Suspense>
        </>
    )
}

export default FinalCheckoutDialog