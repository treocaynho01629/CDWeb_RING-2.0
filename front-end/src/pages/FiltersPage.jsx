import styled from '@emotion/styled';
import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useTheme, useMediaQuery, Grid2 as Grid, Skeleton } from '@mui/material';
import { NavLink, useNavigate, useParams, useSearchParams } from 'react-router'
import { useGetCategoryQuery } from "../features/categories/categoriesApiSlice";
import { useGetBooksQuery } from "../features/books/booksApiSlice";
import { sortBy } from "../ultils/filters";
import { isEqual } from "lodash-es";
import AppPagination from "../components/custom/AppPagination";
import CustomDivider from "../components/custom/CustomDivider";
import FilteredProducts from "../components/product/filter/FilteredProducts";
import SortList from "../components/product/filter/SortList";
import useTitle from "../hooks/useTitle";
import CustomBreadcrumbs from "../components/custom/CustomBreadcrumbs";
import useDeepEffect from "../hooks/useDeepEffect";

const FilterList = lazy(() => import("../components/product/filter/FilterList"));
const FilterDrawer = lazy(() => import("../components/product/filter/FilterDrawer"));
const FiltersDisplay = lazy(() => import("../components/product/filter/FiltersDisplay"));

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
`
//#endregion

const DEFAULT_FILTERS = {
    keyword: "",
    cate: { id: "", slug: "" },
    pubIds: [],
    types: [],
    value: [0, 10000000],
    shopId: "",
    rating: 0,
}
const DEFAULT_PAGINATION = {
    currPage: 0,
    pageSize: 24,
    totalPages: 0,
    sortBy: sortBy[0].value,
    sortDir: "desc",
    amount: 1
}

const createCrumbs = (cate) => {
    if (cate) {
        return ([
            createCrumbs(cate?.parent),
            <NavLink to={`/store/${cate?.slug}?cate=${cate?.id}`} end key={`crumb-${cate?.id}`}>
                {cate?.categoryName}
            </NavLink>
        ])
    }
    return;
}

const FiltersPage = () => {
    //#region construct
    const { cSlug, sSlug } = useParams();
    const scrollRef = useRef(null);
    const pubsRef = useRef(null);
    const valueRef = useRef(null);
    const typesRef = useRef(null);
    const rateRef = useRef(null);
    const theme = useTheme();
    const mobileMode = useMediaQuery(theme.breakpoints.down('sm'));
    const tabletMode = useMediaQuery(theme.breakpoints.down('md_lg'));
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    //Filter & pagination
    const [filters, setFilters] = useState({
        keyword: searchParams.get("q") ?? DEFAULT_FILTERS.keyword,
        cate: {
            id: searchParams.get("cate") ?? DEFAULT_FILTERS.cate.id,
            slug: cSlug ?? DEFAULT_FILTERS.cate.slug,
        },
        pubIds: searchParams.get("pubs") ?? DEFAULT_FILTERS.pubIds,
        value: searchParams.get("value") ? searchParams.get("value").split(',').map(Number) : DEFAULT_FILTERS.value,
        types: searchParams.get("types") ?? DEFAULT_FILTERS.types,
        shopId: searchParams.get("shop") ?? DEFAULT_FILTERS.shopId,
        rating: searchParams.get("rating") ?? DEFAULT_FILTERS.rating,
    })
    const [pagination, setPagination] = useState({
        currPage: searchParams.get("pNo") ? searchParams.get("pNo") - 1 : DEFAULT_PAGINATION.currPage,
        pageSize: searchParams.get("pSize") ?? DEFAULT_PAGINATION.pageSize,
        totalPages: DEFAULT_PAGINATION.totalPages,
        sortBy: searchParams.get("sort") ?? DEFAULT_PAGINATION.sortBy,
        sortDir: searchParams.get("dir") ?? DEFAULT_PAGINATION.sortDir,
        amount: searchParams.get("amount") ?? DEFAULT_PAGINATION.amount
    })

    //Fetch data
    const { data: currCate, isLoading: loadCate } = useGetCategoryQuery(
        { slug: filters.cate.slug, include: 'parent' },
        { skip: (!filters.cate.id || !filters.cate.slug) }
    );
    const { data, isLoading, isFetching, isUninitialized, isSuccess, isError, error } = useGetBooksQuery({ //Books
        page: pagination.currPage,
        size: pagination.pageSize,
        sortBy: pagination.sortBy,
        sortDir: pagination.sortDir,
        amount: pagination.amount,
        keyword: filters.keyword,
        cateId: filters.cate.id,
        rating: filters.rating,
        types: filters.types,
        shopId: filters.shopId,
        pubIds: filters.pubIds,
        value: filters.value
    });

    //Dialog open state
    const [open, setOpen] = useState(undefined);

    //Set pagination after fetch
    useEffect(() => {
        if (data && !isLoading && isSuccess) {
            setPagination({
                ...pagination,
                currPage: data.info.currPage,
                pageSize: data.info.pageSize,
                totalPages: data.info.totalPages
            });
        }
    }, [data])

    //Go to first page on change + update path
    useDeepEffect(() => { handleChangePage(1); }, [filters])
    useEffect(() => { updatePath(); }, [pagination])

    //Update keyword & cate
    useEffect(() => { updateFilters(); }, [cSlug, searchParams])

    //Set title
    useTitle('RING! - Cửa hàng');

    //Handle change
    const scrollToTop = useCallback(() => { scrollRef?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, [])
    const handleChangePage = useCallback((page) => {
        setPagination(prev => ({ ...prev, currPage: page - 1 }));
        scrollToTop();
    }, [])
    const handleChangeOrder = useCallback((newValue) => { setPagination(prev => ({ ...prev, sortBy: newValue })); }, [])
    const handleChangeDir = useCallback((newValue) => { setPagination(prev => ({ ...prev, sortDir: newValue })); }, [])
    const handleChangeSize = useCallback((newValue) => { setPagination(prev => ({ ...prev, pageSize: newValue })); }, [])
    const handleChangeAmount = useCallback((newValue) => { setPagination(prev => ({ ...prev, amount: newValue })); }, [])

    //Search params
    const updatePath = useCallback(() => {
        //Filter
        filters.cate.id == DEFAULT_FILTERS.cate.id ? searchParams.delete("cate") : searchParams.set("cate", filters.cate.id);
        filters.shopId == DEFAULT_FILTERS.shopId ? searchParams.delete("shop") : searchParams.set("shop", filters.shopId);
        filters.keyword == DEFAULT_FILTERS.keyword ? searchParams.delete("q") : searchParams.set("q", filters.keyword);
        isEqual(filters.pubIds, DEFAULT_FILTERS.pubIds) ? searchParams.delete("pubs") : searchParams.set("pubs", filters.pubIds);
        isEqual(filters.types, DEFAULT_FILTERS.types) ? searchParams.delete("types") : searchParams.set("types", filters.types);
        isEqual(filters.value, DEFAULT_FILTERS.value) ? searchParams.delete("value") : searchParams.set("value", filters?.value);
        filters.rating == DEFAULT_FILTERS.rating ? searchParams.delete("rating") : searchParams.set("rating", filters.rating);

        //Pagination
        pagination.currPage == DEFAULT_PAGINATION.currPage ? searchParams.delete("pNo") : searchParams.set("pNo", pagination.currPage + 1);
        pagination.pageSize == DEFAULT_PAGINATION.pageSize ? searchParams.delete("pSize") : searchParams.set("pSize", pagination.pageSize);
        pagination.sortBy == DEFAULT_PAGINATION.sortBy ? searchParams.delete("sort") : searchParams.set("sort", pagination.sortBy);
        pagination.sortDir == DEFAULT_PAGINATION.sortDir ? searchParams.delete("dir") : searchParams.set("dir", pagination.sortDir);
        pagination.amount == DEFAULT_PAGINATION.amount ? searchParams.delete("amount") : searchParams.set("amount", pagination.amount);

        //Set
        const newPath = `/store${filters?.cate.slug ? `/${filters?.cate.slug}` : ''}`
        navigate({ pathname: newPath, search: searchParams.toString() }, { replace: true });
    }, [filters, pagination])

    const updateFilters = useCallback(() => {
        setFilters(prev => ({
            ...prev,
            keyword: searchParams.get("q") ?? DEFAULT_FILTERS.keyword,
            cate: { id: searchParams.get("cate") ? +searchParams.get("cate") : '', slug: cSlug ?? DEFAULT_FILTERS.cate.slug }
        }));
    }, [cSlug, searchParams])

    //Reset
    const resetFilter = useCallback(() => {
        handleChangePage(1);
        setFilters(DEFAULT_FILTERS);
    }, [])

    const handleOpen = () => { setOpen(true) };
    const handleClose = () => { setOpen(false) };
    //#endregion

    let loading = (isLoading || isFetching || isError || isUninitialized);
    let isChanged = !isEqual(filters, DEFAULT_FILTERS);

    return (
        <Wrapper>
            <CustomBreadcrumbs separator="›" maxItems={4} aria-label="breadcrumb">
                {!loadCate
                    ? [
                        <NavLink to={'/store/'} end key={'store'}>
                            Danh mục sản phẩm
                        </NavLink>,
                        cSlug && createCrumbs(currCate),
                        filters?.keyword &&
                        <NavLink to={'#'} key={'keyword'}>
                            {`Kết quả tìm kiếm: "${filters?.keyword}"`}
                        </NavLink>
                    ]
                    : <Skeleton variant="text" sx={{ fontSize: '16px' }} width={200} />
                }
            </CustomBreadcrumbs>
            <Grid container spacing={4} size="grow" position="relative" display="flex" justifyContent="center">
                {tabletMode ?
                    <Suspense fallback={null}>
                        <FilterDrawer {...{ filters, setFilters, resetFilter, open, handleOpen, handleClose }} />
                    </Suspense>
                    : <Grid size={{ xs: 12, md_lg: 2.8 }} position="relative">
                        <Suspense fallback={null}>
                            <FilterList {...{ filters, setFilters, resetFilter, pubsRef, typesRef, valueRef, rateRef }} />
                        </Suspense>
                    </Grid>
                }
                <Grid ref={scrollRef} size={{ xs: 12, md_lg: 9.2 }} sx={{ scrollMargin: theme.mixins.toolbar.minHeight }} position="relative">
                    <CustomDivider sx={{ display: { xs: 'none', md: 'flex' } }}>DANH MỤC SẢN PHẨM </CustomDivider>
                    {!tabletMode &&
                        <Suspense fallback={null}>
                            <FiltersDisplay {...{
                                filters, setFilters, resetFilter, defaultFilters: DEFAULT_FILTERS, isChanged,
                                pubsRef, typesRef, valueRef, rateRef
                            }} />
                        </Suspense>
                    }
                    <SortList {...{ filters, pagination, mobileMode, setOpen, isChanged }}
                        onChangeOrder={handleChangeOrder}
                        onChangeDir={handleChangeDir}
                        onChangeAmount={handleChangeAmount}
                        onPageChange={handleChangePage} />
                    <FilteredProducts {...{ data, error, loading }} />
                    <AppPagination {...{ pagination, mobileMode }}
                        onPageChange={handleChangePage}
                        onSizeChange={handleChangeSize} />
                </Grid>
            </Grid>
        </Wrapper>
    )
}

export default FiltersPage