import styled from 'styled-components';
import { useState, useEffect } from "react";
import { Grid, Divider, ToggleButton, ToggleButtonGroup, Skeleton } from '@mui/material';
import { styled as muiStyled } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import Categories from '../components/Categories';
import Products from '../components/Products';
import Slider from '../components/Slider';
import ProductsSlider from '../components/ProductsSlider';
import CustomButton from '../components/custom/CustomButton';
import CustomDivider from '../components/custom/CustomDivider';
import useFetch from '../hooks/useFetch';

//#region styled
const Wrapper = styled.div`
`

const ToggleGroupContainer = styled.div`
  background-color: rgb(39, 39, 39);
  margin-bottom: 10px;
  overflow-x: scroll;
  scroll-behavior: smooth;
  white-space: nowrap;

  &::-webkit-scrollbar {
      display: none;
  }
`

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`

const StyledToggleButtonGroup = muiStyled(ToggleButtonGroup)(({ theme }) => ({
  '& .MuiToggleButtonGroup-grouped': {
    backgroundColor: 'rgb(39, 39, 39)',
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: 400,
    border: 0,
    borderRadius: 0,
  },
}));

const StyledToggleButton = muiStyled(ToggleButton)(({ theme }) => ({
  paddingLeft: '20px',
  paddingRight: '20px',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  '&:hover': {
    backgroundColor: theme.palette.secondary.main,
  },
  '&.Mui-selected': {
    fontWeight: 'bold',
    backgroundColor: theme.palette.secondary.main,
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
  //Initial value
  const [booksList, setBooksList] = useState([]);
  const [orderBy, setOrderBy] = useState(orderGroup[0].value);
  const [randomCates, setRandomCates] = useState([]);
  const [currCate, setCurrCate] = useState('none');
  const [count, setCount] = useState(3);

  //Fetch data
  const { loading: loadingCate, data: cates } = useFetch(CATEGORIES_URL);
  const { loading, data } = useFetch(BOOKS_FETCH_URL);
  const { loading: loadingByOrder, data: dataByOrder } = useFetch(BOOKS_SORT_URL + "&sortBy=" + orderBy);
  const { loading: loadingByCate, data: dataByCate } = useFetch(BOOKS_SORT_URL + "&cateId=" + currCate);
  const { loading: loadingRandom, data: dataRandom, refetch } = useFetch(BOOKS_RANDOM_URL);
  const { loading: loadingMore, data: more } = useFetch(MORE_BOOKS_URL + "&pageNo=" + count);

  //Other
  const navigate = useNavigate();

  //Update title
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = `RING! - Bookstore`;
  }, []);

  //Load
  useEffect(() => {
    if (!loading) { setBooksList(data?.content) }
  }, [loading]);

  useEffect(() => {
    if (!loadingCate) {
      let randoms = (cates?.sort(() => 0.5 - Math.random()).slice(0, 4));
      setCurrCate(randoms ? randoms[0]?.id : null);
      setRandomCates(randoms);
    }
  }, [loadingCate]);

  //Change order tab
  const handleChangeOrder = (e, newValue) => {
    if (newValue !== null) { setOrderBy(newValue) }
  };

  //Change cate tab
  const handleChangeCate = (e, newValue) => {
    if (newValue !== null) { setCurrCate(newValue) }
  };

  //Show more
  const handleShowMore = async () => {
    if (count == 6) {
      navigate('/filters');
    } else if (!loadingMore && more) {
      setBooksList(current => [...current, ...more?.content]);
      setCount(prev => prev + 1);
    }
  }

  return (
    <Wrapper>
      <Slider />
      <Categories loading={loadingCate} data={cates} />
      <Grid sx={{ my: 3 }} container spacing={5}>
        <Grid item xs={12} md={12}>
          <CustomDivider>SẢN PHẨM MỚI NHẤT</CustomDivider>
          <br />
          <Products booksList={booksList} loading={loading}/>
          <ButtonContainer>
            <CustomButton color="secondary" variant="contained" size="medium" onClick={handleShowMore}>Xem thêm</CustomButton>
          </ButtonContainer>
          <br />
          <CustomDivider>SẢN PHẨM XẾP THEO</CustomDivider>
          <br />
          <ToggleGroupContainer>
            <StyledToggleButtonGroup
              value={orderBy}
              exclusive
              onChange={handleChangeOrder}
            >
              {(!orderGroup?.length ? Array.from(new Array(4)) : orderGroup)?.map((order, index) => (
                <StyledToggleButton key={`${order?.id}-${index}`} value={order?.value}>
                  {order
                    ?
                    order?.label
                    :
                    <Skeleton variant="text" animation="wave" sx={{ fontSize: '14px' }} width={100} />
                  }
                </StyledToggleButton>
              ))}
            </StyledToggleButtonGroup>
          </ToggleGroupContainer>
          <ProductsSlider loading={loadingByOrder} booksList={dataByOrder?.content} />
          <ButtonContainer>
            <CustomButton variant="contained" color="secondary" size="medium" onClick={() => navigate(`/filters?cateId=${currCate}`)}>Xem thêm</CustomButton>
          </ButtonContainer>
          <br />
          <CustomDivider>SẢN PHẨM DANH MỤC</CustomDivider>
          <br />
          <ToggleGroupContainer>
            <StyledToggleButtonGroup
              value={currCate}
              exclusive
              onChange={handleChangeCate}
            >
              {(!randomCates?.length ? Array.from(new Array(4)) : randomCates)?.map((cate, index) => (
                <StyledToggleButton key={`${cate?.id}-${index}`} value={cate?.id}>
                  {cate
                    ?
                    cate?.categoryName
                    :
                    <Skeleton variant="text" animation="wave" sx={{ fontSize: '14px' }} width={100} />
                  }
                </StyledToggleButton>
              ))}
            </StyledToggleButtonGroup>
          </ToggleGroupContainer>
          <ProductsSlider loading={loadingByCate} booksList={dataByCate?.content} />
          <ButtonContainer>
            <CustomButton variant="contained" color="secondary" size="medium" onClick={() => navigate(`/filters?cateId=${currCate}`)}>Xem thêm</CustomButton>
          </ButtonContainer>
          <br />
          <CustomDivider>CÓ THỂ BẠN SẼ THÍCH</CustomDivider>
          <br />
          <ProductsSlider loading={loadingRandom} booksList={dataRandom?.content} />
          <ButtonContainer>
            <CustomButton variant="contained" color="secondary" size="medium" onClick={refetch}>Làm mới</CustomButton>
          </ButtonContainer>
        </Grid>
      </Grid>
    </Wrapper>
  )
}

export default Home