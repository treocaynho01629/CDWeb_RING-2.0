import styled from 'styled-components';
import { useState, useEffect, lazy, Suspense } from "react";
import { Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useGetCategoriesQuery } from '../features/categories/categoriesApiSlice';
import { useGetBooksQuery, useGetRandomBooksQuery } from '../features/books/booksApiSlice';
import { LazyLoadComponent } from 'react-lazy-load-image-component';
import { ExpandMore, Replay } from '@mui/icons-material';
import { CustomTab, CustomTabs } from '../components/custom/CustomTabs';
import useTitle from '../hooks/useTitle';
import Categories from '../components/other/Categories';
import Suggest from '../components/other/Suggest';
import Products from '../components/product/Products';
import CustomDivider from '../components/custom/CustomDivider';
import CustomPlaceholder from '../components/custom/CustomPlaceholder';
import BannersSlider from '../components/other/BannersSlider';

const ProductsSlider = lazy(() => import('../components/product/ProductsSlider'));

//#region styled
const Wrapper = styled.div`
  ${props => props.theme.breakpoints.down("md")} {
    margin-top: -${props => props.theme.mixins.toolbar.minHeight + 11}px;
  }
`

const ToggleGroupContainer = styled.div`
  width: 100%;
  background-color: ${props => props.theme.palette.background.default};
  border-bottom: 1px solid ${props => props.theme.palette.divider};
  white-space: nowrap;
  padding: 0 10px;
  position: sticky; 
  top: ${props => props.theme.mixins.toolbar.minHeight + 16.5}px;
  z-index: 1;

  ${props => props.theme.breakpoints.down("sm")} {
      top: ${props => props.theme.mixins.toolbar.minHeight + 4.5}px;
  }

  &:before{
      content: "";
      position: absolute;
      left: 0;
      top: -16px;
      width: 100%;
      height: calc(100% + 16px);
      background-color: ${props => props.theme.palette.background.default};
      z-index: -1;
  }

  &::after{
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: ${props => props.theme.palette.action.hover};
      z-index: -1;
  }
`

