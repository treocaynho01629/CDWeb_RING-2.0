import styled from 'styled-components';
import { useState, useEffect } from "react";
import { Grid, ToggleButton, ToggleButtonGroup, Skeleton } from '@mui/material';
import { styled as muiStyled } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import { useGetCategoriesQuery } from '../features/categories/categoriesApiSlice';
import { useGetBooksByFilterQuery, useGetBooksQuery, useGetRandomBooksQuery } from '../features/books/booksApiSlice';
import Categories from '../components/Categories';
import Products from '../components/product/Products';
import Slider from '../components/product/Slider';
import ProductsSlider from '../components/product/ProductsSlider';
import CustomButton from '../components/custom/CustomButton';
import CustomDivider from '../components/custom/CustomDivider';
import useTitle from '../hooks/useTitle';

//#region styled
const Wrapper = styled.div`
  overflow-x: hidden;
`

const ToggleGroupContainer = styled.div`
  background-color: #272727;
  margin-bottom: 10px;
  overflow-x: scroll;
  scroll-behavior: smooth;
  white-space: nowrap;

  -ms-overflow-style: none;
  scrollbar-width: none; 

  &::-webkit-scrollbar {
      display: none;
  }
`

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`

const StyledToggleButtonGroup = muiStyled(ToggleButtonGroup)(({ theme }) => ({
  '& .MuiToggleButtonGroup-grouped': {
    backgroundColor: '#272727',
    color: '#ffffffb2',
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
    backgroundColor: theme.palette.primary.main,
  },
  '&.Mui-selected': {
    fontWeight: 'bold',
    backgroundColor: theme.palette.primary.main,
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

const defaultSize = 15;
const defaultMore = 5;

const Home = () => {
  //Initial value
  const [orderBy, setOrderBy] = useState(orderGroup[0].value);
  const [randomCateIds, setRandomCateIds] = useState([]);
  const [currCate, setCurrCate] = useState(null);
  const [pagination, setPagination] = useState({
    currPage: 0,
    pageSize: defaultSize,
    isMore: true,
  })

  //Fetch data
  const { data, isLoading, isSuccess, isError } = useGetBooksQuery({
    page: pagination?.currPage,
    size: pagination?.pageSize,
    loadMore: pagination?.isMore
  });
  const { data: randomBooks, isLoading: loadRandom, isSuccess: doneRandom, isError: errorRandom, refetch: refetchRandom } = useGetRandomBooksQuery({ amount: 10 });
  const { data: cateBooks, isLoading: loadByCate, isSuccess: doneByCate, isError: errorByCate, isUninitialized } = useGetBooksByFilterQuery({ cateId: currCate }, { skip: !currCate });
  const { data: orderBooks, isLoading: loadByOrder, isSuccess: doneByOrder, isError: errorByOrder } = useGetBooksByFilterQuery({ sortBy: orderBy, sortDir: "desc" }, { skip: !orderBy });
  const { data: cates, isLoading: loadCates, isSuccess: doneCates, isError: errorCates } = useGetCategoriesQuery();

  //Other
  const navigate = useNavigate();

  //Set title
  useTitle('RING! - Bookstore');

  //Load
  useEffect(() => {
    if (!loadCates && doneCates && cates) {
      const { ids } = cates;
      let tempIds = [...ids];

      //Get 4 random cates
      let randomIds = (tempIds?.sort(() => 0.5 - Math.random()).slice(0, 4));
      setCurrCate(randomIds ? randomIds[0] : null);
      setRandomCateIds(randomIds);
    }
  }, [cates]);

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
    if (pagination?.currPage >= 5) {
      navigate('/filters');
    } else {
      let nextPage = (data?.ids?.length / defaultMore);
      setPagination({ ...pagination, currPage: nextPage, pageSize: defaultMore })
    }
  }

  let catesContent;

  if (loadCates || errorCates) {
    catesContent = (
      Array.from(new Array(4)).map((index) => (
        <StyledToggleButton key={index} value='none' disabled={true}>
          <Skeleton sx={{ bgcolor: 'grey.400', fontSize: '14px' }} variant="text" animation="wave" width={100} />
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
      <Grid sx={{ mb: 3, mt: -1 }} container spacing={5}>
        <Grid item xs={12} md={12}>
          <CustomDivider>SẢN PHẨM MỚI NHẤT</CustomDivider>
          <br />
          <Products {...{ isLoading, data, isSuccess, isError }} />
          <ButtonContainer>
            <CustomButton color="primary" variant="contained" size="medium" onClick={handleShowMore}>Xem thêm</CustomButton>
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
                    <Skeleton key={index} variant="text" animation="wave" sx={{ fontSize: '14px' }} width={100} />
                  }
                </StyledToggleButton>
              ))}
            </StyledToggleButtonGroup>
          </ToggleGroupContainer>
          <ProductsSlider {...{ isLoading: loadByOrder, data: orderBooks, isSuccess: doneByOrder, isError: errorByOrder }} />
          <ButtonContainer>
            <CustomButton variant="contained" color="primary" size="medium" onClick={() => navigate(`/filters?cateId=${currCate}`)}>Xem thêm</CustomButton>
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
          <ProductsSlider {...{ isLoading: loadByCate, data: cateBooks, isSuccess: doneByCate, isError: errorByCate, isUninitialized }} />
          <ButtonContainer>
            <CustomButton variant="contained" color="primary" size="medium" onClick={() => navigate(`/filters?cateId=${currCate}`)}>Xem thêm</CustomButton>
          </ButtonContainer>
          <br />
          <CustomDivider>CÓ THỂ BẠN SẼ THÍCH</CustomDivider>
          <br />
          <ProductsSlider {...{ isLoading: loadRandom, data: randomBooks, isSuccess: doneRandom, isError: errorRandom }} />
          <ButtonContainer>
            <CustomButton variant="contained" color="primary" size="medium" onClick={refetchRandom}>Làm mới</CustomButton>
          </ButtonContainer>
        </Grid>
      </Grid>
    </Wrapper>
  )
}

export default Home