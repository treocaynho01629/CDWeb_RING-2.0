import styled from 'styled-components'
import { styled as muiStyled } from '@mui/system';
import { useState } from 'react';
import {
    Remove as RemoveIcon, Add as AddIcon, Star as StarIcon, StarBorder as StarBorderIcon,
    ShoppingCart as ShoppingCartIcon, Sell as SellIcon, Storefront as StorefrontIcon, Check as CheckIcon
} from '@mui/icons-material';
import { Skeleton, Rating, Box, Divider, Grid, Avatar, Container } from '@mui/material';
import { useDispatch } from 'react-redux';
import ProductImages from '../components/ProductImages';
import { Link } from 'react-router-dom';

//#region styled
const StuffContainer = styled.div`
    border: 0.5px solid lightgray;
    padding: 10px 20px;
    margin-bottom: 20px;

    @media (min-width: 768px) {
        padding: 20px 10px;
    }
`

const StuffTitle = styled.h5`
    margin: 0;
    text-decoration: underline;
    display: none;

    @media (min-width: 992px) {
        display: flex;
    }
`

const SellerContainer = styled.div`
    display: flex; 
    justify-content: center;
    align-items: center;
    margin: 10px 0px;

    a {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        
        @supports (-webkit-line-clamp: 1) {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: initial;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
        }
    }
`

const VisitButton = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    border: solid .5px #63e399;
    color: #63e399;
    padding: 7px 5px;
    cursor: pointer;
    transition: all .3s ease;

    &:hover {
        background-color: #63e399;
        color: white;
    }
`

const CouponTab = styled.div`
    background-color: lightgray;   
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
        background-color: #63e399;
        color: white;
    }
