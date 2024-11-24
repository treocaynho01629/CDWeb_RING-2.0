import styled from '@emotion/styled'
import { styled as muiStyled } from '@mui/material';
import { Star as StarIcon, StarBorder as StarBorderIcon } from '@mui/icons-material';
import { Skeleton, Rating, Box, Grid2 as Grid, alpha, Divider, Stack } from '@mui/material';
import { Link } from 'react-router-dom';
import { numFormatter } from '../../../ultils/covert';
import { lazy, Suspense, useState } from 'react';
import { useGetMyAddressQuery } from '../../../features/addresses/addressesApiSlice';
import ProductImages from './ProductImages';
import ProductAction from './ProductAction';

const CouponPreview = lazy(() => import('../../coupon/CouponPreview'));
const AddressPreview = lazy(() => import('../../address/AddressPreview'));
const AddressSelectDialog = lazy(() => import('../../address/AddressSelectDialog'));
const ProductPolicies = lazy(() => import('./ProductPolicies'));

//#region styled
const InfoContainer = styled.div`
    height: 100%;
    padding: ${props => props.theme.spacing(2.5)};
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border: 0.5px solid ${props => props.theme.palette.divider};

    a {color: ${props => props.theme.palette.info.main}};

    ${props => props.theme.breakpoints.down("md")} {
        padding: 0 ${props => props.theme.spacing(1.5)};
        padding-bottom: ${props => props.theme.spacing(1)};
        border-top: none;
    }
`

const BookTitle = styled.h2`
    font-size: 22px;
    line-height: normal;
    margin: 0 0 20px 0;
    text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
	
	@supports (-webkit-line-clamp: 2) {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: initial;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    ${props => props.theme.breakpoints.down("md")} {
        font-size: 16px;
        margin: 10px 0;
    }
`

const Detail = styled.span`
    font-size: 14px;
    font-weight: bold;
    display: flex;
    align-items: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-right: 10px;
    flex-grow: 1;

    ${props => props.theme.breakpoints.down("md")} {
        margin: 3px 0;
    }
`

const UserInfoContainer = styled.div`
    display: flex;
    position: relative;
    height: 100%;
    align-items: center;
    color: ${props => props.theme.palette.text.secondary};
    cursor: pointer;

    &.active {
        color: ${props => props.theme.palette.warning.light};
    }
`

const StyledRating = muiStyled(Rating)(({ theme }) => ({
    color: theme.palette.warning.main,
    fontSize: 18,
    '& .MuiRating-iconFilled': {
        color: theme.palette.warning.light,
    },

    [theme.breakpoints.down("md_lg")]: {
        display: 'none',
    }
}));

const UserInfoText = styled.strong`
    color: ${props => props.theme.palette.text.primary};
    font-size: 15px;

    &.rate { color: inherit}

    &.end {
        flex: 1;
        text-align: end;
        color: ${props => props.theme.palette.text.secondary};
    }

    ${props => props.theme.breakpoints.down("md")} {
        font-size: 14px;
        &.hide-on-mobile {display: none}
    }

    ${props => props.theme.breakpoints.up("md")} {
        &.mobile {display: none}
    }
`

const PriceContainer = styled.div`
    display: flex;
    align-items: center;
    margin: 5px 0;

    ${props => props.theme.breakpoints.down("md")} {
       margin: 0;
    }
`

const Price = styled.h2`
    margin: 0;
    font-size: 24px;
    color: ${props => props.theme.palette.primary.main};

    ${props => props.theme.breakpoints.down("md")} {
        font-size: 21px;
    }
`

const Discount = styled.p`
    margin: 0;
    margin-left: 10px;
    font-size: 18px;
    font-weight: 400;
    color: ${props => props.theme.palette.text.secondary};
    text-decoration: line-through;

    ${props => props.theme.breakpoints.down("md")} {
        font-size: 16px;
        margin-left: 5px;
    }
`

const Percentage = styled.span`
    font-size: 14px;
    padding: 2px 5px;
    margin-left: 10px;
    font-weight: bold;
    color: ${props => props.theme.palette.primary.contrastText};
    background-color: ${props => alpha(props.theme.palette.primary.light, 0.8)};

    ${props => props.theme.breakpoints.down("md")} {
        font-size: 13px;
    }
`

