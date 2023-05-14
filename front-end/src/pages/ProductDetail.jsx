import React, { useEffect, useState } from 'react'

import styled from 'styled-components'
import { styled as muiStyled } from '@mui/system';

import RemoveIcon from '@mui/icons-material/Remove'
import AddIcon from '@mui/icons-material/Add'
import Divider from '@mui/material/Divider'
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SellIcon from '@mui/icons-material/Sell';

import Grid from '@mui/material/Grid';
import Rating from '@mui/material/Rating'
import Breadcrumbs from '@mui/material/Breadcrumbs';

import ProductImages from '../components/ProductImages';
import ProductsSlider from '../components/ProductsSlider';
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ProductDetailContainer from '../components/ProductDetailContainer'

import { Link, useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartReducer';
import useFetch from '../hooks/useFetch'
import { useSnackbar } from 'notistack';

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

const CouponContainer = styled.div`
    border: 0.5px solid lightgray;
    padding: 20px 10px;
`

const CouponTitle = styled.h5`
    margin: 0;
`

const CouponTab = styled.div`
    background-color: lightgray;   
    margin-top: 10px; 
    padding: 5px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    text-align: center;
    justify-content: center;
    color: black;
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
    }
`

const BOOK_URL = `/api/books/`;
const BOOKS_RANDOM_URL = 'api/books/random?amount=10';

const ProductDetail = () => {
    const {id} = useParams();
    const [book, setBook] = useState([]);
    const [amountIndex, setAmountIndex] = useState(1);
    const { enqueueSnackbar } = useSnackbar();

    const { loading, data, error } = useFetch(BOOK_URL + id);
    const { loading: loadingRandom, data: booksRandom } = useFetch(BOOKS_RANDOM_URL);
    
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const avgRate = () =>{
        let rate = 0;
        rate = Math.round((book?.rateTotal / book?.rateAmount)*2)/2
        return rate;
    }

    //Load
    useEffect(()=>{
        if (!loading){
            if (error?.response?.status === 404) navigate('/missing');

            loadBook();
            window.scrollTo(0, 0);
        }
    }, [loading]);

    const loadBook = async ()=>{
        setBook(data);
    }

    const changeAmount = (n) => {
        setAmountIndex(prev => prev + n);

        if ((amountIndex + n) < 1){
            setAmountIndex(1)
        }
    }

    //Add to cart
    const handleAddToCart = (book) => {
        enqueueSnackbar('Đã thêm sản phẩm vào giỏ hàng!', { variant: 'success' });
        dispatch(addToCart({
            id: book.id,
            title: book.title,
            price: book.price,
            image: book.image,
            quantity: amountIndex,
        }))
    };

    let product;
    
    if (loading){
        product = <p>loading</p>
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
                                <Title>
                                    {book?.title}
                                </Title>
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
                <CouponContainer>
                    <CouponTitle>KHUYẾN MÃI</CouponTitle>
                    <CouponTab><SellIcon/>&nbsp;MÃ: ABCDFE39</CouponTab>
                    <CouponTab><SellIcon/>&nbsp;MÃ: ABCDFE39</CouponTab>
                    <CouponTab><SellIcon/>&nbsp;MÃ: ABCDFE39</CouponTab>
                    <CouponTab><SellIcon/>&nbsp;MÃ: ABCDFE39</CouponTab>
                    <CouponTab><SellIcon/>&nbsp;MÃ: ABCDFE39</CouponTab>
                    <CouponTab><SellIcon/>&nbsp;MÃ: ABCDFE39</CouponTab>
                    <CouponTab><SellIcon/>&nbsp;MÃ: ABCDFE39</CouponTab>
                </CouponContainer>
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
            <ProductDetailContainer loading={loading} book={book}/>
            {/* <ProductsSlider booksList={booksRandom} loading={loadingRandom}/> */}
        </Wrapper>
        <Footer/>
    </Container>
  )
}

export default ProductDetail