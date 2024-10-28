import styled from "styled-components";
import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useTheme, useMediaQuery, Grid2 as Grid, Skeleton } from '@mui/material';
import { Search } from "@mui/icons-material";
import { NavLink, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useGetCategoryQuery } from "../features/categories/categoriesApiSlice";
import { useGetBooksQuery } from "../features/books/booksApiSlice";
import { orderGroup } from "../ultils/filters";
import { debounce, isEqual } from "lodash-es";
import AppPagination from "../components/custom/AppPagination";
import CustomDivider from "../components/custom/CustomDivider";
import FilteredProducts from "../components/product/filter/FilteredProducts";
import SortList from "../components/product/filter/SortList";
import useTitle from "../hooks/useTitle";
import CustomBreadcrumbs from "../components/custom/CustomBreadcrumbs";

const FilterList = lazy(() => import("../components/product/filter/FilterList"));
const FilterDialog = lazy(() => import("../components/product/filter/FilterDialog"));

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

const Keyword = styled.div`
    display: flex;
    align-items: center;
    margin: 10px 0;

    b {
        color: ${props => props.theme.palette.warning.main};
    }
`
//#endregion

const createCrumbs = (cate) => {
    if (cate?.parent) {
        return ([
            createCrumbs(cate?.parent),
            <strong style={{ textDecoration: 'underline' }} key={`bread-cate-${cate?.id}`}>
                {cate?.categoryName}
            </strong>
        ])
    } else {
        return (
            cate?.parentId ? <NavLink to={`/filters/${cate?.slug}?cateId=${cate?.id}`} key={`bread-cate-${cate?.id}`}>
                {cate?.categoryName}
            </NavLink>
                : <strong style={{ textDecoration: 'underline' }} key={`bread-cate-${cate?.id}`}>
                    {cate?.categoryName}
                </strong>
        )
    }
}

