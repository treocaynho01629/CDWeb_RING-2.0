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

const orderTabs = [
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

const cateToTabs = (cate) => {
  console.log('voke')
  return (cate?.children?.flatMap(function (child, index) {
    return {
      filter: { cateId: child?.id },
      label: child?.categoryName,
      slug: child?.slug
    }
  }))
}

const ProductsList = ({ tabs, title }) => {
  const [tabValue, setTabValue] = useState(0);
  const slug = tabs ? tabs[tabValue].slug : null;
  const filters = tabs ? { ...tabs[tabValue].filter, sortDir: 'desc' } : {};
  const { data, isLoading, isFetching, isSuccess, isError, refetch } = useGetBooksQuery(
    tabs ? filters : {},
    { skip: !tabs }
  );

  const handleChangeValue = (e, newValue) => { if (newValue !== null) { setTabValue(newValue) } };
  // const getParams = () => {
  //   const { sortBy, keyword, cateId, rating, amount, pubId, type, shopId, sellerId, value } = filters || {};

  //   const params = new URLSearchParams();
  //   if (sortBy) params.append('sortBy', sortBy);
  //   if (keyword) params.append('keyword', keyword);
  //   if (cateId) params.append('cateId', cateId);
  //   if (rating) params.append('rating', rating);
  //   if (amount) params.append('amount', amount);
  //   if (type) params.append('type', type);
  //   if (shopId) params.append('shopId', shopId);
  //   if (sellerId) params.append('sellerId', sellerId);
  //   if (pubId?.length) params.append('pubId', pubId);
  //   if (value) {
  //     params.append('fromRange', value[0]);
  //     params.append('toRange', value[1]);
  //   }

  //   return params.toString();
  // }

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
        {/* <ButtonContainer>
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
            : tabs && <Link to={`/filters${slug ? `/${slug}` : ''}?${getParams()}`}>
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
        </ButtonContainer> */}
      </Suspense>
    </LazyLoadComponent>
  )
}

const RandomList = () => {
  const { data, isLoading, isFetching, isSuccess, isError, refetch } = useGetRandomBooksQuery({ amount: 10 });
  return (
    <LazyLoadComponent>
      <Suspense fallback={<CustomPlaceholder sx={{ height: '50px' }} />}>
        <CustomDivider>Có thể bạn sẽ thích</CustomDivider>
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
            <Button
              variant="contained"
              color="primary"
              size="medium"
              sx={{ width: '200px' }}
              endIcon={<Replay sx={{ marginRight: '-10px' }} />}
              onClick={() => refetch()}
            >
              Làm mới
            </Button>
          }
        </ButtonContainer>
      </Suspense>
    </LazyLoadComponent>
  )
}

const Home = () => {
  //Initial value
  const navigate = useNavigate();
  const [catesWithChilds, setCatesWithChilds] = useState([]);
  const [cates, setCates] = useState([]);
  const [pagination, setPagination] = useState({
    currPage: 0,
    pageSize: defaultSize,
    isMore: true,
  })

  //Fetch
  const { data: categories, isLoading: loadCates, isSuccess: doneCates } = useGetCategoriesQuery({ include: 'children' });
  const { data, isLoading, isSuccess, isError } = useGetBooksQuery({
    page: pagination?.currPage,
    size: pagination?.pageSize,
    loadMore: pagination?.isMore
  });


  //Load
  useEffect(() => {
    if (!loadCates && doneCates && categories) {
      const { entities, ids } = categories;
      let catesWithChildren = [];
      let cates = [];

      ids.forEach(id => {
        const cate = entities[id];
        cate?.children?.length ? catesWithChildren.push(cate) : cates.push(cate);
      });

      setCatesWithChilds(catesWithChildren);
      setCates(cates);
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
      <ProductsList {...{ tabs: orderTabs, title: 'Sale' }} />
      <ProductsList {...{ tabs: [{ filter: { keyword: 'toriyama' }, label: 'Akira Toriyama' }] }} />
      <Categories />
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
      <ProductsList {...{ tabs: orderTabs, title: 'Test' }} />
      <p>TOP STUFF</p>
      <ProductsList {...{ tabs: orderTabs, title: 'Pub' }} />
      <ProductsList {...{ tabs: orderTabs, title: 'Pub2' }} />
      <p>PUB STUFF</p>
      <ProductsList {...{ tabs: cateToTabs(catesWithChilds[0]), title: catesWithChilds[0]?.categoryName }} />
      <ProductsList {...{ tabs: cateToTabs(catesWithChilds[1]), title: catesWithChilds[1]?.categoryName }} />
      <ProductsList {...{ tabs: cateToTabs(catesWithChilds[2]), title: catesWithChilds[2]?.categoryName }} />
      <ProductsList {...{ tabs: orderTabs, title: 'Other Cate' }} />
      <RandomList />
    </Wrapper>
  )
}

export default Home