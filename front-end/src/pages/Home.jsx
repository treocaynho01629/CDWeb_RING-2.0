import styled from '@emotion/styled';
import { useState, useEffect, lazy, Suspense, useRef } from "react";
import { alpha, Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useGetCategoriesQuery } from '../features/categories/categoriesApiSlice';
import { useGetBooksQuery, useGetRandomBooksQuery } from '../features/books/booksApiSlice';
import { Category, ExpandMore, GpsNotFixed, KeyboardArrowRight, Replay, ThumbUpAlt } from '@mui/icons-material';
import { CustomTab, CustomTabs } from '../components/custom/CustomTabs';
import { useGetPublishersQuery } from '../features/publishers/publishersApiSlice';
import { orderTabs } from '../ultils/suggest';
import useTitle from '../hooks/useTitle';
import Suggest from '../components/other/Suggest';
import CustomDivider from '../components/custom/CustomDivider';
import CustomPlaceholder from '../components/custom/CustomPlaceholder';
import BannersSlider from '../components/other/BannersSlider';
import LazyLoad from 'react-lazyload';

const ProductsSlider = lazy(() => import('../components/product/ProductsSlider'));
const BigProductsSlider = lazy(() => import('../components/product/BigProductsSlider'));
const Products = lazy(() => import('../components/product/Products'));
const Publishers = lazy(() => import('../components/other/Publishers'));
const Categories = lazy(() => import('../components/other/Categories'));

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
    width: 99vw;
    height: 100%;
    transform: translateX(-50%);
    border: 1px solid ${props => props.theme.palette.primary.light};
    background-color: ${props => alpha(props.theme.palette.primary.light, 0.1)};
    border-left: none;
    border-right: none;
  }
`
//#endregion

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

const Loadable = ({ children }) => (
  <LazyLoad height={200} offset={100}>
    <Suspense fallback={<CustomPlaceholder sx={{ height: '300px' }} />}>
      {children}
    </Suspense>
  </LazyLoad>
)

const ProductsList = ({ tabs, value, title }) => {
  const listRef = useRef(null); //Scroll ref
  const [tabValue, setTabValue] = useState(0);
  const slug = tabs ? tabs[tabValue]?.slug : null;
  const filters = tabs ? { ...tabs[tabValue]?.filters, sortDir: 'desc' } : value || {};
  const { data, isLoading, isFetching, isSuccess, isError, refetch } = useGetBooksQuery(
    tabs || value ? filters : {},
    { skip: (!tabs && !value) }
  );

  const handleChangeValue = (e, newValue) => {
    if (newValue !== null) {
      setTabValue(newValue);
      listRef?.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };
  const getParams = () => {
    const { sortBy, keyword, cateId, rating, amount, pubId, type, shopId, sellerId } = filters || {};

    const params = new URLSearchParams();
    if (sortBy) params.append('sort', sortBy);
    if (keyword) params.append('q', keyword);
    if (cateId) params.append('cate', cateId);
    if (rating) params.append('rating', rating);
    if (amount) params.append('amount', amount);
    if (type) params.append('type', type);
    if (shopId) params.append('shop', shopId);
    if (sellerId) params.append('sellerId', sellerId);
    if (pubId) params.append('pubs', pubId);
    return params.toString();
  }

  return (
    <>
      <TitleContainer ref={listRef}>
        {title}
        {isError ?
          <MoreButton className="error" onClick={() => refetch()}>
            Tải lại <Replay />
          </MoreButton>
          :
          <Link to={`/store${slug ? `/${slug}` : ''}?${getParams()}`}>
            <MoreButton>
              Xem tất cả <KeyboardArrowRight />
            </MoreButton>
          </Link>
        }
      </TitleContainer>
      {
        tabs &&
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
    </>
  )
}

const RandomList = () => {
  const { data, isLoading, isFetching, isSuccess, isError, refetch } = useGetRandomBooksQuery({ amount: 10 });
  return (
    <>
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
    </>
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
      navigate('/store');
    } else {
      const nextPage = (data?.ids?.length / defaultMore);
      if (nextPage >= 1 && nextPage % 1 != 0) setPagination({ ...pagination, currPage: nextPage, pageSize: defaultMore });
    }
  }

  return (
    <Wrapper>
      <BannersSlider />
      <Suggest />
      <CustomDivider>TIÊU ĐIỂM</CustomDivider>
      <SaleContainer>
        <Loadable key={'top'}>
          <ProductsList key={'top'}
            {...{
              value: { sortBy: 'discount', sortDir: 'desc' },
              title: <ContainerTitle className="error"><ThumbUpAlt />&nbsp;Top Khuyến Mãi</ContainerTitle>
            }} />
        </Loadable>
      </SaleContainer>
      <Loadable key={'toriyama'}>
        <ProductsList {...{
          value: { keyword: 'toriyama' },
          title: <ContainerTitle><GpsNotFixed />&nbsp;Akira Toriyama</ContainerTitle>
        }} />
      </Loadable>
      <Container>
        <TitleContainer>
          <ContainerTitle><Category />&nbsp;Danh mục sản phẩm</ContainerTitle>
        </TitleContainer>
        <Loadable key={'cates'}>
          <Categories />
        </Loadable>
      </Container>
      <CustomDivider>Sản phẩm mới nhất</CustomDivider>
      <Loadable key={'hot'}>
        <>
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
        </>
      </Loadable>
      <Loadable key={'trending'}>
        <ProductsList key={'trending'} {...{ tabs: orderTabs, title: 'Trending' }} />
      </Loadable>
      <p>TOP STUFF</p>
      <Loadable key={'categories'}>
        <ProductsList key={'categories'} {...{ value: { cateId: cates[0]?.id }, title: cates[0]?.categoryName }} />
      </Loadable>
      <Loadable key={'publishers'}>
        <ProductsList key={'publishers'} {...{ tabs: pubs.slice(0, 4) || [], title: 'Thương hiệu nổi bật' }} />
      </Loadable>
      <Loadable key={'publishers2'}>
        <ProductsList key={'publishers2'} {...{ tabs: pubs.slice(5, 9) || [] }} />
      </Loadable>
      <Container>
        <TitleContainer>
          <ContainerTitle><Category />&nbsp;Nhà xuất bản</ContainerTitle>
        </TitleContainer>
        <Loadable key={'pubs'}>
          <Publishers />
        </Loadable>
      </Container>
      {catesWithChilds.map((cate, index) => {
        if (index < catesWithChilds?.length - 1) {
          const tabs = cateToTabs(catesWithChilds[index]);
          const title = catesWithChilds[index]?.categoryName;

          return (
            <Loadable key={`cate-${index}`}>
              <ProductsList key={`cate-${index}`} {...{ tabs, title }} />
            </Loadable>
          )
        }
      })}
      <Loadable key={'products'}>
        <BigProductsSlider />
      </Loadable>
      <Loadable key={'categories2'} >
        <ProductsList key={'categories2'} {...{ tabs: orderTabs, title: 'Other Cate' }} />
      </Loadable>
      <Loadable key={'categories3'}>
        <ProductsList key={'categories3'} {...{
          tabs: cateToTabs(catesWithChilds[catesWithChilds.length - 1]),
          title: catesWithChilds[catesWithChilds.length - 1]?.categoryName
        }} />
      </Loadable>
      <Loadable key={'random'} >
        <RandomList />
      </Loadable>
    </Wrapper>
  )
}

export default Home