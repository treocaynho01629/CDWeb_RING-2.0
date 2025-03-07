import styled from "@emotion/styled";
import {
  useState,
  Suspense,
  lazy,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { NavLink, useSearchParams } from "react-router";
import { Search, Close } from "@mui/icons-material";
import { Box, Grid2 as Grid, TextField, useMediaQuery } from "@mui/material";
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
  scroll-margin: ${({ theme }) => theme.mixins.toolbar.minHeight};
`;

const ShopsContainer = styled.div`
  width: 100%;
  min-height: 90dvh;
  position: relative;
  padding: 0;
`;

const SearchContainer = styled.div`
  width: 100%;
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
  const inputRef = useRef(null);
  const scrollRef = useRef(null);
  const mobileMode = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const [searchParams, setSearchParams] = useSearchParams();
  const [openPagination, setOpenPagination] = useState(undefined); //Pagination
  const [keyword, setKeyword] = useState("");
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
    setSearchParams(searchParams, { replace: true });
  }, [keyword, pagination]);

  //Handle change
  const scrollToTop = useCallback(() => {
    scrollRef?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
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
  const handleChangeKeyword = useCallback((e) => {
    e.preventDefault();
    if (inputRef) setKeyword(inputRef.current.value);
  }, []);
  const handleRemoveKeyword = () => {
    setKeyword("");
  };

  const handleClickFollow = (shop) => {
    if (isLoading || following || unfollowing) return;

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

  return (
    <>
      <CustomBreadcrumbs separator="›" maxItems={4} aria-label="breadcrumb">
        <NavLink to={"/shop"}>Danh sách cửa hàng</NavLink>
        {keyword && (
          <NavLink to={"#"} key={"keyword"}>
            {`Cửa hàng liên quan đến: "${keyword}"`}
          </NavLink>
        )}
      </CustomBreadcrumbs>
      <Container ref={scrollRef}>
        <CustomDivider sx={{ display: { xs: "none", md: "flex" } }}>
          DANH SÁCH CỬA HÀNG
        </CustomDivider>
        <SearchContainer>
          {keyword && (
            <Keyword>
              <span>
                <Search />
                &nbsp;Cửa hàng liên quan đến: '<b>{keyword}</b>'
              </span>
              <ClearButton onClick={handleRemoveKeyword}>
                <Close />
              </ClearButton>
            </Keyword>
          )}
          <form ref={scrollRef} onSubmit={handleChangeKeyword}>
            <TextField
              placeholder="Tìm kiếm"
              autoComplete="keyword"
              id="keyword"
              size="small"
              defaultValue={searchParams.get("q")}
              inputRef={inputRef}
              fullWidth
              error={inputRef?.current?.value != keyword}
              slotProps={{
                input: {
                  startAdornment: <Search sx={{ marginRight: 1 }} />,
                },
              }}
            />
          </form>
        </SearchContainer>
        <ShopSortList
          {...{ pagination, mobileMode }}
          onOpenPagination={handleOpenPagination}
          onChangeOrder={handleChangeOrder}
          onChangeDir={handleChangeDir}
          onChangeFollowed={handleChangeFollowed}
          onPageChange={handleChangePage}
        />
        <ShopsContainer>
          <Grid container spacing={1}>
            {isLoading && <Progress color={isError ? "error" : "primary"} />}
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
    </>
  );
};

export default Shops;
