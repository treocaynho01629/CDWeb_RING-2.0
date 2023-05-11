import React, { useEffect, useState } from 'react'

import styled from 'styled-components'
import { styled as muiStyled } from '@mui/system';
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

import RemoveIcon from '@mui/icons-material/Remove'
import AddIcon from '@mui/icons-material/Add'
import Divider from '@mui/material/Divider'
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SellIcon from '@mui/icons-material/Sell';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Grid from '@mui/material/Grid';
import Rating from '@mui/material/Rating'
import TextareaAutosize from '@mui/material/TextareaAutosize';
import Breadcrumbs from '@mui/material/Breadcrumbs';

import ProductImages from '../components/ProductImages';
import ProductsSlider from '../components/ProductsSlider';
import AppPagination from '../components/AppPagination';
import Review from '../components/Review';

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

const ProductDetailContainer = styled.div`
    margin: 50px 0px;
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

const FullInfoTab = styled.div``

const RatingTab = styled.div``

const RatingSelect = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`

const RateSelect = styled.div`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    text-align: center;
`

const RateButton = styled.button`
    border-radius: 0;
    padding: 10px;
    margin-top: -15px;
    border: none;
    outline: none;
    background-color: #63e399;
    color: white;
    font-size: 14px;
    justify-content: center;
    font-weight: bold;
    transition: all 0.5s ease;

    &:hover {
        background-color: lightgray;
        color: gray;
    }
`

const RelatedTab = styled.div``

const StyledTabList = muiStyled((props) => (
    <TabList
      {...props}
      TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
    />
  ))({
    '& .MuiTabs-indicator': {
      display: 'flex',
      justifyContent: 'center',
      backgroundColor: 'red',
    },
    '& .MuiTabs-indicatorSpan': {
      width: '100%',
      height: 100,
      backgroundColor: '#63e399',
    },
  });
  
  const StyledTab = muiStyled((props) => <Tab disableRipple {...props} />)(
    ({ theme }) => ({
      fontWeight: 400,
      color: 'rgba(255, 255, 255, 0.7)',
      '&.Mui-selected': {
        fontWeight: 'bold',
        backgroundColor: '#63e399',
        color: 'white',
        outline: 'none',
        border: 'none',
      },
      '&.Mui-focusVisible': {
        backgroundColor: 'transparent',
        outline: 'none',
        border: 'none',
      },
      '&.Mui-focused': {
        outline: 'none',
        border: 'none',
      },
    }),
);

