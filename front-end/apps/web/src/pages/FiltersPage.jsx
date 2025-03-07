import styled from "@emotion/styled";
import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useMediaQuery, Grid2 as Grid, Skeleton } from "@mui/material";
import { NavLink, useNavigate, useParams, useSearchParams } from "react-router";
import { useGetCategoryQuery } from "../features/categories/categoriesApiSlice";
import { useGetBooksQuery } from "../features/books/booksApiSlice";
import { isEqual } from "lodash-es";
import { useTitle, useDeepEffect } from "@ring/shared";
import { booksAmount, pageSizes, sortBooksBy } from "../ultils/filters";
import AppPagination from "../components/custom/AppPagination";
import CustomDivider from "../components/custom/CustomDivider";
import FilteredProducts from "../components/product/filter/FilteredProducts";
import FilterSortList from "../components/product/filter/FilterSortList";
import CustomBreadcrumbs from "../components/custom/CustomBreadcrumbs";

const FilterList = lazy(
  () => import("../components/product/filter/FilterList")
);
const FilterDrawer = lazy(
  () => import("../components/product/filter/FilterDrawer")
);
const FiltersDisplay = lazy(
  () => import("../components/product/filter/FiltersDisplay")
);
const JumpPagination = lazy(
  () => import("../components/custom/JumpPagination")
);

//#region styled
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;

  @media (min-width: 600px) {
    margin-right: auto;
    margin-left: auto;
    width: 600px;
  }
  @media (min-width: 768px) {
    width: 750px;
  }
  @media (min-width: 992px) {
    width: 970px;
  }
  @media (min-width: 1200px) {
    width: 1170px;
  }