const TitleContainer = styled.div`
  position: relative;
  width: 100%;
  border-bottom: 1px solid ${props => props.theme.palette.divider};
  display: flex;
  align-items: center;
  justify-content: space-between;
  white-space: nowrap;
  padding: 0 10px;
  z-index: 2;
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

const orderTest = [
  {
    filter: { sortBy: 'totalOrders' },
    label: 'Bán chạy',
  },
  {
    filter: { sortBy: 'createdDate' },
    label: 'Mới nhất',
  },
  {
    filter: { sortBy: 'rating' },
    label: 'Yêu thích',
  },
];

const defaultSize = 15;
const defaultMore = 5;

let sliderPlaceholder = (
  <CustomPlaceholder sx={{ height: '50px' }} />
)

const ProductsList = ({ tabs, title }) => {
  const [tabValue, setTabValue] = useState(0);
  const filters = tabs ? { ...tabs[tabValue].filter, sortDir: 'desc' } : {}
  const { data, isLoading, isFetching, isSuccess, isError, refetch } = useGetBooksQuery(
    tabs ? filters : {},
    { skip: !tabs }
  );

  const handleChangeValue = (e, newValue) => { if (newValue !== null) { setTabValue(newValue) } };
  const getParams = () => {
    const { sortBy, keyword, cateId, rating, amount, pubId, type, shopId, sellerId, value } = filters || {};

    const params = new URLSearchParams();
    if (sortBy) params.append('sortBy', sortBy);
    if (keyword) params.append('keyword', keyword);
    if (cateId) params.append('cateId', cateId);
    if (rating) params.append('rating', rating);
    if (amount) params.append('amount', amount);
    if (type) params.append('type', type);
    if (shopId) params.append('shopId', shopId);
    if (sellerId) params.append('sellerId', sellerId);
    if (pubId?.length) params.append('pubId', pubId);
    if (value) {
      params.append('fromRange', value[0]);
      params.append('toRange', value[1]);
    }

    return params.toString();
  }

  return (
    <LazyLoadComponent>
      <Suspense fallback={<CustomPlaceholder sx={{ height: '50px' }} />}>
        <TitleContainer>{title}</TitleContainer>
        <ToggleGroupContainer>
          <CustomTabs
            variant="scrollable"
            value={tabValue}
            onChange={handleChangeValue}
          >
            {(!tabs?.length ? Array.from(new Array(1)) : tabs)?.map((tab, index) => (
              <CustomTab
                key={`${title}-tabs-${tab?.label}-${index}`}
                label={tab?.label ?? 'Đang cập nhật'}
                value={index ?? ''}
              />
            ))}
          </CustomTabs>
        </ToggleGroupContainer>
        <ProductsSlider {...{ isLoading, isFetching, data, isSuccess, isError }} />
        <ButtonContainer>
          {isError ?
            <Button
              variant="outlined"
              color="error"
              size="medium"
              sx={{ width: '200px' }}
              endIcon={<Replay sx={{ marginRight: '-10px' }} />}
              onClick={() => refetch()}
            >
              Tải lại
            </Button>
            : tabs && <Link to={`/filters?${getParams()}`}>
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
      </Suspense>
    </LazyLoadComponent>
  )
}

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
    <LazyLoadComponent>
      <Suspense fallback={sliderPlaceholder}>
        <TitleContainer>Sản phẩm xếp theo</TitleContainer>
        <ToggleGroupContainer>
          <CustomTabs
            variant="scrollable"
            value={orderBy}
            onChange={handleChangeOrder}
          >
            {(!orderGroup?.length ? Array.from(new Array(4)) : orderGroup)?.map((order, index) => (
              <CustomTab
                key={`${order?.id}-${index}`}
                label={order?.label ?? 'Đang cập nhật'}
                value={order?.value ?? ''}
              />
            ))}
          </CustomTabs>
        </ToggleGroupContainer>
        <ProductsSlider {...{ isLoading, isFetching, data, isSuccess, isError }} />
        <ButtonContainer>
          {isError ?
            <Button
              variant="outlined"
              color="error"
              size="medium"
              sx={{ width: '200px' }}
              endIcon={<Replay sx={{ marginRight: '-10px' }} />}
              onClick={() => refetch()}
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
      </Suspense>
    </LazyLoadComponent>
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
        <CustomTab
          key={`catetab-${id}-${index}`}
          label={cate?.categoryName ?? 'Đang cập nhật'}
          value={id ?? ''}
        />
      )
    })
  }

  return (
    <LazyLoadComponent>
      <Suspense fallback={sliderPlaceholder}>
        <CustomDivider>Sản phẩm theo danh mục</CustomDivider>
        <ToggleGroupContainer>
          <CustomTabs
            variant="scrollable"
            value={currCate ?? ''}
            onChange={handleChangeCate}
          >
            {cateTabs}
          </CustomTabs>
        </ToggleGroupContainer>
        <ProductsSlider {...{ isLoading, isFetching, data, isSuccess, isError }} />
        <ButtonContainer>
          {isError ?
            <Button
              variant="outlined"
              color="error"
              size="medium"
              sx={{ width: '200px' }}
              endIcon={<Replay sx={{ marginRight: '-10px' }} />}
              onClick={() => refetch()}
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
      </Suspense>
    </LazyLoadComponent>
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

  //Fetch
  const { data: categories, isLoading: loadCates, isSuccess: doneCates } = useGetCategoriesQuery();
  const { data, isLoading, isSuccess, isError } = useGetBooksQuery({
    page: pagination?.currPage,
    size: pagination?.pageSize,
    loadMore: pagination?.isMore
  });
  const { data: randomBooks, isLoading: loadRandom, isFetching: fetchRandom, isSuccess: doneRandom, isError: errorRandom, refetch: refetchRandom } = useGetRandomBooksQuery({ amount: 10 });

  //Load
  useEffect(() => {
    if (!loadCates && doneCates && categories) {
      const { entities, ids } = categories;
      let cates = [
        ids?.map((id, index) => {
          const cate = entities[id];

          return (
            <ProductContainer key={`${id}-${index}`}>
              <ProductSimple {...{ book, scrollPosition }} />
            </ProductContainer>
          )
        })
      ];


      let tempIds = [...ids];

      //Get 4 random cates
      let randomIds = (tempIds?.sort(() => 0.5 - Math.random()).slice(0, 4));
      setCurrCate(randomIds ? randomIds[0] : null);
      setRandomCateIds(randomIds);
    }
  }, [categories]);

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
      {/* <Slider /> */}
      <BannersSlider />
      <Suggest />
      <OrderList />
      <ProductsList {...{ tabs: orderTest, title: 'Test' }} />
      {/* <CustomDivider>Sản phẩm mới nhất</CustomDivider>
      <Products {...{ isLoading, data, isSuccess, isError }} />
      <ButtonContainer>
        {isError ?
          <Button
            variant="outlined"
            color="error"
            size="medium"
            sx={{ width: '200px' }}
            endIcon={<Replay sx={{ marginRight: '-10px' }} />}
            onClick={() => refetch()}
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
      <Categories />
      <CateList />
      <LazyLoadComponent>
        <Suspense fallback={sliderPlaceholder}>
          <CustomDivider>Có thể bạn sẽ thích</CustomDivider>
          <ProductsSlider {...{ isLoading: loadRandom, isFetching: fetchRandom, data: randomBooks, isSuccess: doneRandom, isError: errorRandom }} />
          <ButtonContainer>
            {isError ?
              <Button
                variant="outlined"
                color="error"
                size="medium"
                sx={{ width: '200px' }}
                endIcon={<Replay sx={{ marginRight: '-10px' }} />}
                onClick={() => refetchRandom()}
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
                onClick={() => refetchRandom()}
              >
                Làm mới
              </Button>
            }
          </ButtonContainer>
        </Suspense>
      </LazyLoadComponent> */}
    </Wrapper>
  )
}

export default Home