import styled from "@emotion/styled";
import { useState, useEffect, lazy, Suspense, useRef } from "react";
import { alpha, Button } from "@mui/material";
import { Link, useNavigate } from "react-router";
import { useGetCategoriesQuery } from "../features/categories/categoriesApiSlice";
import {
  useGetBooksQuery,
  useGetRandomBooksQuery,
} from "../features/books/booksApiSlice";
import {
  BarChart,
  Book,
  Bookmarks,
  Category,
  ExpandMore,
  GpsNotFixed,
  ImportContacts,
  KeyboardArrowRight,
  Replay,
  TableChart,
  ThumbUpAlt,
  TrendingUp,
} from "@mui/icons-material";
import { CustomTab, CustomTabs } from "../components/custom/CustomTabs";
import { useGetPublishersQuery } from "../features/publishers/publishersApiSlice";
import { useTitle } from "@ring/shared";
import { orderTabs } from "../ultils/suggest";
import Placeholder from "@ring/ui/Placeholder";
import Suggest from "../components/other/Suggest";
import CustomDivider from "../components/custom/CustomDivider";
import BannersSlider from "../components/other/BannersSlider";
import LazyLoad from "react-lazyload";

const ProductsSlider = lazy(
  () => import("../components/product/ProductsSlider")
);
const BigProductsSlider = lazy(
  () => import("../components/product/BigProductsSlider")
);
const Products = lazy(() => import("../components/product/Products"));
const Publishers = lazy(() => import("../components/other/Publishers"));
const Categories = lazy(() => import("../components/other/Categories"));
const ProductsTop = lazy(() => import("../components/product/ProductsTop"));

//#region styled
const Wrapper = styled.div`
  ${({ theme }) => theme.breakpoints.down("md")} {
    margin-top: -${({ theme }) => theme.mixins.toolbar.minHeight + 11}px;
  }
`;

const ToggleGroupContainer = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.palette.background.paper};
  border-bottom: 1px solid ${({ theme }) => theme.palette.divider};
  white-space: nowrap;
  padding: 0 10px;
  position: sticky;
  top: ${({ theme }) => theme.mixins.toolbar.minHeight + 16.5}px;
  z-index: 2;

  &.border {
    &::after {
      border-top: 0.5px solid ${({ theme }) => theme.palette.divider};
    }
  }

  ${({ theme }) => theme.breakpoints.down("sm")} {
    top: ${({ theme }) => theme.mixins.toolbar.minHeight + 4.5}px;
  }

  &:before {
    content: "";
    position: absolute;
    left: 0;
    top: -16px;
    width: 100%;
    height: calc(100% + 16px);
    background-color: ${({ theme }) => theme.palette.background.default};
    z-index: -1;
  }

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: ${({ theme }) => theme.palette.action.hover};
    z-index: -1;

    ${({ theme }) => theme.breakpoints.down("sm")} {
      border-left: none;
      border-right: none;
      border-top: none;
    }
  }
`;

const TitleContainer = styled.div`
  position: relative;
  width: 100%;
  font-size: 18px;
  font-weight: 450;
  background-color: ${({ theme }) => theme.palette.background.paper};
  border: 0.5px solid ${({ theme }) => theme.palette.divider};
  display: flex;
  align-items: center;
  justify-content: space-between;
  white-space: nowrap;
  padding: ${({ theme }) => `${theme.spacing(1.25)} ${theme.spacing(2)}`};
  z-index: 3;

  ${({ theme }) => theme.breakpoints.down("sm")} {
    border-left: none;
    border-right: none;
    margin-bottom: 0px;
    font-size: 16px;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: ${({ theme }) => theme.spacing(2.5)} 0;
`;

const MoreButton = styled.span`
  font-size: 12px;
  font-weight: 450;
  color: ${({ theme }) => theme.palette.info.light};
  cursor: pointer;
  display: flex;
  align-items: center;

  &.error {
    color: ${({ theme }) => theme.palette.error.main};
  }
`;

const ContainerTitle = styled.span`
  font-size: 18px;
  font-weight: 450;
  display: flex;
  align-items: center;
  color: ${({ theme, color }) =>
    theme.palette[color]?.main || theme.palette.text.primary};

  svg {
    color: inherit;
  }

  ${({ theme }) => theme.breakpoints.down("sm")} {
    font-size: 16px;
  }
`;

const Container = styled.div`
  margin: ${({ theme }) => theme.spacing(2)} 0;
  border: 0.5px solid ${({ theme }) => theme.palette.divider};
  background-color: ${({ theme }) => theme.palette.background.paper};

  ${TitleContainer} {
    border: none;
  }

  ${({ theme }) => theme.breakpoints.down("sm")} {
    border-left: none;
    border-right: none;
  }
`;

const SaleContainer = styled.div`
  position: relative;
  padding: ${({ theme }) => theme.spacing(2.5)} 0;
  margin: ${({ theme }) => theme.spacing(1)} 0;
  margin-bottom: ${({ theme }) => theme.spacing(4)};

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 50%;
    width: 99vw;
    height: 100%;
    transform: translateX(-50%);
    border: 1px solid ${({ theme }) => theme.palette.success.light};
    background-image: repeating-linear-gradient(
      45deg,
      ${({ theme }) => alpha(theme.palette.primary.main, 0.2)} 0,
      ${({ theme }) => alpha(theme.palette.primary.main, 0.2)} 10px,
      transparent 0,
      transparent 50%
    );
    background-size: 4em 4em;
    background-color: ${({ theme }) => alpha(theme.palette.success.light, 0.1)};
    border-left: none;
    border-right: none;
  }
