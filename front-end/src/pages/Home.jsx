import styled from 'styled-components';
import { useState, useEffect, lazy, Suspense } from "react";
import { Grid2 as Grid, Button, Tabs } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useGetCategoriesQuery } from '../features/categories/categoriesApiSlice';
import { useGetBooksQuery, useGetRandomBooksQuery } from '../features/books/booksApiSlice';
import { LazyLoadComponent } from 'react-lazy-load-image-component';
import { ExpandMore, Replay } from '@mui/icons-material';
import useTitle from '../hooks/useTitle';
import Categories from '../components/Categories';
import Products from '../components/product/Products';
import Slider from '../components/product/Slider';
import CustomDivider from '../components/custom/CustomDivider';
import CustomTab from '../components/custom/CustomTab';
import ProductsSliderPlaceholder from '../components/product/ProductsSliderPlaceholder';

const ProductsSlider = lazy(() => import('../components/product/ProductsSlider'));

//#region styled
const Wrapper = styled.div`
  overflow-x: hidden;
`

const ToggleGroupContainer = styled.div`
  background-color: ${props => props.theme.palette.grey[900]};
  margin: 15px 0 0;
  white-space: nowrap;
  
  ${props => props.theme.breakpoints.down("sm")} {
    margin: 10px 0;
    background-color: ${props => props.theme.palette.action.hover};
    border-bottom: 1px solid ${props => props.theme.palette.divider};
  }
`

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`
//#endregion

const orderGroup = [
  {
    value: 'totalOrders',
    label: 'Bán chạy',
  },
  {
    value: 'id',
    label: 'Mới nhất',
  },
  {
    value: 'rating',
    label: 'Yêu thích',
  },
];

const defaultSize = 15;
const defaultMore = 5;

const OrderList = () => {
  const [orderBy, setOrderBy] = useState(orderGroup[0].value);
  const { data, isLoading, isFetching, isSuccess, isError, refetch } = useGetBooksQuery({
    sortBy: orderBy,
    sortDir: "desc"
  }, { skip: !orderBy });

  //Change order tab
  const handleChangeOrder = (e, newValue) => {
    if (newValue !== null) { setOrderBy(newValue) }
  };

  return (
    <>
      <br />
      <CustomDivider>Sản phẩm xếp theo</CustomDivider>
      <LazyLoadComponent>
        <Suspense fallback={
          <>
            <ToggleGroupContainer><Tabs /></ToggleGroupContainer>
            <ProductsSliderPlaceholder/>
          </>
        }>
          <ToggleGroupContainer>
            <Tabs
              variant="scrollable"
              value={orderBy}
              onChange={handleChangeOrder}
            >
              {(!orderGroup?.length ? Array.from(new Array(4)) : orderGroup)?.map((order, index) => (
                <CustomTab key={`${order?.id}-${index}`} label={order?.label ?? 'Đang cập nhật'} value={order?.value ?? ''} />
              ))}
            </Tabs>
          </ToggleGroupContainer>
          <ProductsSlider {...{ isLoading, isFetching, data, isSuccess, isError }} />
        </Suspense>
      </LazyLoadComponent>
      <ButtonContainer>
        {isError ?
          <Button
            variant="outlined"
            color="error"
            size="medium"
            sx={{ width: '200px' }}
            endIcon={<Replay sx={{ marginRight: '-10px' }} />}
            onClick={refetch}
          >
            Tải lại
          </Button>
          :
          <Link to={`/filters?sortBy=${orderBy}`}>
            <Button
              variant="contained"
              color="primary"
              size="medium"
              sx={{ width: '200px' }}
              endIcon={<ExpandMore sx={{ marginRight: '-10px' }} />}
            >
              Xem thêm
            </Button>
          </Link>
        }
      </ButtonContainer>
    </>
  )
}

const CateList = () => {
  const [randomCateIds, setRandomCateIds] = useState([]);
  const [currCate, setCurrCate] = useState(null);

  //Fetch categories & books
  const { data: cates, isLoading: loadCates, isSuccess: doneCates } = useGetCategoriesQuery();
  const { data, isLoading, isFetching, isSuccess, isError, refetch } = useGetBooksQuery({ cateId: currCate }, { skip: !currCate });

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

  //Change cate tab
  const handleChangeCate = (e, newValue) => {
    if (newValue !== null) { setCurrCate(newValue) }
  };

  let cateTabs;

  if (doneCates) {
    const { entities } = cates;

    cateTabs = (!randomCateIds?.length ? Array.from(new Array(4)) : randomCateIds)?.map((id, index) => {
      let cate;
      if (id) cate = entities[id];

      return (
        <CustomTab key={`catetab-${id}-${index}`} label={cate?.categoryName ?? 'Đang cập nhật'} value={id ?? ''} />
      )
    })
  }

  return (
    <>
      <br />
      <CustomDivider>Sản phẩm theo danh mục</CustomDivider>
      <LazyLoadComponent>
        <Suspense fallback={
          <>
            <ToggleGroupContainer><Tabs /></ToggleGroupContainer>
            <ProductsSliderPlaceholder/>
          </>
        }>
          <ToggleGroupContainer>
            <Tabs
              variant="scrollable"
              value={currCate ?? ''}
              onChange={handleChangeCate}
            >
              {cateTabs}
            </Tabs>
          </ToggleGroupContainer>
          <ProductsSlider {...{ isLoading, isFetching, data, isSuccess, isError }} />
        </Suspense>
      </LazyLoadComponent>
      <ButtonContainer>
        {isError ?
          <Button
            variant="outlined"
            color="error"
            size="medium"
            sx={{ width: '200px' }}
            endIcon={<Replay sx={{ marginRight: '-10px' }} />}
            onClick={refetch}
          >
            Tải lại
          </Button>
          :
          <Link to={`/filters?cateId=${currCate}`}>
            <Button
              variant="contained"
              color="primary"
              size="medium"
              sx={{ width: '200px' }}
              endIcon={<ExpandMore sx={{ marginRight: '-10px' }} />}
            >
              Xem thêm
            </Button>
          </Link>
        }
      </ButtonContainer>
    </>
  )
}

const Home = () => {
  //Initial value
  const navigate = useNavigate();
  const [pagination, setPagination] = useState({
    currPage: 0,
    pageSize: defaultSize,
    isMore: true,
  })

  //Fetch books
  const { data, isLoading, isSuccess, isError } = useGetBooksQuery({
    page: pagination?.currPage,
    size: pagination?.pageSize,
    loadMore: pagination?.isMore
  });
  const { data: randomBooks, isLoading: loadRandom, isFetching: fetchRandom, isSuccess: doneRandom, isError: errorRandom, refetch: refetchRandom } = useGetRandomBooksQuery({ amount: 10 });

  //Set title
  useTitle('RING! - Bookstore');

  //Show more
  const handleShowMore = () => {
    if (pagination?.currPage >= 5) {
      navigate('/filters');
    } else {
      let nextPage = (data?.ids?.length / defaultMore);
      setPagination({ ...pagination, currPage: nextPage, pageSize: defaultMore })
    }
  }

  return (
    <Wrapper>
      <Slider />
      <Categories />
      <Grid sx={{ mb: 3, mt: -1 }} container spacing={4}>
        <Grid size={12}>
          <br />
          <CustomDivider>Sản phẩm mới nhất</CustomDivider>
          <Products {...{ isLoading, data, isSuccess, isError }} />
          <ButtonContainer>
            {isError ?
              <Button
                variant="outlined"
                color="error"
                size="medium"
                sx={{ width: '200px' }}
                endIcon={<Replay sx={{ marginRight: '-10px' }} />}
                onClick={refetch}
              >
                Tải lại
              </Button>
              :
              <Button
                variant="contained"
                color="primary"
                size="medium"
                sx={{ width: '200px' }}
                onClick={handleShowMore}
                endIcon={<ExpandMore sx={{ marginRight: '-10px' }} />}
              >
                Xem thêm
              </Button>
            }
          </ButtonContainer>
          <OrderList />
          <CateList />
          <br />
          <CustomDivider>Có thể bạn sẽ thích</CustomDivider>
          <LazyLoadComponent>
            <Suspense fallback={<ProductsSliderPlaceholder/>}>
              <ProductsSlider {...{ isLoading: loadRandom, isFetching: fetchRandom, data: randomBooks, isSuccess: doneRandom, isError: errorRandom }} />
            </Suspense>
          </LazyLoadComponent>
          <ButtonContainer>
            {isError ?
              <Button
                variant="outlined"
                color="error"
                size="medium"
                sx={{ width: '200px' }}
                endIcon={<Replay sx={{ marginRight: '-10px' }} />}
                onClick={refetchRandom}
              >
                Tải lại
              </Button>
              :
              <Button
                variant="contained"
                color="primary"
                size="medium"
                sx={{ width: '200px' }}
                endIcon={<Replay sx={{ marginRight: '-10px' }} />}
                onClick={refetchRandom}
              >
                Làm mới
              </Button>
            }
          </ButtonContainer>
        </Grid>
      </Grid>
    </Wrapper>
  )
}

export default Home