const ProductDetail = () => {

    const {id} = useParams();
    const BOOK_URL = `/api/books/${id}`;
    const REVIEW_URL = `/api/reviews/${id}`;
    const BOOKS_RELATED_URL = 'api/books/filters?pSize=10';
    const BOOKS_RANDOM_URL = 'api/books/random?amount=10';

    const [book, setBook] = useState([]);
    const [reviewList, setReviewList] = useState([]);
    const [pagination, setPagination] = useState({
        currPage: 0,
        pageSize: 5,
        totalPages: 0
    })
    const [value, setValue] = useState('1');
    const [amountIndex, setAmountIndex] = useState(1);
    const { enqueueSnackbar } = useSnackbar();

    const { loading, data, error } = useFetch(BOOK_URL);
    const { loading: loadingReview, data: reviews } = useFetch(REVIEW_URL + "?pSize=" + pagination.pageSize 
                                                                        + "&pageNo=" + pagination.currPage);
    const { loading: loadingRelated, data: booksRelated } = useFetch(BOOKS_RELATED_URL + "&cateId=" + book?.cateId);
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
        if (error?.response?.status === 404) navigate('/missing');

        loadBook();
        loadReview(); 
        setPagination({ ...pagination, currPage: 0});
        window.scrollTo(0, 0);
    }, [loading == false]);

    useEffect(() => {
        loadReview(); 
    }, [pagination.currPage, pagination.pageSize, loadingReview == false])

    const loadBook = async ()=>{
        setBook(data);
    }

    const loadReview = async ()=>{
        setPagination({ ...pagination, totalPages: reviews?.totalPages});
        setReviewList(reviews?.content);
    }

    //Change page
    const handlePageChange = (page) => {
        setPagination({...pagination, currPage: page - 1});
    };

    //Change amount
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axiosPrivate.post(REVIEW_URL,
                JSON.stringify({
                    cart: products,
                    firstName: firstName,
                    lastName: lastName,
                    phone: phone,
                    address: address,
                    message: message
                } ),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            console.log(JSON.stringify(response))
            dispatch(resetCart());
            navigate('/cart');
        } catch (err) {
            console.log(err);
            if (!err?.response) {
            } else if (err.response?.status === 404) {
            } else {
            }
        }
    }

    //Review
    let review;
    if (loadingReview){
        review = <p>loading</p>
    } else if (book?.rateAmount != 0){
        review = 
        <Box>
            {reviewList?.map((review, index) => (
                <Grid key={index}>
                    <Review review={review}/>
                </Grid>
            ))}
            <AppPagination pagination={pagination}
            onPageChange={handlePageChange}/>
        </Box>
    } else {
        review = <Box sx={{marginBottom: 5}}>Chưa có ai bình luận, hãy trở thành người đầu tiên!</Box>
    }

    let product;
    let fullInfo;
    if (loading){
        product = <p>loading</p>
        fullInfo = <p>loading</p>
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
                                    <Price>{book?.price.toLocaleString()} đ</Price>
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
                                    {book?.type}
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

        fullInfo =
        <FullInfoTab>
            <h3>Thông tin chi tiết: </h3>
            <p><b>Mã hàng:</b> {book?.id}</p>
            <p><b>Tác giả:</b> {book?.author}</p>
            <p><b>NXB:</b> {book?.publisher?.pubName}</p>
            <p><b>Trọng lượng (gr):</b> {book?.weight} gr</p>
            <p><b>Kích thước:</b> {book?.size} cm</p>
            <p><b>Số trang:</b> {book?.pages}</p>
            <p><b>Hình thức:</b> {book?.type}</p>
            <TextareaAutosize
                value={book?.description}
                cols={100}
                rows={20}
                readOnly
                disabled
                style={{ marginTop: '50px', padding: '0', backgroundColor: 'white', resize: 'none', border: 'none'}}
            />
        </FullInfoTab>
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

            <ProductDetailContainer>
                <Box sx={{ width: '100%', typography: 'body1'}}>
                    <TabContext value={value}>
                        <Box sx={{color: 'rgb(30, 255, 0)', backgroundColor: 'rgb(39, 39, 39)'}}>
                        <StyledTabList onChange={handleChange} aria-label="tab">
                            <StyledTab label="THÔNG TIN CHI TIẾT" value="1" />
                            <StyledTab label="ĐÁNH GIÁ" value="2" />
                            <StyledTab label="SẢN PHẨM LIÊN QUAN" value="3" />
                        </StyledTabList>
                        </Box>
                        <TabPanel value="1">
                            {fullInfo}
                        </TabPanel>
                        <TabPanel value="2">
                            <RatingTab>
                                {review}
                                <Box>
                                    <Box>
                                        <strong>Để lại đánh giá của bạn</strong>
                                    </Box>
                                    <TextareaAutosize
                                        aria-label="comment"
                                        minRows={7}
                                        placeholder="Đánh giá của bạn ..."
                                        style={{ width: '100%', margin: '30px 0px', backgroundColor: 'white', outline: 'none',
                                        borderRadius: '0', resize: 'none', color: 'black', fontSize: '16px'}}
                                    />
                                    <RatingSelect>
                                        <RateSelect>
                                            <strong>Đánh giá: </strong>
                                            <StyledRating
                                                sx={{marginLeft: '5px'}} 
                                                name="product-rating"
                                                defaultValue={5}
                                                getLabelText={(value) => `${value} Heart${value !== 1 ? 's' : ''}`}
                                                icon={<StarIcon fontSize="10px"/>}
                                                emptyIcon={<StarBorderIcon fontSize="10"/>}
                                            /> 
                                        </RateSelect>
                                        <RateButton>Gửi đánh giá</RateButton>
                                    </RatingSelect>
                                </Box>
                            </RatingTab>
                        </TabPanel>
                        <TabPanel value="3">
                            <RelatedTab>
                                <ProductsSlider booksList={booksRelated?.content} loading={loadingRelated}/>
                            </RelatedTab>
                        </TabPanel>
                    </TabContext>
                </Box>
                <ProductsSlider booksList={booksRandom} loading={loadingRandom}/>
            </ProductDetailContainer>
        </Wrapper>
        <Footer/>
    </Container>
  )
}

export default ProductDetail