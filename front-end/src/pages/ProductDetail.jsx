import React, { useEffect, useState, useRef } from 'react'

import styled from 'styled-components'
import { styled as muiStyled } from '@mui/system';

import { Remove as RemoveIcon, Add as AddIcon, Star as StarIcon, StarBorder as StarBorderIcon,
ShoppingCart as ShoppingCartIcon, Sell as SellIcon, Storefront as StorefrontIcon, Check as CheckIcon} from '@mui/icons-material';
import { Divider, Grid, Rating, Breadcrumbs, Avatar, Skeleton } from '@mui/material';

import ProductImages from '../components/ProductImages';
import ProductsSlider from '../components/ProductsSlider';
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ProductDetailContainer from '../components/ProductDetailContainer'

import { Link, useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import useFetch from '../hooks/useFetch';

//#region styled
const Container = styled.div`
`

const Wrapper = styled.div`
    padding-right: 15px;
    padding-left: 15px;
    margin-right: auto;
    margin-left: auto;

    @media (min-width: 768px) {
        width: 750px;
    }
    @media (min-width: 992px) {
        width: 970px;
    }
    @media (min-width: 1200px) {
        width: 1170px;
    }
`

const StuffContainer = styled.div`
    border: 0.5px solid lightgray;
    padding: 20px 10px;
    margin-bottom: 20px;
`

const SellerContainer = styled.div`
    display: flex; 
    align-items: center;
    margin: 20px 0px;
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
    transition: all 0.5s ease;

    &:hover{
        background-color: #63e399;
        color: white;
    }
`

const InfoContainer = styled.div`
    height: 100%;
    padding: 0 40px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border: 0.5px solid lightgray;
`

const Title = styled.h2`
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

const StyledRating = muiStyled(Rating)({
    color: '#63e399',
    fontSize: 18,
    '& .MuiRating-iconFilled': {
        color: '#63e399',
    },
    '& .MuiRating-iconHover': {
        color: '#00ff6a',
    },
});

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
`

const Filter = styled.div`
    align-items: center;
    margin-bottom: 30px;
`

const SubFilterContainer = styled.div`
    display: flex;
    align-items: center;
    margin: 6px 0px;
`

const DetailTitle = styled.span`
    font-size: 16px;
    font-weight: 600;
`

const InputContainer = styled.div`
    border: 0.5px solid lightgray;
    align-items: center;
    justify-content: space-between;
    align-items: center;
`

const AmountInput = styled.input`
    height: 30px;
    width: 30px;
    background: transparent;
    color: black;
    font-weight: bold;
    resize: none;
    outline: none;
    border: none;
    text-align: center;

    &::-webkit-outer-spin-button,
    ::-webkit-inner-spin-button {
        -webkit-appearance: none;
    }
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
    width: 90%;
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

const BOOK_URL = `/api/books/`;
const BOOKS_RANDOM_URL = 'api/books/random?amount=10';

const ProductDetail = () => {
    const {id} = useParams();
    const [amountIndex, setAmountIndex] = useState(1);
    const [tab, setTab] = useState("1");
    const ref = useRef(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { loading, data: book, error } = useFetch(BOOK_URL + id);
    const { loading: loadingRandom, data: booksRandom } = useFetch(BOOKS_RANDOM_URL);

    const avgRate = () =>{
        let rate = 0;
        rate = Math.round((book?.rateTotal / book?.rateAmount)*2)/2
        return rate;
    }

    //Load
    useEffect(()=>{
        if (!loading) {
            window.scrollTo(0, 0);
            handleTabChange("1");
        }
    }, [loading]);

    useEffect(()=>{
        if (error && error?.response?.status === 404) navigate('/missing');
    }, [error]);

    const changeAmount = (n) => {
        setAmountIndex(prev => (prev + n < 1 ? 1 : prev + n));
    }

    //Add to cart
    const handleAddToCart = async (book) => {
        const { addToCart } = await import('../redux/cartReducer');
        const { enqueueSnackbar } = await import('notistack');

        enqueueSnackbar('Đã thêm sản phẩm vào giỏ hàng!', { variant: 'success' });
        dispatch(addToCart({
            id: book.id,
            title: book.title,
            price: book.price,
            image: book.image,
            quantity: amountIndex,
        }))
    };

    const handleTabChange = (tab) => {
        setTab(tab);
    }

    const handleViewMore = () => {
        handleTabChange("1");
        ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    let product;
    
    if (loading){
        product = 
        <Grid container spacing={2}>
            <Grid item sm={12} md={10}>
                <Grid container spacing={2} justifyContent="flex-start" alignItems="stretch">
                    <Grid item sm={12} md={6}>
                        <Skeleton variant="rectangular" animation="wave" width={478} height={645}/>
                    </Grid>
                    <Grid item sm={12} md={6}>
                        <Skeleton variant="rectangular" animation="wave" width={478} height={704}/>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item sm={12} md={2}>
                <Skeleton variant="rectangular" animation="wave" width={181} height={170}/>
                <Skeleton variant="rectangular" animation="wave" width={181} height={230}/>
            </Grid>
        </Grid>
    } else {
        product =
        <Grid container spacing={2}>
            <Grid item sm={12} md={10}>
                <Grid container spacing={2} justifyContent="flex-start" alignItems="stretch">
                    <Grid item sm={12} md={6}>
                        <ProductImages images={book?.image}/>
                    </Grid>
                    <Grid item sm={12} md={6}>
                        <InfoContainer>
                            <div>
                                <Title>{book?.title}</Title>
                                <Detail>
                                    Nhà xuất bản: &nbsp;
                                    <Link to={`/filters?pubId=${book?.publisher?.id}`}>
                                        {book?.publisher?.pubName}
                                    </Link>
                                </Detail>
                                <TotalRatingContainer>
                                    <StyledRating
                                        name="product-rating"
                                        value={avgRate()}
                                        getLabelText={(value) => `${value} Heart${value !== 1 ? 's' : ''}`}
                                        precision={0.5}
                                        icon={<StarIcon fontSize="18"/>}
                                        emptyIcon={<StarBorderIcon fontSize="18"/>}
                                        readOnly
                                    /> 
                                    <strong style={{paddingLeft: 10}}>({book?.rateAmount}) Đánh giá</strong>
                                </TotalRatingContainer>
                                <PriceContainer>
                                    <Price>{book?.price?.toLocaleString()} đ</Price>
                                    <OldPrice>{Math.round(book?.price * 1.1).toLocaleString()} đ</OldPrice>
                                </PriceContainer>
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
                                <br/>
                                <DetailTitle>Mô tả sản phẩm:</DetailTitle>
                                <Description>
                                    {book?.description}
                                </Description>
                                <Detail>
                                    <Link onClick={handleViewMore}>Xem thêm...</Link>
                                </Detail>
                            </div>
                            <FilterContainer>
                                <Divider sx={{my: 2}}/>
                                <Filter>
                                    <DetailTitle>Số lượng:</DetailTitle>
                                    <SubFilterContainer>
                                        <AmountButton direction="add" onClick={()=>changeAmount(-1)}>
                                            <RemoveIcon style={{fontSize: 12}}/>
                                        </AmountButton>
                                        <InputContainer>
                                            <AmountInput type="number" onChange={(e) => setAmountIndex(e.target.valueAsNumber)} value={amountIndex}/>    
                                        </InputContainer>
                                        <AmountButton direction="remove" onClick={()=>changeAmount(1)}>
                                            <AddIcon style={{fontSize: 12}}/>
                                        </AmountButton>
                                    </SubFilterContainer>
                                </Filter>

                                <BuyButton onClick={() => handleAddToCart(book)}>
                                    <ShoppingCartIcon style={{fontSize: 18}}/>
                                    THÊM VÀO GIỎ
                                </BuyButton>
                            </FilterContainer>
                        </InfoContainer>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item sm={12} md={2}>
                <StuffContainer>
                    <h5 style={{margin: 0, display: 'flex', alignItems: 'center'}}><StorefrontIcon/>&nbsp;NHÀ PHÂN PHỐI</h5>
                    <SellerContainer>
                        <Avatar>H</Avatar>
                        <Link to={`/filters?seller=${book?.sellerName}`}>
                            &nbsp;{book?.sellerName}
                        </Link>
                    </SellerContainer>
                    <h4 style={{margin: '0 5px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        color: '#63e399'}}>
                        ĐỐI TÁC RING!&nbsp;<CheckIcon/>
                    </h4>
                </StuffContainer>
                <StuffContainer>
                    <h5 style={{margin: 0, display: 'flex', alignItems: 'center'}}><SellIcon/>&nbsp;KHUYẾN MÃI</h5>
                    <CouponTab><SellIcon/>&nbsp; MÃ: ABCDFE39</CouponTab>
                    <CouponTab><SellIcon/>&nbsp; MÃ: DFCR4546</CouponTab>
                    <CouponTab><SellIcon/>&nbsp; MÃ: TRBB1234</CouponTab>
                </StuffContainer>
            </Grid>
        </Grid>
    }

    return (
    <Container>
        <Navbar/>
        <Wrapper>
            <div role="presentation" style={{margin: '20px 10px'}}>
                <Breadcrumbs separator="›" maxItems={4} aria-label="breadcrumb">
                    <Link to={`/`} style={{backgroundColor: '#63e399', padding: '5px 15px', color: 'white'}}>
                    Trang chủ
                    </Link>
                    <Link to={`/filters`}>
                    Danh mục sản phẩm
                    </Link>
                    <Link to={`/filters?cateId=${book?.cateId}`}>
                    {book?.cateName}
                    </Link>
                    <Link to={`/filters?pubId=${book?.publisher?.id}`}>
                    {book?.publisher?.pubName}
                    </Link>
                    <strong style={{textDecoration: 'underline'}}>{book?.title}</strong>
                </Breadcrumbs>
            </div>
            {product}
            <div ref={ref} >
                <ProductDetailContainer loading={loading} 
                book={book}
                tab={tab}
                onTabChange={handleTabChange}/>
            </div>
            <ProductsSlider booksList={booksRandom} loading={loadingRandom}/>
            <br/><br/>
        </Wrapper>
        <Footer/>
    </Container>
  )
}

export default ProductDetail