const couponPlaceholder = (
    <>
        <Skeleton variant="text" sx={{ fontSize: '20px', margin: '10px 0', display: { xs: 'none', md: 'block' } }} width={150} />
        <Box display="flex">
            <Skeleton
                variant="rectangular"
                sx={{
                    mr: '3px',
                    borderRadius: '5px',
                    height: { xs: 22, md: 40 },
                    width: '30%'
                }}
            />
            <Skeleton
                variant="rectangular"
                sx={{
                    mx: '3px',
                    borderRadius: '5px',
                    height: { xs: 22, md: 40 },
                    width: '30%'
                }}
            />
            <Skeleton
                variant="rectangular"
                sx={{
                    mx: '3px',
                    borderRadius: '5px',
                    height: { xs: 22, md: 40 },
                    width: '30%'
                }}
            />
        </Box>
    </>
)

const addressPlaceholder = (
    <Box my={{ xs: -0.5, md: 2 }}>
        <Skeleton variant="text" sx={{ fontSize: '20px', margin: { xs: 0, md: '10px 0' }, width: { xs: "100%", md: 150 } }} />
        <Skeleton variant="text" sx={{ fontSize: '16px', display: { xs: 'none', md: 'block' } }} width="80%" />
        <Skeleton variant="text" sx={{ fontSize: '16px', display: { xs: 'none', md: 'block' } }} width="45%" />
    </Box>
)

const policiesPlaceholder = (
    <Box display="flex" flexDirection={{ xs: 'row', md: 'column' }}>
        <Skeleton variant="text" sx={{ fontSize: '20px', margin: '10px 0', display: { xs: 'none', md: 'block' } }} width={150} />
        <Skeleton variant="text" sx={{ fontSize: '14px', marginRight: '10px' }} width="40%" />
        <Skeleton variant="text" sx={{ fontSize: '14px', marginRight: '10px' }} width="40%" />
        <Skeleton variant="text" sx={{ fontSize: '14px', marginRight: '10px' }} width="40%" />
    </Box>
)
//#endregion

