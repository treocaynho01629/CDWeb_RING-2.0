import styled from 'styled-components'
import { lazy, Suspense, useState } from 'react'
import { KeyboardArrowRight, LabelOff, LocalShipping, Sell, ShoppingBasket } from '@mui/icons-material'
import { MobileExtendButton } from '../custom/GlobalComponents'
import { useGetCouponsQuery } from '../../features/coupons/couponsApiSlice'
import { Skeleton } from '@mui/material'

const Popover = lazy(() => import('@mui/material/Popover'));
const CouponItem = lazy(() => import('./CouponItem'));
const CouponDialog = lazy(() => import('./CouponDialog'));

//#region styled
const DetailTitle = styled.h4`
    margin: 10px 0;
    font-size: 16px;
    font-weight: 600;
    display: flex;
    align-items: center;

    ${props => props.theme.breakpoints.down("md")} {
        display: none;
    }
`

const CouponWrapper = styled.div`
    position: relative;
`

const CouponContainer = styled.div`
    position: relative;
    display: flex;
    height: 100%;
`

const Wrapper = styled.div`
    display: flex;
    padding: 5px 0;
    overflow-x: scroll;
    scroll-behavior: smooth;
    width: 100%;

    -ms-overflow-style: none;
    scrollbar-width: none; 

    &::-webkit-scrollbar {display: none;}

    ${props => props.theme.breakpoints.down("md")} {
        padding: 2px 0;
    }
`

const ItemsContainer = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
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

const MoreButton = styled.span`
    font-size: 15px;
    font-weight: 500;
    display: flex;
    align-items: end;
    color: ${props => props.disabled ? props.theme.palette.text.disabled : props.theme.palette.info.main};
    pointer-events: ${props => props.disabled ? 'none' : 'all'};
    cursor: pointer;
`

const CouponMessage = styled.span`
    display: flex;
    align-items: center;
    color: ${props => props.theme.palette.text.secondary};

    ${props => props.theme.breakpoints.down("md")} {
       font-size: 14px;
    }
`
//#endregion

const getCouponSumary = (type) => {
    switch (type) {
        case 'SHIPPING':
            return { name: 'Mã giảm phí vận chuyển', sumary: 'Áp dụng cho đơn hàng từ', color: 'primary', icon: <LocalShipping /> };
        case 'MIN_VALUE':
            return { name: 'Mã giảm', sumary: 'Áp dụng cho đơn hàng từ', color: 'error', icon: <Sell /> };
        case 'MIN_AMOUNT':
            return { name: 'Mã giảm', sumary: 'Áp dụng khi mua', color: 'warning', icon: <ShoppingBasket /> };
    }
}

const CouponPreview = ({ shopId }) => {
    const { data, isLoading, isSuccess, isError } = useGetCouponsQuery({ shop: shopId, size: 4 }, { skip: !shopId });
    const [anchorEl, setAnchorEl] = useState(null);
    const [contextCoupon, setContextCoupon] = useState(null);
    const [contextSumary, setContextSumary] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);

    const handlePopover = (e, coupon, sumary) => {
        setAnchorEl(e.currentTarget);
        setContextCoupon(coupon);
        setContextSumary(sumary);
    };
    const handleClose = () => {
        setAnchorEl(null);
        setContextCoupon(null);
        setContextSumary(null);
    };
    const handleOpenDialog = () => { setOpenDialog(true) }
    const handleCloseDialog = () => { setOpenDialog(false) }

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;
    let coupons;

    if (isLoading || isError) {
        coupons = (
            Array.from(new Array(3)).map((item, index) => (
                <Skeleton
                    key={`cate-${index}`}
                    variant="rectangular"
                    sx={{
                        mx: '3px',
                        borderRadius: '5px',
                        height: { xs: 22, md: 40 },
                        width: '30%'
                    }}
                />
            ))
        )
    } else if (isSuccess) {
        const { ids, entities } = data;

        coupons = false
            ? ids?.map((id, index) => {
                const coupon = entities[id];
                const couponSumary = getCouponSumary(coupon.detail.type);

                return (
                    <Coupon
                        key={`coupon-${id}-${index}`}
                        aria-owns={open ? 'mouse-over-popover' : undefined}
                        aria-haspopup="true"
                        onMouseEnter={(e) => handlePopover(e, coupon, couponSumary)}
                    >
                        <CouponIcon className={couponSumary.color}>{couponSumary.icon}</CouponIcon>
                        <CouponContent>
                            <CouponTitle>{`${couponSumary.name} ${coupon.detail.discount * 100}%`}</CouponTitle>
                        </CouponContent>
                    </Coupon>
                )
            })
            : <CouponMessage><LabelOff fontSize="small"/>&nbsp;Hiện Shop không có khuyến mãi</CouponMessage>
    }

    return (
        <CouponWrapper>
            <DetailTitle>
                Ưu đãi: &nbsp;
                <MoreButton onClick={handleOpenDialog}>Xem thêm<KeyboardArrowRight /></MoreButton>
            </DetailTitle>
            <CouponContainer onMouseLeave={handleClose}>
                <Wrapper draggable={true}>
                    <ItemsContainer>
                        {coupons}
                        <Suspense fallback={<></>}>
                            {open &&
                                <Popover
                                    id={id}
                                    open={open}
                                    anchorEl={anchorEl}
                                    onClose={handleClose}
                                    disableRestoreFocus
                                    disableScrollLock
                                    sx={{ pointerEvents: 'none' }}
                                    slotProps={{
                                        paper: {
                                            elevation: 0,
                                            sx: {
                                                overflow: 'visible',
                                                filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.32))',
                                                mt: .5,
                                                padding: 1,
                                                borderRadius: 0,
                                                pointerEvents: 'auto',
                                            },
                                            onMouseLeave: handleClose
                                        }
                                    }}
                                    anchorOrigin={{ vertical: 'bottom', horizontal: 'left', }}
                                >
                                    <CouponItem coupon={contextCoupon} sumary={contextSumary} />
                                </Popover>
                            }
                        </Suspense>
                    </ItemsContainer>
                </Wrapper>
                <MobileExtendButton onClick={handleOpenDialog}>
                    <KeyboardArrowRight fontSize="small" />
                </MobileExtendButton>
            </CouponContainer>
            <Suspense fallback={<></>}>
                {openDialog && <CouponDialog {...{ openDialog, handleCloseDialog, shopId }} />}
            </Suspense>
        </CouponWrapper >
    )
}

export default CouponPreview