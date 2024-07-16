import styled from 'styled-components';
import { useState, useEffect } from "react";
import { Grid, ToggleButton, ToggleButtonGroup, Skeleton } from '@mui/material';
import { styled as muiStyled } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import { useGetCategoriesQuery } from '../features/categories/categoriesApiSlice';
import Categories from '../components/Categories';
import Products from '../components/Products';
import Slider from '../components/Slider';
import ProductsSlider from '../components/ProductsSlider';
import CustomButton from '../components/custom/CustomButton';
import CustomDivider from '../components/custom/CustomDivider';
import { useGetBooksByFilterQuery, useGetBooksQuery, useGetRandomBooksQuery } from '../features/books/booksApiSlice';

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

const defaultMore = 5;

const Home = () => {
  //Initial value
  const [orderBy, setOrderBy] = useState(orderGroup[0].value);
  const [randomCateIds, setRandomCateIds] = useState([]);
  const [currCate, setCurrCate] = useState(null);
  const [count, setCount] = useState(3);
  const [more, setMore] = useState(false);

  //Fetch data
  const { data, isLoading, isSuccess, isError } = useGetBooksQuery();
  const { data: randomBooks, isLoading: loadRandom, isSuccess: doneRandom, isError: errorRandom, refetch } = useGetRandomBooksQuery();
  const { data: cateBooks, isLoading: loadByCate, isSuccess: doneByCate, isError: errorByCate } = useGetBooksByFilterQuery({ cateId: currCate }, { skip: !currCate });
  const { data: orderBooks, isLoading: loadByOrder, isSuccess: doneByOrder, isError: errorByOrder } = useGetBooksByFilterQuery({ sortBy: orderBy }, { skip: !orderBy });
  const { isLoading: loadMore, isSuccess: doneMore } = useGetBooksQuery({ page: count, size: defaultMore, loadMore: more }, { skip: (count === -1 || !more) });
  const { data: cates, isLoading: loadCates, isSuccess: doneCates, isError: errorCates } = useGetCategoriesQuery();

  //Other
  const navigate = useNavigate();

  //Update title
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = `RING! - Bookstore`;
  }, []);

  //Load
  useEffect(() => {
    if (!isLoading && isSuccess && data) {
      setMore(false);
      setCount(data?.ids?.length / defaultMore);
    }
  }, [isLoading]);

  useEffect(() => {
    if (!loadMore && doneMore) {
      setMore(false);
      setCount(prev => prev + 1);
      console.log('b')
    }
  }, [loadMore]);

  useEffect(() => {
    if (!loadCates && doneCates && cates) {
      const { ids } = cates;
      let tempIds = [...ids];

      //Get 4 random cates
      let randomIds = (tempIds?.sort(() => 0.5 - Math.random()).slice(0, 4));
      setCurrCate(randomIds ? randomIds[0] : null);
      setRandomCateIds(randomIds);
    }
  }, [loadCates]);

  //Change order tab
  const handleChangeOrder = (e, newValue) => {
    if (newValue !== null) { setOrderBy(newValue) }
  };

  //Change cate tab
  const handleChangeCate = (e, newValue) => {
    if (newValue !== null) { setCurrCate(newValue) }
  };

  //Show more
  const handleShowMore = () => {
    if (count === 5) {
      navigate('/filters');
    } else {
      console.log(count);
      setMore(true);
    }
  }

  let catesContent;

  if (loadCates || errorCates) {
    catesContent = (
      Array.from(new Array(4)).map((index) => (
        <StyledToggleButton key={index}>
          <Skeleton variant="text" animation="wave" sx={{ fontSize: '14px' }} width={100} />
        </StyledToggleButton>
      ))
    )
  } else if (doneCates) {
    const { entities } = cates;

    catesContent = randomCateIds?.length
      ? randomCateIds?.map((id, index) => {
        const cate = entities[id];

        return (
          <StyledToggleButton key={`${id}-${index}`} value={id}>
            {cate?.categoryName}
          </StyledToggleButton>
        )
      })
      :
      Array.from(new Array(4)).map((index) => (
        <StyledToggleButton key={index}>
          <Skeleton variant="text" animation="wave" sx={{ fontSize: '14px' }} width={100} />
        </StyledToggleButton>
      ))
  }

  return (
    <Wrapper>
      <Slider />
      <Categories />
      <Grid sx={{ my: 3 }} container spacing={5}>
        <Grid item xs={12} md={12}>
          <CustomDivider>SẢN PHẨM MỚI NHẤT</CustomDivider>
          <br />
          <Products {...{ loading: isLoading, data, isSuccess, isError }} />
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
          <ProductsSlider {...{ loading: loadByOrder, data: orderBooks, isSuccess: doneByOrder, isError: errorByOrder }} />
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
              {catesContent}
            </StyledToggleButtonGroup>
          </ToggleGroupContainer>
          <ProductsSlider {...{ loading: loadByCate, data: cateBooks, isSuccess: doneByCate, isError: errorByCate }} />
          <ButtonContainer>
            <CustomButton variant="contained" color="secondary" size="medium" onClick={() => navigate(`/filters?cateId=${currCate}`)}>Xem thêm</CustomButton>
          </ButtonContainer>
          <br />
          <CustomDivider>CÓ THỂ BẠN SẼ THÍCH</CustomDivider>
          <br />
          <ProductsSlider {...{ loading: loadRandom, data: randomBooks, isSuccess: doneRandom, isError: errorRandom }} />
          <ButtonContainer>
            <CustomButton variant="contained" color="secondary" size="medium" onClick={refetch}>Làm mới</CustomButton>
          </ButtonContainer>
        </Grid>
      </Grid>
    </Wrapper>
  )
}

export default Home