`;
//#endregion

const defaultSize = 15;
const defaultMore = 5;

const cateToTabs = (cate) => {
  return cate?.children?.flatMap(function (child, index) {
    return {
      filters: { cateId: child?.id },
      label: child?.name,
      slug: child?.slug,
    };
  });
};

const Loadable = ({ children }) => (
  <LazyLoad offset={100} placeholder={<Placeholder sx={{ height: 300 }} />}>
    <Suspense fallback={null}>{children}</Suspense>
  </LazyLoad>
);

const SaleList = () => {
  const { data, isLoading, isFetching, isSuccess, isError, refetch } =
    useGetBooksQuery({ sortBy: "discount", sortDir: "desc" });

  return (
    <>
      <TitleContainer>
        <ContainerTitle color="error">
          <ThumbUpAlt />
          &nbsp;Top Khuyến Mãi
        </ContainerTitle>
        {isError ? (
          <MoreButton className="error" onClick={() => refetch()}>
            Tải lại <Replay />
          </MoreButton>
        ) : (
          <Link to={"/store?sort=discount&dir=desc"}>
            <MoreButton>
              Xem tất cả <KeyboardArrowRight />
            </MoreButton>
          </Link>
        )}
      </TitleContainer>
      <ProductsSlider
        {...{ isLoading, isFetching, data, isSuccess, isError }}
      />
    </>
  );
};

const ProductsList = ({ tabs, value, title }) => {
  const listRef = useRef(null); //Scroll ref
  const [tabValue, setTabValue] = useState(0); //Tab

  //Products
  const filters = tabs
    ? { ...tabs[tabValue]?.filters, sortDir: "desc" }
    : value || {};
  const { data, isLoading, isFetching, isSuccess, isError, refetch } =
    useGetBooksQuery(tabs || value ? filters : {}, { skip: !tabs && !value });

  const handleChangeValue = (e, newValue) => {
    if (newValue !== null) {
      setTabValue(newValue);
      listRef?.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  };
  const getParams = () => {
    const {
      sortBy,
      keyword,
      cateId,
      rating,
      amount,
      pubIds,
      type,
      shopId,
      sellerId,
    } = filters || {};

    const params = new URLSearchParams();
    if (sortBy) params.append("sort", sortBy);
    if (keyword) params.append("q", keyword);
    if (cateId) params.append("cate", cateId);
    if (rating) params.append("rating", rating);
    if (amount) params.append("amount", amount);
    if (type) params.append("type", type);
    if (shopId) params.append("shop", shopId);
    if (sellerId) params.append("sellerId", sellerId);
    if (pubIds) params.append("pubs", pubIds);
    return params.toString();
  };

  const slug = tabs ? tabs[tabValue]?.slug : null;

  return (
    <Container>
      {title && (
        <TitleContainer ref={listRef}>
          {title}
          {isError ? (
            <MoreButton className="error" onClick={() => refetch()}>
              Tải lại <Replay />
            </MoreButton>
          ) : (
            <Link to={`/store${slug ? `/${slug}` : ""}?${getParams()}`}>
              <MoreButton>
                Xem tất cả <KeyboardArrowRight />
              </MoreButton>
            </Link>
          )}
        </TitleContainer>
      )}
      {tabs && (
        <ToggleGroupContainer className={title ? "" : "border"}>
          <CustomTabs
            value={tabValue}
            onChange={handleChangeValue}
            scrollButtons="auto"
          >
            {(!tabs?.length ? [...Array(1)] : tabs)?.map((tab, index) => (
              <CustomTab
                key={`${title}-tabs-${tab?.label}-${index}`}
                label={tab?.label ?? "Đang cập nhật"}
                value={index ?? ""}
              />
            ))}
          </CustomTabs>
        </ToggleGroupContainer>
      )}
      <ProductsSlider
        key={tabValue}
        {...{ isLoading, isFetching, data, isSuccess, isError }}
      />
    </Container>
  );
};

const RandomList = () => {
  const { data, isLoading, isFetching, isSuccess, isError, refetch } =
    useGetRandomBooksQuery({ amount: 10 });
  return (
    <Container>
      <ProductsSlider
        {...{ isLoading, isFetching, data, isSuccess, isError }}
      />
      <ButtonContainer>
        {isError ? (
          <Button
            variant="outlined"
            color="error"
            size="medium"
            sx={{ width: 200 }}
            endIcon={<Replay sx={{ marginRight: "-10px" }} />}
            onClick={() => refetch()}
          >
            Tải lại
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            size="medium"
            sx={{ width: 200 }}
            endIcon={<Replay sx={{ marginRight: "-10px" }} />}
            onClick={() => refetch()}
          >
            Làm mới
          </Button>
        )}
      </ButtonContainer>
    </Container>
  );
};

const TopList = ({ categories }) => {
  const listSize = 5;
  const listRef = useRef(null); //Scroll ref
  const [tabValue, setTabValue] = useState(categories?.ids[0] ?? null); //Tab

  //Products
  const { data, isLoading, isFetching, isSuccess, isError, refetch } =
    useGetBooksQuery(
      {
        cateId: tabValue,
        size: listSize,
        withDesc: true,
        sortBy: "totalOrders",
        sortDir: "desc",
      },
      { skip: !categories }
    );

  useEffect(() => {
    setTabValue(categories?.ids[0] ?? null);
  }, [categories]);

  const handleChangeValue = (e, newValue) => {
    if (newValue !== null) {
      setTabValue(newValue);
      listRef?.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  };

  let tabs;

  if (categories) {
    const { ids, entities } = categories;

    tabs = ids?.length ? (
      ids?.map((id, index) => {
        const cate = entities[id];

        return (
          <CustomTab
            key={`top-tab-${id}-${index}`}
            label={cate?.name ?? "Đang cập nhật"}
            value={id ?? ""}
          />
        );
      })
    ) : (
      <CustomTab label={"Đang cập nhật"} value={""} />
    );
  } else {
    tabs = <CustomTab label={"Đang cập nhật"} value={""} />;
  }

  return (
    <Container>
      <TitleContainer ref={listRef}>
        <ContainerTitle color="success">
          <BarChart />
          &nbsp;Top bán chạy
        </ContainerTitle>
        {isError ? (
          <MoreButton className="error" onClick={() => refetch()}>
            Tải lại <Replay />
          </MoreButton>
        ) : (
          <Link to={`/store`}>
            <MoreButton>
              Xem tất cả <KeyboardArrowRight />
            </MoreButton>
          </Link>
        )}
      </TitleContainer>
      {categories && (
        <ToggleGroupContainer>
          <CustomTabs
            value={tabValue}
            onChange={handleChangeValue}
            scrollButtons="auto"
          >
            {tabs}
          </CustomTabs>
        </ToggleGroupContainer>
      )}
      <ProductsTop
        {...{ isLoading, isFetching, data, isSuccess, isError, size: listSize }}
      />
    </Container>
  );
};

const Home = () => {
  //Initial value
  const navigate = useNavigate();
  const [catesWithChilds, setCatesWithChilds] = useState([]);
  const [cates, setCates] = useState([]);
  const [pubs, setPubs] = useState([]);
  const [pagination, setPagination] = useState({
    number: 0,
    size: defaultSize,
    isMore: true,
  });

  //Fetch
  const {
    data: categories,
    isLoading: loadCates,
    isSuccess: doneCates,
  } = useGetCategoriesQuery({ include: "children" });
  const {
    data: publishers,
    isLoading: loadPubs,
    isSuccess: donePubs,
  } = useGetPublishersQuery();
  const { data, isLoading, isSuccess, isError } = useGetBooksQuery({
    page: pagination?.number,
    size: pagination?.size,
    loadMore: pagination?.isMore,
  });

  //Load
  useEffect(() => {
    if (!loadCates && doneCates && categories) {
      const { entities, ids } = categories;
      let catesWithChildren = [];
      let cates = [];

      ids.forEach((id) => {
        const cate = entities[id];
        cate?.children?.length
          ? catesWithChildren.push(cate)
          : cates.push(cate);
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
        return { filters: { pubIds: [id + ""] }, label: pub?.name };
      });
      setPubs(pubsList);
    }
  }, [publishers]);

  //Set title
  useTitle("RING! - Bookstore");

  //Show more
  const handleShowMore = () => {
    if (pagination?.number >= 5) {
      navigate("/store");
    } else {
      const nextPage = data?.ids?.length / defaultMore;
      if (nextPage >= 1)
        setPagination({ ...pagination, number: nextPage, size: defaultMore });
    }
  };

  return (
    <Wrapper>
      <BannersSlider />
      <Suggest />
      <CustomDivider>TIÊU ĐIỂM</CustomDivider>
      <SaleContainer>
        <SaleList />
      </SaleContainer>
      <Loadable key={"toriyama"}>
        <ProductsList
          {...{
            value: { keyword: "toriyama" },
            title: (
              <ContainerTitle>
                <GpsNotFixed color="primary" />
                &nbsp;Akira Toriyama
              </ContainerTitle>
            ),
          }}
        />
      </Loadable>
      <Container>
        <TitleContainer>
          <ContainerTitle>
            <Category color="warning" />
            &nbsp;Danh mục sản phẩm
          </ContainerTitle>
        </TitleContainer>
        <Loadable key={"cates"}>
          <Categories />
        </Loadable>
      </Container>
      <CustomDivider>Sản phẩm mới nhất</CustomDivider>
      <Loadable key={"hot"}>
        <Container>
          <Products {...{ isLoading, data, isSuccess, isError }} />
          <ButtonContainer>
            {isError ? (
              <Button
                variant="outlined"
                color="error"
                size="medium"
                sx={{ width: 200 }}
                endIcon={<Replay sx={{ marginRight: "-10px" }} />}
                onClick={() => refetch()}
              >
                Tải lại
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                size="medium"
                sx={{ width: 200 }}
                onClick={handleShowMore}
                endIcon={<ExpandMore sx={{ marginRight: "-10px" }} />}
              >
                Xem thêm
              </Button>
            )}
          </ButtonContainer>
        </Container>
      </Loadable>
      <Loadable key={"trending"}>
        <ProductsList
          key={"trending"}
          {...{
            tabs: orderTabs,
            title: (
              <ContainerTitle>
                <TrendingUp color="success" />
                &nbsp;Trending
              </ContainerTitle>
            ),
          }}
        />
      </Loadable>
      <Loadable key={"top"}>
        <TopList categories={categories} />
      </Loadable>
      <Loadable key={"categories"}>
        <ProductsList
          key={"categories"}
          {...{
            value: { cateId: cates[0]?.id },
            title: (
              <ContainerTitle>
                <Book color="primary" />
                &nbsp;{cates[0]?.name}
              </ContainerTitle>
            ),
          }}
        />
      </Loadable>
      <Loadable key={"publishers"}>
        <ProductsList
          key={"publishers"}
          {...{
            tabs: pubs.slice(0, 4) || [],
            title: (
              <ContainerTitle>
                <TableChart color="warning" />
                &nbsp;Thương hiệu nổi bật
              </ContainerTitle>
            ),
          }}
        />
      </Loadable>
      <Loadable key={"publishers2"}>
        <ProductsList
          key={"publishers2"}
          {...{ tabs: pubs.slice(5, 9) || [] }}
        />
      </Loadable>
      <Container>
        <TitleContainer>
          <ContainerTitle>
            <Category color="info" />
            &nbsp;Nhà xuất bản
          </ContainerTitle>
        </TitleContainer>
        <Loadable key={"pubs"}>
          <Publishers />
        </Loadable>
      </Container>
      {catesWithChilds.map((cate, index) => {
        if (index < catesWithChilds?.length - 1) {
          const tabs = cateToTabs(cate);
          const title = cate.name;

          return (
            <Loadable key={`cate-${index}`}>
              <ProductsList
                key={`cate-${index}`}
                {...{
                  tabs,
                  title: (
                    <ContainerTitle>
                      <Bookmarks color={index % 2 == 0 ? "primary" : "info"} />
                      &nbsp;{title}
                    </ContainerTitle>
                  ),
                }}
              />
            </Loadable>
          );
        }
      })}
      <CustomDivider>Sản phẩm nổi bật</CustomDivider>
      <Loadable key={"products"}>
        <BigProductsSlider />
      </Loadable>
      <Loadable key={"categories3"}>
        <ProductsList
          key={"categories3"}
          {...{
            tabs: cateToTabs(catesWithChilds[catesWithChilds.length - 1]),
            title: (
              <ContainerTitle>
                <ImportContacts color="success" />
                &nbsp;{catesWithChilds[catesWithChilds.length - 1]?.name}
              </ContainerTitle>
            ),
          }}
        />
      </Loadable>
      <CustomDivider>Có thể bạn sẽ thích</CustomDivider>
      <Loadable key={"random"}>
        <RandomList />
      </Loadable>
    </Wrapper>
  );
};

export default Home;
