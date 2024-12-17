import styled from '@emotion/styled'
import {
    AltCheckoutBox, CheckoutBox, CheckoutButton, CheckoutContainer, CheckoutPrice,
    CheckoutPriceContainer, CheckoutRow, CheckoutStack, CheckoutText, CheckoutTitle,
    CouponButton, MiniCouponContainer, PriceContainer, SavePrice, SubText
} from '../custom/CartComponents';
import { useMediaQuery, useTheme } from '@mui/material';
import { Edit, KeyboardArrowRight, KeyboardDoubleArrowDown, LocalActivityOutlined } from '@mui/icons-material';
import { lazy, Suspense, useState } from 'react';
import { getAddress } from '../../ultils/address';
import { currencyFormat } from '../../ultils/covert';
import CouponDisplay from '../coupon/CouponDisplay';
import PriceDisplay from './PriceDisplay';
import NumberFlow from '@number-flow/react';

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

const AddressDivider = styled.div`
    width: 100%;
    margin: ${props => props.theme.spacing(1)} 0;
    border-bottom: .5px dashed ${props => props.theme.palette.divider};
`
//#endregion

const FinalCheckoutDialog = ({ coupon, discount, displayInfo, calculating, addressInfo,
    isValid, handleNext, activeStep, maxSteps, backFirstStep, handleOpenDialog, handleSubmit, reCaptchaLoaded }) => {
    const theme = useTheme();
    const mobileMode = useMediaQuery(theme.breakpoints.down('sm'));
    const tabletMode = useMediaQuery(theme.breakpoints.down('md_lg'));
    const fullAddress = [addressInfo?.city, addressInfo?.address].join(", ");
    const [open, setOpen] = useState(undefined);

    const toggleDrawer = (newOpen) => { setOpen(newOpen) };
    const address = addressInfo?.type ? getAddress(addressInfo.type) : null;

    //Component stuff
    let checkoutDetail = <>
        <PriceDisplay displayInfo={displayInfo} loggedIn={true} />
        <CheckoutRow>
            <PriceContainer>
                <CheckoutPrice>
                    <b>Tổng:</b>
                    <NumberFlow
                        value={displayInfo.total}
                        format={{ style: 'currency', currency: 'VND' }}
                        locales={'vi-VN'}
                        aria-hidden="true"
                        respectMotionPreference={false}
                        willChange
                    />
                </CheckoutPrice>
                {(!calculating && displayInfo.totalDiscount > 0) &&
                    <SavePrice>Tiết kiệm {currencyFormat.format(displayInfo.totalDiscount)}</SavePrice>}
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
                            <CouponButton onClick={handleOpenDialog}>
                                <span>
                                    <LocalActivityOutlined color="error" />&nbsp;
                                    {(coupon && discount) ? `Đã giảm ${currencyFormat.format(discount)}`
                                        : `Chọn mã giảm giá ${(coupon != null) ? 'khác' : ''}`}
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
                                    <CheckoutPrice
                                    ><b>Tổng: ({activeStep + 1}/{maxSteps})</b>
                                        <NumberFlow
                                            value={displayInfo.total}
                                            format={{ style: 'currency', currency: 'VND' }}
                                            locales={'vi-VN'}
                                            aria-hidden="true"
                                            respectMotionPreference={false}
                                            willChange
                                        />
                                    </CheckoutPrice>
                                    {(!calculating && displayInfo.totalDiscount > 0) &&
                                        <SavePrice>Tiết kiệm {currencyFormat.format(displayInfo.totalDiscount)}</SavePrice>}
                                </PriceContainer>
                            </AltCheckoutBox>
                            {activeStep < 2 ?
                                <CheckoutButton
                                    variant="contained"
                                    size="large"
                                    fullWidth
                                    sx={{ maxWidth: '42%' }}
                                    onClick={handleNext}
                                    disabled={!isValid || calculating}
                                    endIcon={<KeyboardDoubleArrowDown />}
                                >
                                    Tiếp tục
                                </CheckoutButton>
                                :
                                <CheckoutButton
                                    variant="contained"
                                    size="large"
                                    fullWidth
                                    sx={{ maxWidth: '42%' }}
                                    disabled={calculating || !reCaptchaLoaded}
                                    onClick={handleSubmit}
                                >
                                    Đặt hàng
                                </CheckoutButton>
                            }
                        </CheckoutStack>
                    </>
                    : tabletMode
                        ? <>
                            <CheckoutBox className="sticky">
                                <CheckoutStack>
                                    <CouponButton onClick={handleOpenDialog}>
                                        <span>
                                            <LocalActivityOutlined color="error" />&nbsp;
                                            {(coupon && discount) ? `Đã giảm ${currencyFormat.format(discount)}`
                                                : `Chọn mã giảm giá ${(coupon != null) ? 'khác' : ''}`}
                                        </span>
                                        <MiniCouponContainer>
                                            <Suspense fallback={null}>
                                                {coupon && <CouponDisplay coupon={coupon} />}
                                            </Suspense>
                                            <KeyboardArrowRight fontSize="small" />
                                        </MiniCouponContainer>
                                    </CouponButton>
                                </CheckoutStack>
                                <CheckoutStack>
                                    <CheckoutPriceContainer>
                                        <PriceContainer>
                                            <CheckoutText>Tổng thanh toán:</CheckoutText>
                                        </PriceContainer>
                                        <PriceContainer>
                                            <CheckoutPrice onClick={() => toggleDrawer(true)}>
                                                <NumberFlow
                                                    value={displayInfo.total}
                                                    format={{ style: 'currency', currency: 'VND' }}
                                                    locales={'vi-VN'}
                                                    aria-hidden="true"
                                                    respectMotionPreference={false}
                                                    willChange
                                                />
                                            </CheckoutPrice>&emsp;
                                            {(!calculating && displayInfo.totalDiscount > 0) &&
                                                <SavePrice>Tiết kiệm {currencyFormat.format(displayInfo.totalDiscount)}</SavePrice>}
                                        </PriceContainer>
                                    </CheckoutPriceContainer>
                                    {activeStep < 2 ?
                                        <CheckoutButton
                                            variant="contained"
                                            size="large"
                                            fullWidth
                                            sx={{ maxWidth: '35%' }}
                                            onClick={handleNext}
                                            disabled={!isValid || calculating}
                                            endIcon={<KeyboardDoubleArrowDown />}
                                        >
                                            Tiếp tục ({activeStep + 1}/{maxSteps})
                                        </CheckoutButton>
                                        :
                                        <CheckoutButton
                                            variant="contained"
                                            size="large"
                                            fullWidth
                                            sx={{ maxWidth: '35%' }}
                                            disabled={calculating || !reCaptchaLoaded}
                                            onClick={handleSubmit}
                                        >
                                            Đặt hàng
                                        </CheckoutButton>
                                    }
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
                                    <CouponButton onClick={handleOpenDialog}>
                                        <span>
                                            <LocalActivityOutlined color="error" />&nbsp;
                                            {(coupon && discount) ? `Đã giảm ${currencyFormat.format(discount)}`
                                                : `Chọn mã giảm giá ${(coupon != null) ? 'khác' : ''}`}
                                        </span>
                                        <KeyboardArrowRight fontSize="small" />
                                    </CouponButton>
                                </CheckoutBox>
                            }
                            <CheckoutBox className="sticky">
                                <CheckoutTitle>ĐƠN HÀNG</CheckoutTitle>
                                {checkoutDetail}
                                {activeStep < 2 ?
                                    <CheckoutButton
                                        variant="contained"
                                        size="large"
                                        fullWidth
                                        sx={{ padding: '11px', mt: 1 }}
                                        onClick={handleNext}
                                        disabled={!isValid || calculating}
                                        endIcon={<KeyboardDoubleArrowDown />}
                                    >
                                        Tiếp tục ({activeStep + 1}/{maxSteps})
                                    </CheckoutButton>
                                    :
                                    <CheckoutButton
                                        variant="contained"
                                        size="large"
                                        fullWidth
                                        sx={{ padding: '11px', mt: 1 }}
                                        disabled={calculating || !reCaptchaLoaded}
                                        onClick={handleSubmit}
                                    >
                                        Đặt hàng
                                    </CheckoutButton>
                                }
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
                            {(activeStep > 0 && addressInfo) &&
                                <>
                                    <CheckoutTitle>
                                        GIAO TỚI
                                        {coupon && <EditButton onClick={() => {
                                            backFirstStep();
                                            toggleDrawer(false);
                                        }
                                        }><Edit /> Thay đổi</EditButton>}
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
                                    <AddressDivider />
                                </>
                            }
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