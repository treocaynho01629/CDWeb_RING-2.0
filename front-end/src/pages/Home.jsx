import styled from 'styled-components';
import { useState, useEffect, lazy, Suspense, useRef } from "react";
import { alpha, Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useGetCategoriesQuery } from '../features/categories/categoriesApiSlice';
import { useGetBooksQuery, useGetRandomBooksQuery } from '../features/books/booksApiSlice';
import { LazyLoadComponent } from 'react-lazy-load-image-component';
import { Category, ExpandMore, GpsNotFixed, KeyboardArrowRight, Replay, ThumbUpAlt } from '@mui/icons-material';
import { CustomTab, CustomTabs } from '../components/custom/CustomTabs';
import useTitle from '../hooks/useTitle';
import Categories from '../components/other/Categories';
import Suggest from '../components/other/Suggest';
import Products from '../components/product/Products';
import CustomDivider from '../components/custom/CustomDivider';
import CustomPlaceholder from '../components/custom/CustomPlaceholder';
import BannersSlider from '../components/other/BannersSlider';
import Publishers from '../components/other/Publishers';
import { useGetPublishersQuery } from '../features/publishers/publishersApiSlice';

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
  font-size: 18px;
  font-weight: 450;
  background-color: ${props => props.theme.palette.background.default};
  display: flex;
  align-items: center;
  justify-content: space-between;
  white-space: nowrap;
  padding: 10px 15px;
  margin-bottom: 5px;
`

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`

const MoreButton = styled.span`
  font-size: 12px;
  font-weight: 450;
  color: ${props => props.theme.palette.info.light};
  cursor: pointer;
  display: flex;
  align-items: center;

  &.error {
    color: ${props => props.theme.palette.error.main};
  }
`

const ContainerTitle = styled.span`
  font-size: 18px;
  font-weight: 450;
  display: flex;
  align-items: center;
  color: ${props => props.theme.palette.primary.dark};

  &.error {
    color: ${props => props.theme.palette.error.main};
  }
`

const Container = styled.div`
  position: relative;
  margin: 10px 0;
`

const SaleContainer = styled.div`
  position: relative;
  padding: 20px 0;
  margin: 10px 0;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 50%;
    width: 100vw;
    height: 100%;
    transform: translateX(-50%);
    border: 1px solid ${props => props.theme.palette.primary.light};
    background-color: ${props => alpha(props.theme.palette.primary.light, 0.1)};
  }
`
//#endregion

const orderTabs = [
  {
    filters: { sortBy: 'totalOrders' },
    label: 'Bán chạy',
  },
  {
    filters: { sortBy: 'createdDate' },
    label: 'Mới nhất',
  },
  {
    filters: { sortBy: 'rating' },
    label: 'Yêu thích',
  },
];

const defaultSize = 15;
const defaultMore = 5;

const cateToTabs = (cate) => {
  return (cate?.children?.flatMap(function (child, index) {
    return {
      filters: { cateId: child?.id },
      label: child?.categoryName,
      slug: child?.slug
    }
  }))
}

const ProductsList = ({ tabs, value, title }) => {
  const listRef = useRef(null); //Scroll ref
  const [tabValue, setTabValue] = useState(0);
  const slug = tabs ? tabs[tabValue]?.slug : null;
  const filters = tabs ? { ...tabs[tabValue]?.filters, sortDir: 'desc' } : value || {};
  const { data, isLoading, isFetching, isSuccess, isError, refetch } = useGetBooksQuery(
    tabs || value ? filters : {},
    { skip: !tabs && !value }
  );

  const handleChangeValue = (e, newValue) => {
    if (newValue !== null) { 
      setTabValue(newValue);
      listRef?.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); 
    }
  };
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
      <Suspense fallback={<CustomPlaceholder sx={{ height: '100px' }} />}>
        <TitleContainer ref={listRef}>
          {title}
          {isError ?
            <MoreButton className="error" onClick={() => refetch()}>
              Tải lại <Replay />
            </MoreButton>
            :
            <Link to={`/filters${slug ? `/${slug}` : ''}?${getParams()}`}>
              <MoreButton>
                Xem tất cả <KeyboardArrowRight />
              </MoreButton>
            </Link>
          }
        </TitleContainer>
        {tabs &&
          <ToggleGroupContainer>
            <CustomTabs
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
        }
        <ProductsSlider {...{ isLoading, isFetching, data, isSuccess, isError }} />
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
  const [pubs, setPubs] = useState([]);
  const [pagination, setPagination] = useState({
    currPage: 0,
    pageSize: defaultSize,
    isMore: true,
  })

  //Fetch
  const { data: categories, isLoading: loadCates, isSuccess: doneCates } = useGetCategoriesQuery({ include: 'children' });
  const { data: publishers, isLoading: loadPubs, isSuccess: donePubs } = useGetPublishersQuery();
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

  useEffect(() => {
    if (!loadPubs && donePubs && publishers) {
      const { entities, ids } = publishers;
      let pubsList = ids?.map((id, index) => {
        const pub = entities[id];
        return ({ filters: { pubId: [id + ''] }, label: pub?.pubName });
      })
      setPubs(pubsList);
    }
  }, [publishers]);

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
      <CustomDivider>TIÊU ĐIỂM</CustomDivider>
      <SaleContainer>
        <ProductsList {...{
          value: { sortBy: 'discount', sortDir: 'desc' },
          title: <ContainerTitle className="error"><ThumbUpAlt />&nbsp;Top Khuyến Mãi</ContainerTitle>
        }} />
      </SaleContainer>
      <ProductsList {...{
        value: { keyword: 'toriyama' },
        title: <ContainerTitle><GpsNotFixed />&nbsp;Akira Toriyama</ContainerTitle>
      }} />
      <Container>
        <TitleContainer>
          <ContainerTitle><Category />&nbsp;Danh mục sản phẩm</ContainerTitle>
        </TitleContainer>
        <Categories />
      </Container>
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
      <ProductsList {...{ tabs: orderTabs, title: 'Trending' }} />
      <p>TOP STUFF</p>
      <ProductsList {...{ value: { cateId: cates[0]?.id }, title: cates[0]?.categoryName }} />
      <ProductsList {...{ tabs: pubs || [], title: 'Thương hiệu nổi bật' }} />
      <ProductsList {...{ tabs: pubs || [] }} />
      <Container>
        <TitleContainer>
          <ContainerTitle><Category />&nbsp;Nhà xuất bản</ContainerTitle>
        </TitleContainer>
        <Publishers />
      </Container>
      {catesWithChilds.map((cate, index) => {
        if (index < catesWithChilds?.length - 1) {
          const tabs = cateToTabs(catesWithChilds[index]);
          const title = catesWithChilds[index]?.categoryName;

          return (<ProductsList {...{ tabs, title }} />)
        }
      })}
      <ProductsList {...{ tabs: orderTabs, title: 'Other Cate' }} />
      <ProductsList {...{
        tabs: cateToTabs(catesWithChilds[catesWithChilds.length - 1]),
        title: catesWithChilds[catesWithChilds.length - 1]?.categoryName
      }} />
      <RandomList />
    </Wrapper>
  )
}

export default Home