`;
//#endregion

const DEFAULT_FILTERS = {
  keyword: "",
  cate: { id: "", slug: "" },
  pubIds: [],
  types: [],
  value: [0, 10000000],
  shopId: "",
  rating: 0,
};
const DEFAULT_PAGINATION = {
  number: 0,
  size: pageSizes[1],
  totalPages: 0,
  sortBy: sortBooksBy[0].value,
  sortDir: "desc",
  amount: booksAmount[0].value,
};

const createCrumbs = (cate) => {
  if (cate) {
    return [
      createCrumbs(cate?.parent),
      <NavLink
        to={`/store/${cate?.slug}?cate=${cate?.id}`}
        end
        key={`crumb-${cate?.id}`}
      >
        {cate?.name}
      </NavLink>,
    ];
  }
  return;
};

const FiltersPage = () => {
  //#region construct
  const { cSlug, sSlug } = useParams();
  const scrollRef = useRef(null);
  const pubsRef = useRef(null);
  const valueRef = useRef(null);
  const typesRef = useRef(null);
  const rateRef = useRef(null);
  const mobileMode = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const tabletMode = useMediaQuery((theme) => theme.breakpoints.down("md_lg"));
  const navigate = useNavigate();
  const [openPagination, setOpenPagination] = useState(undefined); //Pagination
  const [open, setOpen] = useState(undefined); //Filter
  const [searchParams, setSearchParams] = useSearchParams();

  //Filter & pagination
  const [filters, setFilters] = useState({
    keyword: searchParams.get("q") ?? DEFAULT_FILTERS.keyword,
    cate: {
      id: searchParams.get("cate") ?? DEFAULT_FILTERS.cate.id,
      slug: cSlug ?? DEFAULT_FILTERS.cate.slug,
    },
    pubIds: searchParams.get("pubs") ?? DEFAULT_FILTERS.pubIds,
    value: searchParams.get("value")
      ? searchParams.get("value").split(",").map(Number)
      : DEFAULT_FILTERS.value,
    types: searchParams.get("types") ?? DEFAULT_FILTERS.types,
    shopId: searchParams.get("shop") ?? DEFAULT_FILTERS.shopId,
    rating: searchParams.get("rating") ?? DEFAULT_FILTERS.rating,
  });
  const [pagination, setPagination] = useState({
    number: searchParams.get("pNo")
      ? searchParams.get("pNo") - 1
      : DEFAULT_PAGINATION.number,
    size: searchParams.get("pSize") ?? DEFAULT_PAGINATION.size,
    totalPages: DEFAULT_PAGINATION.totalPages,
    sortBy: searchParams.get("sort") ?? DEFAULT_PAGINATION.sortBy,
    sortDir: searchParams.get("dir") ?? DEFAULT_PAGINATION.sortDir,
    amount: searchParams.get("amount") ?? DEFAULT_PAGINATION.amount,
  });

  //Fetch data
  const { data: currCate, isLoading: loadCate } = useGetCategoryQuery(
    { slug: filters.cate.slug, include: "parent" },
    { skip: !filters.cate.id || !filters.cate.slug }
  );
  const {
    data,
    isLoading,
    isFetching,
    isUninitialized,
    isSuccess,
    isError,
    error,
  } = useGetBooksQuery({
    //Books
    page: pagination.number,
    size: pagination.size,
    sortBy: pagination.sortBy,
    sortDir: pagination.sortDir,
    amount: pagination.amount,
    keyword: filters.keyword,
    cateId: filters.cate.id,
    rating: filters.rating,
    types: filters.types,
    shopId: filters.shopId,
    pubIds: filters.pubIds,
    value: filters.value,
  });

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

  //Go to first page on change + update path
  useDeepEffect(() => {
    handleChangePage(1);
  }, [
    filters,
    pagination.size,
    pagination.sortBy,
    pagination.sortDir,
    pagination.amount,
  ]);
  useEffect(() => {
    updatePath();
  }, [pagination]);

  //Update keyword & cate
  useEffect(() => {
    updateFilters();
  }, [cSlug, searchParams]);

  //Set title
  useTitle("Cửa hàng");

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
  const handleChangeAmount = useCallback((newValue) => {
    setPagination((prev) => ({ ...prev, amount: newValue }));
  }, []);

  //Search params
  const updatePath = useCallback(() => {
    //Filter
    filters.cate.id == DEFAULT_FILTERS.cate.id
      ? searchParams.delete("cate")
      : searchParams.set("cate", filters.cate.id);
    filters.shopId == DEFAULT_FILTERS.shopId
      ? searchParams.delete("shop")
      : searchParams.set("shop", filters.shopId);
    filters.keyword == DEFAULT_FILTERS.keyword
      ? searchParams.delete("q")
      : searchParams.set("q", filters.keyword);
    isEqual(filters.pubIds, DEFAULT_FILTERS.pubIds)
      ? searchParams.delete("pubs")
      : searchParams.set("pubs", filters.pubIds);
    isEqual(filters.types, DEFAULT_FILTERS.types)
      ? searchParams.delete("types")
      : searchParams.set("types", filters.types);
    isEqual(filters.value, DEFAULT_FILTERS.value)
      ? searchParams.delete("value")
      : searchParams.set("value", filters?.value);
    filters.rating == DEFAULT_FILTERS.rating
      ? searchParams.delete("rating")
      : searchParams.set("rating", filters.rating);

    //Pagination
    pagination.number == DEFAULT_PAGINATION.number
      ? searchParams.delete("pNo")
      : searchParams.set("pNo", pagination.number + 1);
    pagination.size == DEFAULT_PAGINATION.size
      ? searchParams.delete("pSize")
      : searchParams.set("pSize", pagination.size);
    pagination.sortBy == DEFAULT_PAGINATION.sortBy
      ? searchParams.delete("sort")
      : searchParams.set("sort", pagination.sortBy);
    pagination.sortDir == DEFAULT_PAGINATION.sortDir
      ? searchParams.delete("dir")
      : searchParams.set("dir", pagination.sortDir);
    pagination.amount == DEFAULT_PAGINATION.amount
      ? searchParams.delete("amount")
      : searchParams.set("amount", pagination.amount);

    //Set
    const newPath = `/store${filters?.cate.slug ? `/${filters?.cate.slug}` : ""}`;
    navigate(
      { pathname: newPath, search: searchParams.toString() },
      { replace: true }
    );
  }, [filters, pagination]);

  const updateFilters = useCallback(() => {
    setFilters((prev) => ({
      ...prev,
      keyword: searchParams.get("q") ?? DEFAULT_FILTERS.keyword,
      cate: {
        id: searchParams.get("cate") ? +searchParams.get("cate") : "",
        slug: cSlug ?? DEFAULT_FILTERS.cate.slug,
      },
    }));
  }, [cSlug, searchParams]);

  //Reset
  const resetFilter = useCallback(() => {
    handleChangePage(1);
    setFilters(DEFAULT_FILTERS);
  }, []);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleOpenPagination = () => {
    setOpenPagination(true);
  };
  const handleClosePagination = () => {
    setOpenPagination(false);
  };
  //#endregion

  let loading = isLoading || isFetching || isError || isUninitialized;
  let isChanged = !isEqual(filters, DEFAULT_FILTERS);

  return (
    <Wrapper>
      <CustomBreadcrumbs separator="›" maxItems={4} aria-label="breadcrumb">
        {!loadCate ? (
          [
            <NavLink to={"/store"} end key={"store"}>
              Danh mục sản phẩm
            </NavLink>,
            cSlug && createCrumbs(currCate),
            filters?.keyword && (
              <NavLink to={"#"} key={"keyword"}>
                {`Kết quả tìm kiếm: "${filters?.keyword}"`}
              </NavLink>
            ),
          ]
        ) : (
          <Skeleton variant="text" sx={{ fontSize: "16px" }} width={200} />
        )}
      </CustomBreadcrumbs>
      <Grid
        container
        spacing={4}
        size="grow"
        position="relative"
        display="flex"
        justifyContent="center"
      >
        {tabletMode ? (
          <Suspense fallback={null}>
            <FilterDrawer
              {...{
                filters,
                setFilters,
                resetFilter,
                open,
                handleOpen,
                handleClose,
              }}
            />
          </Suspense>
        ) : (
          <Grid size={{ xs: 12, md_lg: 2.8 }} position="relative">
            <Suspense fallback={null}>
              <FilterList
                {...{
                  filters,
                  setFilters,
                  resetFilter,
                  pubsRef,
                  typesRef,
                  valueRef,
                  rateRef,
                }}
              />
            </Suspense>
          </Grid>
        )}
        <Grid
          ref={scrollRef}
          size={{ xs: 12, md_lg: 9.2 }}
          sx={(theme) => ({ scrollMargin: theme.mixins.toolbar.minHeight })}
          position="relative"
        >
          <CustomDivider sx={{ display: { xs: "none", md: "flex" } }}>
            DANH MỤC SẢN PHẨM
          </CustomDivider>
          {!tabletMode && (
            <Suspense fallback={null}>
              <FiltersDisplay
                {...{
                  filters,
                  setFilters,
                  resetFilter,
                  defaultFilters: DEFAULT_FILTERS,
                  isChanged,
                  pubsRef,
                  typesRef,
                  valueRef,
                  rateRef,
                }}
              />
            </Suspense>
          )}
          <FilterSortList
            {...{ pagination, mobileMode, setOpen, isChanged }}
            onOpenPagination={handleOpenPagination}
            onChangeOrder={handleChangeOrder}
            onChangeDir={handleChangeDir}
            onChangeAmount={handleChangeAmount}
            onPageChange={handleChangePage}
          />
          <FilteredProducts {...{ data, error, loading }} />
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
        </Grid>
      </Grid>
    </Wrapper>
  );
};

export default FiltersPage;
