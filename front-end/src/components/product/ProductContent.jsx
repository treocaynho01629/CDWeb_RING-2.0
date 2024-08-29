import styled from 'styled-components'
import { styled as muiStyled } from '@mui/system';
import { useState } from 'react';
import {
    Remove as RemoveIcon, Add as AddIcon, Star as StarIcon, StarBorder as StarBorderIcon,
    ShoppingCart as ShoppingCartIcon, Sell as SellIcon, Storefront as StorefrontIcon, Check as CheckIcon
} from '@mui/icons-material';
import { Skeleton, Button, Rating, Box, Divider, Grid2 as Grid, Avatar, Drawer, useTheme, useMediaQuery } from '@mui/material';
import { Link } from 'react-router-dom';
import ProductImages from './ProductImages';
import useCart from '../../hooks/useCart';

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
    padding: 0 40px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border: 0.5px solid ${props => props.theme.palette.action.focus};

    ${props => props.theme.breakpoints.down("sm")} {
        padding: 0 10px;
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
`

const Detail = styled.h3`
    font-size: 15px;
    margin: 5px 0px;
    display: flex;
    align-items: center;
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

const TotalRatingContainer = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;

    ${props => props.theme.breakpoints.down("sm")} {
        display: none;
    }
`

const StyledRating = muiStyled(Rating)(({ theme }) => ({
    color: theme.palette.primary.main,
    fontSize: 18,
    '& .MuiRating-iconFilled': {
        color: theme.palette.primary.main,
    },
    '& .MuiRating-iconHover': {
        color: theme.palette.primary.light,
    },
}));

const PriceContainer = styled.div`
    display: flex;
    align-items: center;
`

const Price = styled.h2`
    font-size: 24px;

    ${props => props.theme.breakpoints.down("sm")} {
       margin: 0;
    }
`

const OldPrice = styled.p`
    margin-left: 20px;
    font-size: 18px;
    font-weight: 300;
    color: gray;
    text-decoration: line-through;
`

const FilterContainer = styled.div`
    margin: 30px 0px;
    width: 100%;
    display: block;
    
    ${props => props.theme.breakpoints.down("sm")} {
        display: none;
    }
`

const AltFilterContainer = styled.div`
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 50px;
    z-index: 99;
    box-shadow: 3px 3px 10px 3px #b7b7b7;
    background-color: ${props => props.theme.palette.primary.main};
    align-items: flex-end;
    display: none;

    ${props => props.theme.breakpoints.down("sm")} {
        display: flex;
    }
`

const Filter = styled.div`
    align-items: center;
    margin-bottom: 30px;
    display: block;

    ${props => props.theme.breakpoints.down("sm")} {
        display: none;
    }
`

const SubFilterContainer = styled.div`
    display: flex;
    align-items: center;
    margin: 6px 0px;
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

const InputContainer = styled.div`
    align-items: center;
    justify-content: space-between;
    align-items: center;
    background-color: ${props => props.theme.palette.background.default};
    
    ${props => props.theme.breakpoints.up("sm")} {
        border: .5px solid ${props => props.theme.palette.action.focus};
    }
`

const CartButton = styled.button`
    height: 50px;
    width: 80px;
    border-radius: 0;
    padding: 15px;
    margin-top: -15px;
    border: none;
    outline: none;
    background-color: #272727;
    color: white;
    font-size: 14px;
    justify-content: center;
    font-weight: bold;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    text-align: center;
    justify-content: center;
    transition: all 0.5s ease;

    &:hover {
        background-color: ${props => props.theme.palette.action.hover};
        color: gray;
    };

    &:focus {
        border: none;
        outline: none;
    }
`

const AmountInput = styled.input`
    padding: 0;
    font-weight: bold;
    resize: none;
    outline: none;
    border: none;
    text-align: center;
    width: 30px;
    height: 30px;
    background: transparent;
    color: ${props => props.theme.palette.text.primary};

    &::-webkit-outer-spin-button,
    ::-webkit-inner-spin-button {
        -webkit-appearance: none;
    }
`

const AltAmountInput = styled.input`
    height: 48px;
    width: 80px;
    padding: 0;
    background: #585858;
    color: white;
    font-weight: bold;
    outline: none;
    border: none;
    text-align: center;
    font-size: 1.2em;
`

const AmountButton = styled.div`
    width: 34px;
    height: 34px;
    background-color: ${props => props.theme.palette.action.focus};
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    opacity: 0.75;
    transition: all 0.5s ease;

    &:hover{
        background-color: ${props => props.theme.palette.primary.main};
        color: ${props => props.theme.palette.primary.contrastText};
    }
`

const BuyButton = styled.button`
    width: 90%;
    height: 50px;
    border-radius: 0;
    padding: 15px;
    margin-top: -15px;
    border: none;
    outline: none;
    background-color: ${props => props.theme.palette.primary.main};
    color: ${props => props.theme.palette.primary.contrastText};
    font-size: 14px;
    justify-content: center;
    font-weight: bold;
    display: flex;
    flex-wrap: wrap;
    white-space: nowrap;
    overflow: hidden;
    align-items: center;
    text-align: center;
    justify-content: center;
    transition: all 0.5s ease;

    ${props => props.theme.breakpoints.down("sm")} {
        width: 100%;
    }

    &:hover {
        background-color: ${props => props.theme.palette.action.hover};
        color: gray;
    };

    &:disabled {
        background-color: gray;
        color: darkslategray;
    }

    &:focus {
        border: none;
        outline: none;
    }
`
//#endregion

const ProductContent = ({ book, handleTabChange }) => {
    const theme = useTheme();
    const mobileMode = useMediaQuery(theme.breakpoints.down('sm'));
    const [amountIndex, setAmountIndex] = useState(1); //Amount add to cart
    const [open, setOpen] = useState(false);
    const { addProduct } = useCart();

    //Calculate rating
    const avgRate = () => {
        let rate = 0;
        rate = Math.round((book?.rateTotal / book?.rateAmount) * 2) / 2;
        rate = rate ? rate : '~';
        return rate;
    }
    const calculatedRate = avgRate();

    //Change add amount
    const changeAmount = (n) => {
        setAmountIndex(prev => (prev + n < 1 ? 1 : prev + n));
    }

    const handleChangeAmount = (value) => {
        let newValue = value;
        if (newValue < 1) newValue = 1;
        setAmountIndex(newValue);
    }

    const handleChangeTab = (e, tab) => {
        e.preventDefault();
        if (handleTabChange) handleTabChange(tab);
    };

    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };

    //Add to cart
    const handleAddToCart = (book) => {
        setOpen(false); //Close drawer
        addProduct({
            id: book.id,
            title: book.title,
            price: book.price,
            image: book.image,
            quantity: amountIndex,
        })
    };

    return (
        <Grid container size="grow" spacing={{ xs: .5, sm: 2 }}>
            <Grid
                container
                size={{ xs: 12, lg: 10 }}
                spacing={{ xs: .5, sm: 2 }}
                justifyContent="flex-start"
                alignItems="stretch"
            >
                <Grid size={{ xs: 12, md: 6 }}>
                    {!book
                        ?
                        <ProductImages />
                        :
                        <ProductImages images={book?.image} />
                    }
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <InfoContainer>
                        {!book
                            ?
                            <div>
                                <Skeleton variant="text" sx={{ fontSize: '22px', marginTop: '30px' }} />
                                <Skeleton variant="text" sx={{ fontSize: '22px' }} width="30%" />
                                <Detail>
                                    Nhà xuất bản: &nbsp;
                                    <Skeleton variant="text" sx={{ fontSize: '15px' }} width="50%" />
                                </Detail>
                                <TotalRatingContainer>
                                    <StyledRating
                                        name="product-rating"
                                        value={0}
                                        getLabelText={(value) => `${value} Heart${value !== 1 ? 's' : ''}`}
                                        precision={0.5}
                                        icon={<StarIcon fontSize="18" />}
                                        emptyIcon={<StarBorderIcon fontSize="18" />}
                                        readOnly
                                    />
                                    <strong style={{ paddingLeft: 10 }}>(~) Đánh giá</strong>
                                </TotalRatingContainer>
                                <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
                                    <PriceContainer>
                                        <Skeleton variant="text" sx={{ fontSize: '24px', marginY: '20px' }} width={105} />&nbsp;
                                        <Skeleton variant="text" sx={{ fontSize: '18px', marginY: '20px' }} width={90} />
                                    </PriceContainer>
                                    <Box display={{ xs: 'flex', sm: 'none' }} alignItems={'center'} justifyContent={'space-between'}>
                                        <strong style={{ paddingRight: 10 }}>(~) Đánh giá</strong>
                                        <StarIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                                    </Box>
                                </Box>
                                <DetailContainer>
                                    <DetailTitle>Chi tiết:</DetailTitle>
                                    <Detail>
                                        Tác giả: &nbsp;
                                        <Skeleton variant="text" sx={{ fontSize: '15px' }} width="40%" />
                                    </Detail>
                                    <Detail>
                                        Hình thức bìa: &nbsp;
                                        <Skeleton variant="text" sx={{ fontSize: '15px' }} width="30%" />
                                    </Detail>
                                    <br />
                                    <DetailTitle>Mô tả sản phẩm:</DetailTitle>
                                    <Description>
                                        <Skeleton variant="text" sx={{ fontSize: '14px' }} />
                                        <Skeleton variant="text" sx={{ fontSize: '14px' }} />
                                        <Skeleton variant="text" sx={{ fontSize: '14px' }} />
                                    </Description>
                                    <Detail>
                                        <Link onClick={(e) => handleChangeTab(e, "detail")}>Xem thêm...</Link>
                                    </Detail>
                                </DetailContainer>
                            </div>
                            :
                            <>
                                <BookTitle>{book?.title}</BookTitle>
                                <Detail>
                                    Nhà xuất bản: &nbsp;
                                    <Link to={`/filters?pubId=${book?.publisher?.id}`}>
                                        {book?.publisher?.pubName}
                                    </Link>
                                </Detail>
                                <TotalRatingContainer onClick={(e) => handleChangeTab(e, "reviews")}>
                                    <StyledRating
                                        name="product-rating"
                                        value={isNaN(calculatedRate) ? 0 : calculatedRate}
                                        getLabelText={(value) => `${value} Heart${value !== 1 ? 's' : ''}`}
                                        precision={0.5}
                                        icon={<StarIcon fontSize="18" />}
                                        emptyIcon={<StarBorderIcon fontSize="18" />}
                                        readOnly
                                    />
                                    <strong style={{ paddingLeft: 10 }}>({book?.rateAmount}) Đánh giá</strong>
                                </TotalRatingContainer>
                                <Box onClick={(e) => handleChangeTab(e, "reviews")} sx={{ curosr: 'pointer' }}
                                    display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
                                    <PriceContainer>
                                        <Price>{book?.price?.toLocaleString()}đ</Price>
                                        <OldPrice>{Math.round(book?.price * 1.1).toLocaleString()}đ</OldPrice>
                                    </PriceContainer>
                                    <Box display={{ xs: 'flex', sm: 'none' }} alignItems={'center'} justifyContent={'space-between'}>
                                        <strong style={{ paddingRight: 10 }}>({calculatedRate}) Đánh giá</strong>
                                        <StarIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                                    </Box>
                                </Box>
                                <DetailContainer>
                                    <DetailTitle>Chi tiết:</DetailTitle>
                                    <Detail>
                                        Tác giả: &nbsp;
                                        <Link to={`/filters?keyword=${book?.author}`}>
                                            {book?.author}
                                        </Link>
                                    </Detail>
                                    <Detail>
                                        Hình thức bìa: &nbsp;
                                        <Link to={`/filters?type=${book?.type}`}>
                                            {book?.type}
                                        </Link>
                                    </Detail>
                                    <br />
                                    <DetailTitle>Mô tả sản phẩm:</DetailTitle>
                                    <Description>
                                        {book?.description}
                                    </Description>
                                    <Detail>
                                        <Link onClick={(e) => handleChangeTab(e, "detail")}>Xem thêm...</Link>
                                    </Detail>
                                </DetailContainer>
                            </>
                        }
                        {mobileMode ?
                            <>
                                <AltFilterContainer>
                                    <Link to={`/cart`}>
                                        <CartButton><ShoppingCartIcon style={{ fontSize: 24 }} /></CartButton>
                                    </Link>
                                    <BuyButton disabled={!book} onClick={toggleDrawer(true)}>
                                        THÊM VÀO GIỎ ({(book?.price * amountIndex).toLocaleString()}đ)
                                    </BuyButton>
                                </AltFilterContainer>
                                <Drawer
                                    anchor={'bottom'}
                                    open={open}
                                    onClose={toggleDrawer(false)}
                                >
                                    <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'} padding={'0 10px'}>
                                        <DetailTitle>Số lượng:</DetailTitle>
                                        <SubFilterContainer>
                                            <AmountButton direction="add" onClick={() => changeAmount(-1)}>
                                                <RemoveIcon style={{ fontSize: 12 }} />
                                            </AmountButton>
                                            <InputContainer>
                                                <AmountInput type="number" onChange={(e) => handleChangeAmount(e.target.valueAsNumber)} value={amountIndex} />
                                            </InputContainer>
                                            <AmountButton direction="remove" onClick={() => changeAmount(1)}>
                                                <AddIcon style={{ fontSize: 12 }} />
                                            </AmountButton>
                                        </SubFilterContainer>
                                    </Box>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        size="large"
                                        sx={{ margin: '5px' }}
                                        onClick={() => handleAddToCart(book)}
                                    >
                                        THÊM VÀO GIỎ ({(book?.price * amountIndex).toLocaleString()}đ)
                                    </Button>
                                </Drawer>
                            </>
                            :
                            <FilterContainer>
                                <Divider sx={{ my: 2, display: { xs: 'none', md: 'block' } }} />
                                <Filter>
                                    <DetailTitle>Số lượng:</DetailTitle>
                                    <SubFilterContainer>
                                        <AmountButton direction="add" onClick={() => changeAmount(-1)}>
                                            <RemoveIcon style={{ fontSize: 12 }} />
                                        </AmountButton>
                                        <InputContainer>
                                            <AmountInput type="number" onChange={(e) => handleChangeAmount(e.target.valueAsNumber)} value={amountIndex} />
                                        </InputContainer>
                                        <AmountButton direction="remove" onClick={() => changeAmount(1)}>
                                            <AddIcon style={{ fontSize: 12 }} />
                                        </AmountButton>
                                    </SubFilterContainer>
                                </Filter>
                                <BuyButton disabled={!book} onClick={() => handleAddToCart(book)}>
                                    <ShoppingCartIcon style={{ fontSize: 18 }} />
                                    THÊM VÀO GIỎ ({(book?.price * amountIndex).toLocaleString()}đ)
                                </BuyButton>
                            </FilterContainer>
                        }

                    </InfoContainer>
                </Grid>
            </Grid>
            <Grid container spacing={2} size={{ xs: 12, lg: 2 }} direction={{ xs: 'row', lg: 'column'}}>
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
        </Grid >
    )
}

export default ProductContent