const FiltersPage = () => {
    //#region construct
    const { slug } = useParams(); //Category slug
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const scrollRef = useRef(null);
    const theme = useTheme();
    const mobileMode = useMediaQuery(theme.breakpoints.down('sm'));
    const tabletMode = useMediaQuery(theme.breakpoints.down('md_lg'));

    //Filter & pagination
    const [filters, setFilters] = useState({
        value: searchParams.get("value") ? searchParams.get("value").split(',').map(Number) : [0, 10000000],
        keyword: searchParams.get("q") ?? "",
        types: searchParams.get("types") ?? [],
        shopId: searchParams.get("shop") ?? "",
        pubIds: searchParams.get("pubs") ?? [],
        cateId: searchParams.get("cate") ?? "",
        rating: searchParams.get("rating") ?? 0,
    })
    const [pagination, setPagination] = useState({
        currPage: searchParams.get("pNo") ? searchParams.get("pNo") - 1 : 0,
        pageSize: searchParams.get("pSize") ?? 24,
        totalPages: 0,
        sortBy: searchParams.get("sort") ?? orderGroup[0].value,
        sortDir: searchParams.get("dir") ?? "desc",
        amount: searchParams.get("a") ?? 1
    })

    //Fetch data
    const { data: currCate, isLoading: loadCate } = useGetCategoryQuery({ slug, include: 'parent' }, { skip: !slug });
    const { data, isLoading, isSuccess, isError, error } = useGetBooksQuery({ //Books
        page: pagination?.currPage,
        size: pagination?.pageSize,
        sortBy: pagination?.sortBy,
        sortDir: pagination?.sortDir,
        amount: pagination?.amount,
        keyword: filters?.keyword,
        cateId: filters?.cateId,
        rating: filters?.rating,
        types: filters?.types,
        shopId: filters?.shopId,
        pubIds: filters?.pubIds,
        value: filters?.value
    });

    //Dialog open state
    const [open, setOpen] = useState(false);

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

    useEffect(() => {
        if (searchParams.get("q")) {
            setFilters({ ...filters, keyword: searchParams.get("q") ?? "" });
        } else {
            setFilters({ ...filters, keyword: "" })
        }
    }, [searchParams])

    //Set title
    useTitle('RING! - Cửa hàng');

    //Handle change
    const handleChangePage = useCallback((page) => {
        if (page == 1) {
            searchParams.delete("pNo");
            setSearchParams(searchParams);
        } else {
            searchParams.set("pNo", page);
            setSearchParams(searchParams);
        }
        setPagination({ ...pagination, currPage: page - 1 });
        scrollRef?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, [pagination])

    const handleChangeOrder = useCallback((newValue) => {
        if (newValue == orderGroup[0].value) {
            searchParams.delete("sort");
            setSearchParams(searchParams);
        } else {
            searchParams.set("sort", newValue);
            setSearchParams(searchParams);
        }
        setPagination({ ...pagination, sortBy: newValue });
    }, [pagination])

    const handleChangeDir = useCallback((newValue) => {
        if (newValue == 'desc') {
            searchParams.delete("dir");
            setSearchParams(searchParams);
        } else {
            searchParams.set("dir", newValue);
            setSearchParams(searchParams);
        }
        setPagination({ ...pagination, sortDir: newValue });
    }, [pagination])

    const handleChangeSize = useCallback((newValue) => {
        handleChangePage(1);
        if (newValue == 24) {
            searchParams.delete("pSize");
            setSearchParams(searchParams);
        } else {
            searchParams.set("pSize", newValue);
            setSearchParams(searchParams);
        }
        setPagination({ ...pagination, pageSize: newValue });
    }, [pagination])

    const handleChangeAmount = useCallback((newValue) => {
        handleChangePage(1);
        if (newValue == 1) {
            searchParams.delete("amount");
            setSearchParams(searchParams);
        } else {
            searchParams.set("amount", newValue);
            setSearchParams(searchParams);
        }
        setPagination({ ...pagination, amount: newValue });
    }, [pagination])

    const handleChangeCate = useCallback((slug, id) => {
        handleChangePage(1);
        if (filters?.cateId == id || id == "" || id == null) {
            setFilters({ ...filters, cateId: '' });
            searchParams.delete("cate");
            setSearchParams(searchParams);
            navigate({ pathname: '/filters', search: searchParams.toString() });
        } else {
            searchParams.set("cate", id);
            setSearchParams(searchParams);
            setFilters({ ...filters, cateId: id });
            if (slug) navigate({ pathname: `/filters/${slug}`, search: searchParams.toString() });
        }
    }, [filters, slug])

    //Filters
    const handleChangePub = useCallback(debounce((newValue) => {
        handleChangePage(1);
        if (newValue.length == 0) {
            searchParams.delete("pubs");
            setSearchParams(searchParams);
        } else {
            searchParams.set("pubs", newValue);
            setSearchParams(searchParams);
        }
        setFilters({ ...filters, pubIds: newValue });
    }, 500), [filters])

    const handleChangeRange = useCallback(debounce((newValue) => {
        handleChangePage(1);
        if (isEqual(newValue, [0, 10000000])) {
            searchParams.delete("value");
            setSearchParams(searchParams);
        } else {
            searchParams.set("value", newValue);
            setSearchParams(searchParams);
        }

        setFilters({ ...filters, value: newValue });
    }, 1000), [filters])

    const handleChangeSearch = useCallback((newValue) => {
        handleChangePage(1);
        if (newValue == "" || newValue == null) {
            searchParams.delete("q");
            setSearchParams(searchParams);
        } else {
            searchParams.set("q", newValue);
            setSearchParams(searchParams);
        }
        setFilters({ ...filters, keyword: newValue ?? '' });
    }, [filters])

    const handleChangeType = useCallback(debounce((newValue) => {
        handleChangePage(1);
        if (newValue == "") {
            searchParams.delete("types");
            setSearchParams(searchParams);
        } else {
            searchParams.set("types", newValue);
            setSearchParams(searchParams);
        }
        setFilters({ ...filters, types: newValue });
    }, 500), [filters])

    const handleChangeRate = useCallback((newValue) => {
        handleChangePage(1);
        if (newValue == 0) {
            searchParams.delete("rating");
            setSearchParams(searchParams);
        } else {
            searchParams.set("rating", newValue);
            setSearchParams(searchParams);
        }
        setFilters({ ...filters, rating: newValue });
    }, [filters])

    const handleChangeShop = useCallback((newValue) => {
        handleChangePage(1);
        if (newValue == "") {
            searchParams.delete("shop");
            setSearchParams(searchParams);
        } else {
            searchParams.set("shop", newValue);
            setSearchParams(searchParams);
        }
        setFilters({ ...filters, shopId: newValue });
    }, [filters])

    //Reset
    const resetFilter = useCallback(() => {
        handleChangePage(1);
        setFilters({
            keyword: "",
            cateId: "",
            types: [],
            pubIds: [],
            value: [0, 10000000],
            rating: 0,
            shopId: "",
        })
        setPagination({
            pageSize: 24,
            sortBy: orderGroup[0].value,
            sortDir: "desc",
            amount: 1,
        })
        navigate('/filters')
    }, [])

    const handleClose = () => { setOpen(false) };
    //#endregion

    return (
        <Wrapper>
            <CustomBreadcrumbs separator="›" maxItems={4} aria-label="breadcrumb">
                {!loadCate
                    ? [
                        slug ? [
                            <NavLink onClick={(e) => {
                                e.preventDefault();
                                handleChangeCate();
                            }} key={'filters'}>
                                Danh mục sản phẩm
                            </NavLink>,
                            createCrumbs(currCate)
                        ] :
                            <strong style={{ textDecoration: 'underline' }} key={'filters'}>
                                Danh mục sản phẩm
                            </strong>,
                        filters?.keyword &&
                        <strong style={{ textDecoration: 'underline' }} key={'keyword'}>
                            {`Kết quả tìm kiếm: "${filters?.keyword}"`}
                        </strong>
                    ]
                    : <Skeleton variant="text" sx={{ fontSize: '16px' }} width={200} />
                }
            </CustomBreadcrumbs>
            <Grid container spacing={4} size="grow" position="relative" display="flex" justifyContent="center">
                {tabletMode ?
                    open && <Suspense fallback={null}>
                        <FilterDialog
                            {...{ filters, setFilters, resetFilter, open, handleClose }}
                            onChangeCate={handleChangeCate}
                            onChangeRange={handleChangeRange}
                            onChangePub={handleChangePub}
                            onChangeType={handleChangeType}
                            onChangeShop={handleChangeShop}
                        />
                    </Suspense>
                    : <Grid size={{ xs: 12, md_lg: 2.8 }} position="relative">
                        <Suspense fallback={null}>
                            <FilterList
                                {...{ filters, resetFilter }}
                                onChangeCate={handleChangeCate}
                                onChangeRange={handleChangeRange}
                                onChangePub={handleChangePub}
                                onChangeType={handleChangeType}
                                onChangeRate={handleChangeRate}
                            />
                        </Suspense>
                    </Grid>
                }
                <Grid ref={scrollRef} size={{ xs: 12, md_lg: 9.2 }} position="relative">
                    <CustomDivider sx={{ display: { xs: 'none', md: 'flex' } }}>
                        {filters?.shop ? `SẢN PHẨM CỦA ${filters.shop}` : 'DANH MỤC SẢN PHẨM'}
                    </CustomDivider>
                    {filters?.keyword &&
                        <Keyword><Search /> Kết quả từ khoá: '<b>{filters.keyword}</b>'</Keyword>
                    }
                    <SortList {...{ filters, pagination, mobileMode }}
                        onChangeOrder={handleChangeOrder}
                        onChangeDir={handleChangeDir}
                        onChangeAmount={handleChangeAmount}
                        onPageChange={handleChangePage}
                        setOpen={setOpen} />
                    <FilteredProducts {...{ data, isError, error, isLoading, isSuccess, pageSize: pagination?.pageSize }} />
                    <AppPagination {...{ pagination, mobileMode }}
                        onPageChange={handleChangePage}
                        onSizeChange={handleChangeSize} />
                </Grid>
            </Grid>
        </Wrapper>
    )
}

export default FiltersPage