import styled from "@emotion/styled";
import {
  useState,
  Suspense,
  lazy,
  useEffect,
  useCallback,
  useRef,
} from "react";
import {
  NavLink,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router";
import { Close, TipsAndUpdatesOutlined } from "@mui/icons-material";
import { Box, Grid2 as Grid, useMediaQuery } from "@mui/material";
import {
  useFollowShopMutation,
  useGetDisplayShopsQuery,
  useUnfollowShopMutation,
} from "../features/shops/shopsApiSlice";
import { useTitle } from "@ring/shared";
import {
  filterShopsBy,
  filterShopsValue,
  pageSizes,
  sortShopsBy,
} from "../ultils/filters";
import { useAuth } from "@ring/auth";
import { Wrapper } from "../components/custom/SortComponents";
import CustomBreadcrumbs from "../components/custom/CustomBreadcrumbs";
import AppPagination from "../components/custom/AppPagination";
import CustomDivider from "../components/custom/CustomDivider";
import Progress from "@ring/ui/Progress";
import Shop from "../components/shop/Shop";
import ShopSortList from "../components/shop/ShopSortList";

const JumpPagination = lazy(
  () => import("../components/custom/JumpPagination")
);

//#region styled
const Container = styled.div`
  width: 100%;
  min-height: 90dvh;
  position: relative;
  scroll-margin: ${({ theme }) => theme.mixins.toolbar.minHeight}px;
`;

const ShopsContainer = styled.div`
  width: 100%;
  min-height: 90dvh;
  position: relative;
  padding: 0;
`;

const ClearButton = styled.div`
  cursor: pointer;
  transition: all 0.2s ease;
  height: 24px;

  &:hover {
    color: ${({ theme }) => theme.palette.error.main};
  }
`;

const Keyword = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin: 10px 0;

  span {
    display: flex;
    align-items: center;

    b {
      color: ${({ theme }) => theme.palette.warning.main};
    }
  }
`;
//#endregion

const DEFAULT_PAGINATION = {
  number: 0,
  size: pageSizes[0],
  totalPages: 0,
  sortBy: sortShopsBy[0].value,
  sortDir: "desc",
  followed: filterShopsBy[0].value,
};

const Shops = () => {
  const scrollRef = useRef(null);
  const mobileMode = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const tabletMode = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const { username } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [openPagination, setOpenPagination] = useState(undefined); //Pagination
  const [keyword, setKeyword] = useState(searchParams.get("q") ?? "");
  const [pagination, setPagination] = useState({
    number: searchParams.get("pNo")
      ? searchParams.get("pNo") - 1
      : DEFAULT_PAGINATION.number,
    size: searchParams.get("pSize") ?? DEFAULT_PAGINATION.size,
    totalPages: DEFAULT_PAGINATION.totalPages,
    sortBy: searchParams.get("sort") ?? DEFAULT_PAGINATION.sortBy,
    sortDir: searchParams.get("dir") ?? DEFAULT_PAGINATION.sortDir,
    followed: searchParams.get("followed") ?? DEFAULT_PAGINATION.followed,
  });
  const [followShop, { isLoading: following }] = useFollowShopMutation();
  const [unfollowShop, { isLoading: unfollowing }] = useUnfollowShopMutation();

  const location = useLocation();
  const navigate = useNavigate();

  const {
    data,
    isLoading,
    isFetching,
    isUninitialized,
    isSuccess,
    isError,
    error,
  } = useGetDisplayShopsQuery({
    page: pagination.number,
    size: pagination.size,
    sortBy: pagination.sortBy,
    sortDir: pagination.sortDir,
    followed: filterShopsValue[pagination.followed],
    keyword: keyword,
  });

  useEffect(() => {
    handleChangePage(1);
  }, [
    keyword,
    pagination.size,
    pagination.sortBy,
    pagination.sortDir,
    pagination.followed,
  ]);
  useEffect(() => {
    updatePath();
  }, [pagination]);
  useEffect(() => {
    setKeyword(searchParams.get("q") ?? "");
  }, [searchParams]);

  //Set pagination after fetch
  useEffect(() => {
    if (data && !isLoading && isSuccess) {
      setPagination({
        ...pagination,
        number: data.page.number,
        size: data.page.size,
        totalPages: data.page.totalPages,
      });
    }
  }, [data]);

  //Set title
  useTitle("Danh sách cửa hàng");

  //Search params
  const updatePath = useCallback(() => {
    keyword == "" ? searchParams.delete("q") : searchParams.set("q", keyword);
    pagination.number == 0
      ? searchParams.delete("pNo")
      : searchParams.set("pNo", pagination.number + 1);
    pagination.size == pageSizes[0]
      ? searchParams.delete("pSize")
      : searchParams.set("pSize", pagination.size);
    pagination.sortBy == DEFAULT_PAGINATION.sortBy
      ? searchParams.delete("sort")
      : searchParams.set("sort", pagination.sortBy);
    pagination.sortDir == DEFAULT_PAGINATION.sortDir
      ? searchParams.delete("dir")
      : searchParams.set("dir", pagination.sortDir);
    pagination.followed == DEFAULT_PAGINATION.followed
      ? searchParams.delete("followed")
      : searchParams.set("followed", pagination.followed);
    setSearchParams(searchParams);
  }, [keyword, pagination]);

  //Handle change
  const scrollToTop = useCallback(() => {
    if (mobileMode) {
      scrollRef?.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);
  const handleChangePage = useCallback((page) => {
    setPagination((prev) => ({ ...prev, number: page - 1 }));
    scrollToTop();
  }, []);
  const handleChangeOrder = useCallback((newValue) => {
    setPagination((prev) => ({ ...prev, sortBy: newValue }));
  }, []);
  const handleChangeDir = useCallback((newValue) => {
    setPagination((prev) => ({ ...prev, sortDir: newValue }));
  }, []);
  const handleChangeSize = useCallback((newValue) => {
    setPagination((prev) => ({ ...prev, size: newValue }));
  }, []);
  const handleChangeFollowed = useCallback((newValue) => {
    setPagination((prev) => ({ ...prev, followed: newValue }));
  }, []);
  const handleClearKeyword = () => {
    setKeyword("");
  };

  const handleClickFollow = (shop) => {
    if (!username) navigate("/auth/login", { state: { from: location } });
    if (isLoading || following || unfollowing || !username) return;

    if (shop?.followed) {
      unfollowShop(shop?.id)
        .unwrap()
        .catch((err) => {
          console.error(err);
        });
    } else {
      followShop(shop?.id)
        .unwrap()
        .catch((err) => {
          console.error(err);
        });
    }
  };

  const handleOpenPagination = () => {
    setOpenPagination(true);
  };
  const handleClosePagination = () => {
    setOpenPagination(false);
  };

  let shopsContent;

  if (isSuccess) {
    const { ids, entities } = data;

    shopsContent = ids?.length ? (
      ids?.map((id, index) => {
        const shop = entities[id];

        return (
          <Grid key={id} size={{ xs: 12, sm: 6, md_lg: 4 }}>
            <Shop
              {...{
                shop,
                onClickFollow: handleClickFollow,
              }}
            />
          </Grid>
        );
      })
    ) : (
      <Box sx={{ marginTop: 2, width: "100%", textAlign: "center" }}>
        Không tìm thấy cửa hàng nào!
      </Box>
    );
  } else if (isError) {
    shopsContent = (
      <Box sx={{ marginTop: 2, width: "100%", textAlign: "center" }}>
        {error?.error ?? "Đã xảy ra lỗi!"}
      </Box>
    );
  }

  let loading = isLoading || isFetching || isError || isUninitialized;

  return (
    <Wrapper>
      <CustomBreadcrumbs separator="›" maxItems={4} aria-label="breadcrumb">
        <NavLink to={"/shop"}>Danh sách cửa hàng</NavLink>
        {keyword && (
          <NavLink to={"#"} key={"keyword"}>
            Kết quả tìm kiếm: "{keyword}"
          </NavLink>
        )}
      </CustomBreadcrumbs>
      <Container ref={scrollRef}>
        <CustomDivider sx={{ display: { xs: "none", md: "flex" } }}>
          DANH SÁCH CỬA HÀNG
        </CustomDivider>
        {!tabletMode && keyword && (
          <Keyword>
            <span>
              <TipsAndUpdatesOutlined />
              &nbsp;Cửa hàng liên quan đến: '<b>{keyword}</b>'
            </span>
            <ClearButton onClick={handleClearKeyword}>
              <Close />
            </ClearButton>
          </Keyword>
        )}
        <ShopSortList
          {...{ pagination, mobileMode, keyword }}
          onOpenPagination={handleOpenPagination}
          onChangeOrder={handleChangeOrder}
          onChangeDir={handleChangeDir}
          onChangeFollowed={handleChangeFollowed}
          onPageChange={handleChangePage}
          onClearKeyword={handleClearKeyword}
        />
        <ShopsContainer>
          <Grid container spacing={1}>
            {loading && <Progress color={isError ? "error" : "primary"} />}
            {shopsContent}
          </Grid>
        </ShopsContainer>
        <AppPagination
          pagination={pagination}
          onPageChange={handleChangePage}
          onSizeChange={handleChangeSize}
        />
        <Suspense fallback={null}>
          {openPagination != undefined && (
            <JumpPagination
              {...{
                pagination,
                onPageChange: handleChangePage,
                open: openPagination,
                handleClose: handleClosePagination,
              }}
            />
          )}
        </Suspense>
      </Container>
    </Wrapper>
  );
};

export default Shops;