`

const InfoContainer = styled.div`
    height: 100%;
    padding: 0 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border: 0.5px solid lightgray;

    @media (min-width: 768px) {
        padding: 0 40px;
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
`

const StyledRating = muiStyled(Rating)(({ theme }) => ({
    color: theme.palette.secondary.main,
    fontSize: 18,
    '& .MuiRating-iconFilled': {
        color: theme.palette.secondary.main,
    },
    '& .MuiRating-iconHover': {
        color: theme.palette.secondary.dark,
    },
}));

const PriceContainer = styled.div`
    display: flex;
    align-items: center;
`

const Price = styled.h2`
    font-size: 24px;
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
    display: none;

    @media (min-width: 768px) {
        display: block;
    }
`

const AltFilterContainer = styled.div`
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 48px;
    z-index: 99;
    box-shadow: 3px 3px 10px 3px #b7b7b7;
    align-items: flex-end;
    display: flex;

    @media (min-width: 768px) {
        display: none;
    }
`

const Filter = styled.div`
    align-items: center;
    margin-bottom: 30px;
    display: none;

    @media (min-width: 768px) {
        display: block;
    }
`

const SubFilterContainer = styled.div`
    display: flex;
    align-items: center;
    margin: 6px 0px;
`

const DetailContainer = styled.div`
    display: none;

    @media (min-width: 768px) {
        display: block;
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
    background-color: white;

    @media (min-width: 768px) {
        border: .5px solid lightgray;
    }
`

const CartButton = styled.button`
    height: 48px;
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
        background-color: lightgray;
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
    color: black;

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
    background-color: lightgray;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    opacity: 0.75;
    transition: all 0.5s ease;

    &:hover{
        background-color: #63e399;
        color: white;
    }
`

const BuyButton = styled.button`
    width: 100%;
    border-radius: 0;
    padding: 15px;
    margin-top: -15px;
    border: none;
    outline: none;
    background-color: #63e399;
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

    @media (min-width: 768px) {
        width: 90%;
    }

    &:hover {
        background-color: lightgray;
        color: gray;
    };

    &:focus {
        border: none;
        outline: none;
    }
`
//#endregion

const ProductContent = ({ book }) => {
    const [amountIndex, setAmountIndex] = useState(1); //Amount add to cart
    const dispatch = useDispatch();

    //Calculate rating
    const avgRate = () => {
        let rate = 0;
        rate = Math.round((book?.rateTotal / book?.rateAmount) * 2) / 2
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

    //Scroll to more detail tab
    const handleViewMore = () => {
        handleTabChange("1");
        ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    //Add to cart
    const handleAddToCart = async (book) => {
        const { addToCart } = await import('../redux/cartReducer');
        const { enqueueSnackbar } = await import('notistack');

        //Queue snackbar
        enqueueSnackbar('Đã thêm sản phẩm vào giỏ hàng!', { variant: 'success' });
        dispatch(addToCart({
            id: book.id,
            title: book.title,
            price: book.price,
            image: book.image,
            quantity: amountIndex,
        }))
    };

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} lg={10}>
                <Grid container spacing={2} justifyContent="flex-start" alignItems="stretch">
                    <Grid item xs={12} md={6}>
                        {!book
                            ?
                            <Container sx={{ border: '0.5px solid lightgray' }}>
                                <Skeleton
                                    variant="rectangular"
                                    animation="wave"
                                    width={'95%'}
                                    height={500}
                                    style={{
                                        margin: '15px 10px',
                                    }}
                                />
                                <Container sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', padding: '10px', paddingLeft: 0 }}>
                                    {Array.from(new Array(4)).map((index) => (
                                        <Skeleton
                                            key={index}
                                            variant="rectangular"
                                            animation="wave"
                                            height={80}
                                            width={80}
                                            sx={{ marginRight: '5px' }}
                                        />
                                    ))}
                                </Container>
                            </Container>
                            :
                            <ProductImages images={book?.image} />
                        }
                    </Grid>
                    <Grid item xs={12} md={6}>
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
                                    <PriceContainer>
                                        <Skeleton variant="text" sx={{ fontSize: '24px', marginY: '20px' }} width="35%" />&nbsp;
                                        <Skeleton variant="text" sx={{ fontSize: '18px', marginY: '20px' }} width="25%" />
                                    </PriceContainer>
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
                                            <Link onClick={handleViewMore}>Xem thêm...</Link>
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
                                    <TotalRatingContainer>
                                        <StyledRating
                                            name="product-rating"
                                            value={calculatedRate}
                                            getLabelText={(value) => `${value} Heart${value !== 1 ? 's' : ''}`}
                                            precision={0.5}
                                            icon={<StarIcon fontSize="18" />}
                                            emptyIcon={<StarBorderIcon fontSize="18" />}
                                            readOnly
                                        />
                                        <strong style={{ paddingLeft: 10 }}>({book?.rateAmount}) Đánh giá</strong>
                                    </TotalRatingContainer>
                                    <PriceContainer>
                                        <Price>{book?.price?.toLocaleString()} đ</Price>
                                        <OldPrice>{Math.round(book?.price * 1.1).toLocaleString()} đ</OldPrice>
                                    </PriceContainer>
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
                                            <Link onClick={handleViewMore}>Xem thêm...</Link>
                                        </Detail>
                                    </DetailContainer>
                                </>
                            }
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
                                    THÊM VÀO GIỎ
                                </BuyButton>
                            </FilterContainer>
                            <AltFilterContainer>
                                <Link to={`/cart`}>
                                    <CartButton><ShoppingCartIcon style={{ fontSize: 24 }} /></CartButton>
                                </Link>
                                <InputContainer>
                                    <AltAmountInput type="number" onChange={(e) => handleChangeAmount(e.target.valueAsNumber)} value={amountIndex} />
                                </InputContainer>
                                <BuyButton disabled={!book} onClick={() => handleAddToCart(book)}>
                                    THÊM VÀO GIỎ
                                </BuyButton>
                            </AltFilterContainer>
                        </InfoContainer>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} lg={2}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={3} lg={12}>
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
                                        <VisitButton>
                                            <h4 style={{
                                                margin: '0 5px',
                                                display: 'flex',
                                                alignItems: 'center'
                                            }}>
                                                ĐỐI TÁC RING!&nbsp;<CheckIcon />
                                            </h4>
                                        </VisitButton>
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
                                            <Avatar>H</Avatar>
                                            <Link to={`/filters?seller=${book?.sellerName}`}>
                                                &nbsp;{book?.sellerName}
                                            </Link>
                                            &nbsp;&nbsp;&nbsp;
                                        </SellerContainer>
                                        <Link to={`/filters?seller=${book?.sellerName}`}>
                                            <VisitButton>
                                                <h4 style={{
                                                    margin: '0 5px',
                                                    display: 'flex',
                                                    alignItems: 'center'
                                                }}>
                                                    ĐỐI TÁC RING!&nbsp;<CheckIcon />
                                                </h4>
                                            </VisitButton>
                                        </Link>
                                    </Box>
                                }
                            </Box>
                        </StuffContainer>
                    </Grid>
                    <Grid item xs={12} md={9} lg={12} display={{ xs: 'none', sm: 'block' }}>
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
            </Grid>
        </Grid >
    )
}

export default ProductContent