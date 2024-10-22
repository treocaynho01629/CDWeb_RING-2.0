import { useState } from 'react';
import { Add, Close, Loyalty } from '@mui/icons-material'
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, useMediaQuery, Box, Skeleton } from '@mui/material'
import { useGetCouponsQuery } from '../../features/coupons/couponsApiSlice';
import { useTheme } from '@emotion/react';
import CouponItem from './CouponItem'
import styled from 'styled-components'
import { getCouponSumary } from '../../ultils/coupon';

//#region styled
const DetailTitle = styled.h4`
    margin: 10px 0;
    font-size: 17px;
    font-weight: 600;

    ${props => props.theme.breakpoints.down("md")} {
        margin: 5px 0 5px 10px;
    }
`
//#endregion

const CouponDialog = ({ selectMode, shopId, recommendState, openDialog, handleCloseDialog }) => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const [isSelect, setIsSelect] = useState(selectMode);

    //Fetch coupon
    const { data, isLoading, isSuccess, isError } = useGetCouponsQuery({
        shop: shopId,
        byShop: shopId != null,
        recommendState,
        size: 4
    },
        { skip: (!shopId && !isSelect) }
    );

    const toggleSelect = () => { setIsSelect(prev => !prev) }

    //Display contents
    let coupons = [];
    let shippingCoupons = [];
    let otherCoupons = [];
    let couponsContent;

    if (isLoading || isError) {
        couponsContent = (
            <>
                <Skeleton
                    variant="text"
                    sx={{ fontSize: '17px', margin: { xs: '5px 0 5px 10px', sm: '10px 0' } }}
                    width="30%"
                />
                <Skeleton
                    variant="rectangular"
                    width="100%"
                    sx={{ margin: '5px 0', borderRadius: '5px', height: { xs: 85, sm: 155 } }}
                />
                <Skeleton
                    variant="rectangular"
                    width="100%"
                    sx={{ margin: '5px 0', borderRadius: '5px', height: { xs: 85, sm: 155 } }}
                />
                <Skeleton
                    variant="rectangular"
                    width="100%"
                    sx={{ margin: '5px 0', borderRadius: '5px', height: { xs: 85, sm: 155 } }}
                />
            </>
        )
    } else if (isSuccess) {
        const { ids, entities } = data;

        if (ids?.length) {
            ids?.map((id, index) => {
                const coupon = entities[id];
                const type = coupon.detail.type;
                const couponSumary = getCouponSumary(type);

                if (type == 'SHIPPING') {
                    shippingCoupons.push(<CouponItem key={`coupon-${id}-${index}`} coupon={coupon} sumary={couponSumary} />)
                } else if (type == 'MIN_VALUE') {
                    coupons.push(<CouponItem key={`coupon-${id}-${index}`} coupon={coupon} sumary={couponSumary} />)
                } else {
                    otherCoupons.push(<CouponItem key={`coupon-${id}-${index}`} coupon={coupon} sumary={couponSumary} />)
                }
            })
        } else {
            coupons = shippingCoupons = otherCoupons = [];
        }

        couponsContent = (
            <>
                {shippingCoupons.length != 0 && <>
                    <DetailTitle>Mã vận chuyển</DetailTitle>
                    {shippingCoupons}
                </>
                }
                {coupons.length != 0 && <>
                    <DetailTitle>Mã giảm giá</DetailTitle>
                    {coupons}
                </>
                }
                {otherCoupons.length != 0 && <>
                    <DetailTitle>Mã khác</DetailTitle>
                    {otherCoupons}
                </>
                }
                {coupons.length == shippingCoupons.length == otherCoupons.length == 0 &&
                    <Box display="flex" alignItems="center" justifyContent="center">Hiện không có khuyến mãi</Box>
                }
            </>

        )
    }

    return (
        <Dialog open={openDialog} scroll={'paper'} maxWidth={'sm'} fullWidth onClose={handleCloseDialog} fullScreen={fullScreen}>
            <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}><Loyalty />&nbsp;Thông tin ưu đãi</DialogTitle>
            <DialogContent sx={{ padding: { xs: 1, sm: '20px 24px' }, paddingTop: 0 }}>
                {couponsContent}
            </DialogContent>
            <DialogActions>
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    sx={{ marginY: '10px' }}
                    startIcon={<Add />}
                >
                    Xem thêm
                </Button>
                <Button
                    variant="outlined"
                    color="error"
                    size="large"
                    sx={{ marginY: '10px' }}
                    onClick={handleCloseDialog}
                    startIcon={<Close />}
                >
                    Đóng
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default CouponDialog