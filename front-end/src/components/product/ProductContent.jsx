import styled from 'styled-components'
import { styled as muiStyled } from '@mui/system';
import { Star as StarIcon, StarBorder as StarBorderIcon } from '@mui/icons-material';
import { Skeleton, Rating, Box, Grid2 as Grid, alpha, Divider } from '@mui/material';
import { Link } from 'react-router-dom';
import { numFormatter } from '../../ultils/covert';
import ProductImages from './ProductImages';
import ProductAction from './ProductAction';

//#region styled
const StuffContainer = styled.div`
    border: 0.5px solid ${props => props.theme.palette.action.focus};
    padding: 20px 10px;

    ${props => props.theme.breakpoints.down("sm")} {
        padding: 10px 20px;
    }
`

const StuffTitle = styled.h5`
    margin: 0;
    text-decoration: underline;
    display: flex;

    ${props => props.theme.breakpoints.down("md")} {
        display: none;
    }
`

const SellerContainer = styled.div`
    display: flex; 
    justify-content: center;
    align-items: center;
    margin: 10px 0px;

    a {
        display: block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        
        @supports (-webkit-line-clamp: 1) {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: initial;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
        }
    }

    ${props => props.theme.breakpoints.down("sm")} {
        max-width: 150px;
    }
`

const VisitButton = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
    overflow: hidden;
    border: solid .5px ${props => props.theme.palette.primary.main};
    color: ${props => props.theme.palette.primary.main};
    padding: 7px 5px;
    cursor: pointer;
    transition: all .3s ease;

    &:hover {
        background-color: ${props => props.theme.palette.primary.main};
        color: ${props => props.theme.palette.primary.contrastText};
    }
`

const CouponTab = styled.div`
    background-color: ${props => props.theme.palette.action.focus};
    margin-top: 10px; 
    padding: 10px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    text-align: center;
    justify-content: center;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    transition: all .3s ease;

    &:hover{
        background-color: ${props => props.theme.palette.primary.main};
        color: ${props => props.theme.palette.primary.contrastText};
    }
`

const InfoContainer = styled.div`
    height: 100%;
    padding: 0 25px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border: 0.5px solid ${props => props.theme.palette.action.focus};

    a {color: ${props => props.theme.palette.info.main}};

    ${props => props.theme.breakpoints.down("md_lg")} {
        padding: 0 20px;
    }

    ${props => props.theme.breakpoints.down("sm")} {
        padding: 0 10px;
        border-top: none;
    }
`

const BookTitle = styled.h2`
    font-size: 22px;
    line-height: normal;
    margin-top: 30px;
    margin-bottom: 0;
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

    ${props => props.theme.breakpoints.down("sm")} {
        font-size: 16px;
        margin-top: 0;
    }
`

const Detail = styled.h3`
    font-size: 15px;
    margin: 5px 0px;
    display: flex;
    align-items: center;

    ${props => props.theme.breakpoints.down("sm")} {
        margin: 3px 0;
    }
`

const Description = styled.p`
    margin-top: 10px;
    margin-bottom: 0px;
    font-size: 14px;
    text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
	
	@supports (-webkit-line-clamp: 5) {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: initial;
      display: -webkit-box;
      -webkit-line-clamp: 5;
      -webkit-box-orient: vertical;
    }
`

const UserInfoContainer = styled.div`
    display: flex;
    align-items: center;
    color: ${props => props.theme.palette.warning.light};
    cursor: pointer;

    ${props => props.theme.breakpoints.down("sm")} {
        display: none;
    }
`

const StyledRating = muiStyled(Rating)(({ theme }) => ({
    color: theme.palette.warning.main,
    fontSize: 18,
    '& .MuiRating-iconFilled': {
        color: theme.palette.warning.light,
    },
}));

const UserInfoText = styled.strong`
    color: ${props => props.theme.palette.text.primary};

    &.rate {
        margin-left: 5px;
        color: inherit;
    }

    &.mobile {
        display: none;

        ${props => props.theme.breakpoints.down("sm")} {
            display: block;
        }
    }
`

const PriceContainer = styled.div`
    display: flex;
    align-items: center;
    margin: 15px 0;

    ${props => props.theme.breakpoints.down("sm")} {
       margin: 0;
    }