const ProductContent = ({ book, handleToggleReview, pending, setPending }) => {
    const [addressInfo, setAddressInfo] = useState({
        name: '',
        phone: '',
        city: '',
        address: ''
    })
    const [openDialog, setOpenDialog] = useState(false);

    //Fetch address
    const { data: address, isLoading: loadAddress } = useGetMyAddressQuery();

    const handleViewReview = (value) => { if (handleToggleReview) handleToggleReview(value) };
    const handleOpenDialog = () => { setOpenDialog(true) }
    const handleCloseDialog = () => { setOpenDialog(false) }

    return (
        <Grid
            container
            size="grow"
            spacing={{ xs: 0, md: 1, lg: 2 }}
            position="relative"
        >
            <Grid size={{ xs: 12, md: 5.5, lg: 5 }} position="relative">
                {!book ? <ProductImages />
                    : <ProductImages book={book} />}
            </Grid>
            <Grid size={{ xs: 12, md: 6.5, lg: 7 }}>
                <InfoContainer>
                    <Box
                        className="product-main"
                        display="flex"
                        flexDirection={{ xs: 'column-reverse', md: 'column' }}
                    >
                        <Box className="product-title">
                            {book ? <BookTitle>{book?.title}</BookTitle>
                                :
                                <Box sx={{ margin: { xs: '10px 0', md: '0 0 20px' } }}>
                                    <Skeleton variant="text" sx={{ fontSize: { xs: '16px', md: '22px' } }} />
                                    <Skeleton variant="text" sx={{ fontSize: { xs: '16px', md: '22px' } }} width="30%" />
                                </Box>}
                            <Stack className="info"
                                direction="row"
                                useFlexGap
                                sx={{ flexWrap: 'wrap', mb: 1, display: { xs: 'none', md: 'flex' } }}
                            >
                                <Box display="flex" justifyContent="space-between" width="100%">
                                    <Detail>
                                        {book ? <>Nhà xuất bản:&nbsp;<Link to={`/store?pubs=${book?.publisher?.id}`}>{book?.publisher?.pubName}</Link></>
                                            : <Skeleton variant="text" sx={{ fontSize: '14px' }} width="90%" />}
                                    </Detail>
                                    <Detail>

                                        {book ? <>Tác giả: &nbsp;<Link to={`/store?q=${book?.author}`}>{book?.author}</Link></>
                                            : <Skeleton variant="text" sx={{ fontSize: '14px' }} width="90%" />}
                                    </Detail>
                                </Box>
                                <Detail>
                                    {book ? <>Hình thức bìa: &nbsp;<Link to={`/store?types=${book?.type}`}> {book?.type}</Link></>
                                        : <Skeleton variant="text" sx={{ fontSize: '14px' }} width="90%" />}
                                </Detail>
                            </Stack>
                            <Stack className="user-info"
                                direction="row"
                                useFlexGap
                                sx={{ flexWrap: 'wrap' }}
                            >
                                {book ?
                                    <>
                                        <UserInfoContainer
                                            className={book?.reviewsInfo?.rating > 0 ? 'active' : ''}
                                            onClick={() => handleViewReview(true)}
                                        >
                                            {(book?.reviewsInfo?.rating ?? 0).toFixed(1)}&nbsp;
                                            <StyledRating
                                                name="product-rating"
                                                value={book?.reviewsInfo?.rating ?? 0}
                                                getLabelText={(value) => `${value} star${value !== 1 ? 's' : ''}`}
                                                precision={0.5}
                                                icon={<StarIcon fontSize="18" />}
                                                emptyIcon={<StarBorderIcon fontSize="18" />}
                                                readOnly
                                            />
                                            {book?.reviewsInfo?.rating > 0
                                                ? <StarIcon fontSize="18" sx={{ display: { xs: 'block', md_lg: 'none' } }} />
                                                : <StarBorderIcon fontSize="18" sx={{ display: { xs: 'block', md_lg: 'none' } }} />
                                            }
                                            <Divider orientation="vertical" sx={{ mx: { xs: 0.7, md: 1 } }} flexItem />
                                            <UserInfoText className="rate">
                                                {book?.reviewsInfo?.count[0] > 0 ?
                                                    `(${numFormatter(book?.reviewsInfo?.count[0])}) Đánh giá`
                                                    : 'Chưa có đánh giá'}
                                            </UserInfoText>
                                        </UserInfoContainer>
                                        <Divider orientation="vertical" sx={{ mx: 1, display: { xs: 'none', md: 'block' } }} flexItem />
                                        <UserInfoText className="hide-on-mobile">Đã bán: {numFormatter(book?.totalOrders)}</UserInfoText>
                                        <UserInfoText className="end">Tố cáo</UserInfoText>
                                    </>
                                    :
                                    <Box display="flex" justifyContent="space-between" width="100%">
                                        <Skeleton variant="text" sx={{ fontSize: '16px', width: { xs: '40%', md: '70%' } }} />
                                        <Skeleton variant="text" sx={{ fontSize: '16px' }} width="20%" />
                                    </Box>}
                            </Stack>
                        </Box>
                        <Box className="product-price">
                            <PriceContainer>
                                {book ?
                                    <>
                                        <Price>{Math.round(book.price * (1 - book.discount)).toLocaleString()}đ</Price>
                                        {book?.discount > 0
                                            &&
                                            <>
                                                <Discount>{book.price.toLocaleString()}đ</Discount>
                                                <Percentage>-{book.discount * 100}%</Percentage>
                                            </>
                                        }
                                        <UserInfoText className="end mobile">Đã bán: {numFormatter(book?.totalOrders)}</UserInfoText>
                                    </>
                                    :
                                    <Box display="flex" width="100%" justifyContent="space-between" sx={{ marginBottom: { xs: '5px', md: 0 } }}>
                                        <Skeleton variant="text" sx={{ fontSize: '21px' }} width={200} />
                                        <Skeleton variant="text" sx={{ fontSize: '14px', display: { xs: 'block', md: 'none' } }} width={60} />
                                    </Box>
                                }
                            </PriceContainer>
                            <Divider sx={{ my: 1, display: { xs: 'none', md: 'block' } }} />
                            {book ?
                                <Suspense fallback={couponPlaceholder}>
                                    {book && <CouponPreview shopId={book?.shopId} />}
                                </Suspense>
                                : couponPlaceholder
                            }
                        </Box>
                    </Box>
                    <Box className="product-address">
                        <Divider sx={{ my: 1, display: { xs: 'block', md: 'none' } }} />
                        {book ?
                            <Suspense fallback={addressPlaceholder}>
                                {book &&
                                    <>
                                        <AddressPreview {...{ addressInfo, handleOpen: handleOpenDialog, loadAddress }} />
                                        <AddressSelectDialog {...{ address, pending, setPending, setAddressInfo, openDialog, handleCloseDialog }} />
                                    </>
                                }
                            </Suspense>
                            : addressPlaceholder
                        }
                    </Box>
                    <Box className="product-action" display="flex" flexDirection="column">
                        <ProductAction book={book} />
                        <Divider sx={{ my: 1 }} />
                        {book ?
                            <Suspense fallback={policiesPlaceholder}>
                                {book && <ProductPolicies />}
                            </Suspense>
                            : policiesPlaceholder
                        }
                    </Box>
                </InfoContainer>
            </Grid>
        </Grid>
    )
}

export default ProductContent