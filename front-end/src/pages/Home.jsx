import { useState, useEffect } from "react";
import Categories from '../components/Categories'
import Products from '../components/Products'
import Slider from '../components/Slider'
import ProductsSlider from '../components/ProductsSlider'

import styled from 'styled-components'
import { Grid, Divider, ToggleButton, ToggleButtonGroup } from '@mui/material'

import { styled as muiStyled } from '@mui/system';
import { useNavigate } from 'react-router-dom';

import useFetch from '../hooks/useFetch'

//#region styled
const ToggleGroupContainer = styled.div`
  background-color: rgb(39, 39, 39);
  margin-bottom: 10px;
`

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`

const Button = styled.button`
  background-color: #63e399;
  padding: 10px 20px;;
  font-size: 16px;
  font-weight: 500;
  border-radius: 0;
  border: none;
  transition: all 0.5s ease;
  z-index: 5;

  &:hover {
      background-color: lightgray;
      color: black;
  };

  &:focus {
      outline: none;
      border: none;
      border: 0;
  };

  outline: none;
  border: 0;
`

const Title = muiStyled(Divider)({
  fontSize: 18,
  fontWeight: 'bold',
  textTransform: 'uppercase',
  color: '#63e399',
  textAlign: 'center',
  justifyContent: 'center',
  margin: '20px 0px',
});

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

const StyledToggleButtonGroup = muiStyled(ToggleButtonGroup)(({ theme }) => ({
  '& .MuiToggleButtonGroup-grouped': {
    backgroundColor: 'rgb(39, 39, 39)',
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: 400,
    border: 0,
    borderRadius: 0
  },
}));

const StyledToggleButton = muiStyled(ToggleButton)(({ theme }) => ({
    paddingLeft: '20px',
    paddingRight: '20px',
    '&:hover': {
      backgroundColor: '#63e399',
    },
    '&.Mui-selected': {
      fontWeight: 'bold',
      backgroundColor: '#63e399',
      color: 'white',
    },
    '&:focus': {
      outline: 'none',
      border: 'none',
    },
}));
//#endregion

const orderGroup = [
  {
    value: 'orderTime',
    label: 'Bán chạy',
  },
  {
    value: 'id',
    label: 'Mới nhất',
  },
  {
    value: 'rateAmount',
    label: 'Yêu thích',
  },
];

const BOOKS_FETCH_URL = 'api/books/filters?pageNo=0&pSize=15';
const MORE_BOOKS_URL = 'api/books/filters?pSize=5';
const BOOKS_RANDOM_URL = 'api/books/random?amount=5';
const BOOKS_SORT_URL = 'api/books/filters?pageNo=0&pSize=5';
const CATEGORIES_URL = 'api/categories';

const Home = () => {
  const [booksList, setBooksList] = useState([])
  const [orderBy, setOrderBy] = useState(orderGroup[0].value);
  const [randomCates, setRandomCates] = useState([]);
  const [currCate, setCurrCate] = useState('none');
  const [count, setCount] = useState(3);
  const { loading: loadingCate, data: cates } = useFetch(CATEGORIES_URL);
  const { loading, data } = useFetch(BOOKS_FETCH_URL);
  const { loading: loadingRandom, data: booksRandom, refetch } = useFetch(BOOKS_RANDOM_URL);
  const { loading: loadingOrder, data: booksOrder } = useFetch(BOOKS_SORT_URL + "&sortBy=" + orderBy);
  const { loading: loadingByCate, data: booksCate } = useFetch(BOOKS_SORT_URL + "&cateId=" + currCate);
  const { loading: loadingMore, data: more } = useFetch(MORE_BOOKS_URL + "&pageNo=" + count);

  const navigate = useNavigate();

  const handleChangeOrder = (event, newValue) => {
    if (newValue !== null) {
      setOrderBy(newValue);
    }
  };

  const handleChangeCate = (event, newValue) => {
    setCurrCate(newValue);
  };

  const handleShowMore = async () => {
    if (count == 6){
      navigate('/filters');
    } else if (!loadingMore && more){
      setBooksList(current => [...current, ...more?.content]);
      setCount(prev => prev + 1);
    }
  }

  useEffect(()=>{
    window.scrollTo(0, 0);
    document.title = `RING! - Bookstore`;
    console.log(import.meta.env.VITE_PORT_SOCKET_SPRING);
  }, []);

  //Load
  useEffect(()=>{
    if (!loading){
      setBooksList(data?.content);
    }
  }, [loading]);

  useEffect(()=>{
    if (!loadingCate){
      let randoms = (cates?.sort(() => 0.5 - Math.random()).slice(0, 4));
      setCurrCate(randoms ? randoms[0]?.id : null);
      setRandomCates(randoms);
    }
  }, [loadingCate]);

  return (
    <Wrapper>
      <Slider/>
      <Categories loading={loadingCate} data={cates}/>
      <Grid sx={{my: 3}} container spacing={5}>
        <Grid item xs={12} md={12}>
          <Title>SẢN PHẨM MỚI NHẤT</Title>
          <Products booksList={booksList}/>
          <ButtonContainer>
            <Button onClick={handleShowMore}>Xem thêm</Button>
          </ButtonContainer>
          
          <Title>SẢN PHẨM XẾP THEO</Title>
          <ToggleGroupContainer>
            <StyledToggleButtonGroup
                value={orderBy}
                exclusive
                onChange={handleChangeOrder}
            >
              {orderGroup.map((order, index) => (
                <StyledToggleButton key={index} value={order.value}>{order.label}</StyledToggleButton>
              ))}
            </StyledToggleButtonGroup>
          </ToggleGroupContainer>
          <ProductsSlider  booksList={booksOrder?.content} loading={loadingOrder}/>
          <ButtonContainer>
            <Button onClick={() => navigate(`/filters?cateId=${currCate}`)}>Xem thêm</Button>
          </ButtonContainer>

          <Title>SẢN PHẨM DANH MỤC</Title>
          <ToggleGroupContainer>
            <StyledToggleButtonGroup
                value={currCate}
                exclusive
                onChange={handleChangeCate}
            >
              {randomCates?.map((cate) => (
                <StyledToggleButton key={cate?.id} value={cate?.id}>{cate?.categoryName}</StyledToggleButton>
              ))}
            </StyledToggleButtonGroup>
          </ToggleGroupContainer>
          <ProductsSlider  booksList={booksCate?.content} loading={loadingByCate}/>
          <ButtonContainer>
            <Button onClick={() => navigate(`/filters?cateId=${currCate}`)}>Xem thêm</Button>
          </ButtonContainer>
          
          <Title>CÓ THỂ BẠN SẼ THÍCH</Title>
          <ProductsSlider  booksList={booksRandom} loading={loadingRandom}/>
          <ButtonContainer>
            <Button onClick={refetch}>Làm mới</Button>
          </ButtonContainer>
        </Grid>
      </Grid>
    </Wrapper>
  )
}

export default Home