`

const Price = styled.h2`
    margin: 0;
    font-size: 24px;
    color: ${props => props.theme.palette.primary.main};

    ${props => props.theme.breakpoints.down("sm")} {
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

    ${props => props.theme.breakpoints.down("sm")} {
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

    ${props => props.theme.breakpoints.down("sm")} {
        font-size: 13px;
    }
`

const DetailContainer = styled.div`
    display: block;

    ${props => props.theme.breakpoints.down("sm")} {
        display: none;
    }
`

const DetailTitle = styled.span`
    font-size: 16px;
    font-weight: 600;
`
//#endregion

const ProductContent = ({ book, handleTabChange }) => {
    const handleChangeTab = (e, tab) => {
        e.preventDefault();
        if (handleTabChange) handleTabChange(tab);
    };

    return (
        <>
            {/* <Grid container size="grow" spacing={{ xs: .5, sm: 2 }}> */}
            <Grid
                container
                size="grow"
                spacing={{ xs: .5, md: 1, lg: 2 }}
                position="relative"
            >
                <Grid size={{ xs: 12, md: 5.8, lg: 5 }} position="relative">
                    {!book ? <ProductImages />
                        : <ProductImages book={book} />}
                </Grid>
                <Grid size={{ xs: 12, md: 6.2, lg: 7 }}>
                    <InfoContainer>
                        {book ? <BookTitle>{book?.title}</BookTitle>
                            : <>
                                <Skeleton variant="text" sx={{ fontSize: '22px', marginTop: '30px' }} />
                                <Skeleton variant="text" sx={{ fontSize: '22px' }} width="30%" />
                            </>}
                        <Detail>
                            Nhà xuất bản: &nbsp;
                            {book ? <Link to={`/filters?pubId=${book?.publisher?.id}`}>{book?.publisher?.pubName}</Link>
                                : <Skeleton variant="text" sx={{ fontSize: '15px' }} width="50%" />}
                        </Detail>
                        <UserInfoContainer onClick={(e) => handleChangeTab(e, "reviews")}>
                            <StyledRating
                                name="product-rating"
                                value={book?.rating ?? 0}
                                getLabelText={(value) => `${value} star${value !== 1 ? 's' : ''}`}
                                precision={0.5}
                                icon={<StarIcon fontSize="18" />}
                                emptyIcon={<StarBorderIcon fontSize="18" />}
                                readOnly
                            />
                            <UserInfoText className="rate">
                                {book?.rateTime > 0 ?
                                    `(${numFormatter(book?.rateTime)}) Đánh giá`
                                    : 'Chưa có đánh giá'}
                            </UserInfoText>
                            <Divider orientation="vertical" sx={{ mx: 1 }} />
                            <UserInfoText>Đã bán: {numFormatter(book?.orderTime)}</UserInfoText>
                        </UserInfoContainer>
                        <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
                            <PriceContainer>
                                {book ?
                                    <>
                                        <Price>{Math.round(book.price * (1 - book.onSale)).toLocaleString()}đ</Price>
                                        {book?.onSale > 0
                                            &&
                                            <>
                                                <Discount>{book.price.toLocaleString()}đ</Discount>
                                                <Percentage>-{book.onSale * 100}%</Percentage>
                                            </>
                                        }
                                    </>
                                    :
                                    <>
                                        <Skeleton variant="text" sx={{ fontSize: '24px', marginY: '20px' }} width={105} />&nbsp;
                                        <Skeleton variant="text" sx={{ fontSize: '18px', marginY: '20px' }} width={90} />
                                        <Skeleton variant="rectangular" sx={{ marginLeft: 1 }} width={45} />
                                    </>
                                }
                            </PriceContainer>
                            <UserInfoText className="mobile">Đã bán: {numFormatter(book?.orderTime)}</UserInfoText>
                        </Box>
                        <DetailContainer>
                            <DetailTitle>Chi tiết:</DetailTitle>
                            <Detail>
                                Tác giả: &nbsp;
                                {book ? <Link to={`/filters?keyword=${book?.author}`}>{book?.author}</Link>
                                    : <Skeleton variant="text" sx={{ fontSize: '15px' }} width="40%" />}
                            </Detail>
                            <Detail>
                                Hình thức bìa: &nbsp;
                                {book ? <Link to={`/filters?type=${book?.type}`}> {book?.type}</Link>
                                    : <Skeleton variant="text" sx={{ fontSize: '15px' }} width="30%" />}
                            </Detail>
                            <br />
                            <DetailTitle>Mô tả sản phẩm:</DetailTitle>
                            <Description>
                                {book ? book?.description
                                    : <>
                                        <Skeleton variant="text" sx={{ fontSize: '14px' }} />
                                        <Skeleton variant="text" sx={{ fontSize: '14px' }} />
                                        <Skeleton variant="text" sx={{ fontSize: '14px' }} />
                                    </>}
                            </Description>
                            <Detail>
                                <Link onClick={(e) => handleChangeTab(e, "detail")}>Xem thêm...</Link>
                            </Detail>
                        </DetailContainer>
                        <ProductAction book={book} />
                    </InfoContainer>
                </Grid>
            </Grid>
            {/* <Grid container spacing={2} size={{ xs: 12, lg: 2 }} direction={{ xs: 'row', lg: 'column' }}>
                    <Grid size={{ xs: 12, md: "auto", lg: 12 }}>
                        <StuffContainer>
                            <Box display={{ xs: 'flex', md: 'block' }}>
                                <StuffTitle>
                                    <StorefrontIcon />&nbsp;NHÀ PHÂN PHỐI:
                                </StuffTitle>
                                {!book
                                    ?
                                    <Box
                                        display={'flex'}
                                        alignItems={'center'}
                                        justifyContent={'space-between'}
                                        flexDirection={{ sm: 'row', md: 'column' }}
                                        width={'100%'}
                                    >
                                        <SellerContainer>
                                            <Avatar>H</Avatar>&nbsp;
                                            <Skeleton variant="text" sx={{ fontSize: '16px' }} width={100} />
                                            &nbsp;&nbsp;&nbsp;
                                        </SellerContainer>
                                        <VisitButton>ĐỐI TÁC RING!&nbsp;<CheckIcon /></VisitButton>
                                    </Box>
                                    :
                                    <Box
                                        display={'flex'}
                                        alignItems={'center'}
                                        justifyContent={'space-between'}
                                        flexDirection={{ sm: 'row', md: 'column' }}
                                        width={'100%'}
                                    >
                                        <SellerContainer>
                                            <Avatar>{book?.sellerName?.charAt(0) ?? ''}</Avatar>
                                            <Link to={`/filters?seller=${book?.sellerName}`}>
                                                &nbsp;{book?.sellerName}
                                            </Link>
                                            &nbsp;&nbsp;&nbsp;
                                        </SellerContainer>
                                        <Link to={`/filters?seller=${book?.sellerName}`}>
                                            <VisitButton>ĐỐI TÁC RING!&nbsp;<CheckIcon /></VisitButton>
                                        </Link>
                                    </Box>
                                }
                            </Box>
                        </StuffContainer>
                    </Grid>
                    <Grid size={{ xs: 12, md: "grow", lg: 12 }} display={{ xs: 'none', md: 'block' }}>
                        <StuffContainer>
                            <StuffTitle><SellIcon />&nbsp;KHUYẾN MÃI</StuffTitle>
                            {!book
                                ?
                                <>
                                    <Skeleton variant="rectangular" width={'100%'} height={44} sx={{ marginTop: '10px' }} />
                                    <Skeleton variant="rectangular" width={'100%'} height={44} sx={{ marginTop: '10px' }} />
                                    <Skeleton variant="rectangular" width={'100%'} height={44} sx={{ marginTop: '10px' }} />
                                </>
                                :
                                <>
                                    <CouponTab><SellIcon />&nbsp; MÃ: ABCDFE39</CouponTab>
                                    <CouponTab><SellIcon />&nbsp; MÃ: DFCR4546</CouponTab>
                                    <CouponTab><SellIcon />&nbsp; MÃ: TRBB1234</CouponTab>
                                </>
                            }
                        </StuffContainer>
                    </Grid>
                </Grid>
            </Grid > */}
        </>
    )
}

export default ProductContent