import styled from "styled-components";
import { lazy, Suspense, useEffect, useState } from "react";
import { useTheme, useMediaQuery, Grid2 as Grid, Skeleton } from '@mui/material';
import { NavLink, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useGetCategoriesQuery, useGetCategoryQuery } from "../features/categories/categoriesApiSlice";
import { useGetPublishersQuery } from "../features/publishers/publishersApiSlice";
import { useGetBooksQuery } from "../features/books/booksApiSlice";
import { orderGroup } from "../ultils/filters";
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
    const theme = useTheme();
    const mobileMode = useMediaQuery(theme.breakpoints.down('md'));

    //Filter & pagination
    const [filters, setFilters] = useState({
        value: searchParams.get("value") ? searchParams.get("value").split(',') : [1000, 10000000],
        keyword: searchParams.get("keyword") ?? "",
        type: searchParams.get("type") ?? "",
        shopId: searchParams.get("shopId") ?? "",
        pubId: searchParams.get("pubId") ?? [],
        cateId: searchParams.get("cateId") ?? "",
        rating: searchParams.get("rating") ?? 0,
        amount: searchParams.get("amount") ?? 1
    })
    const [pagination, setPagination] = useState({
        currPage: searchParams.get("pageNo") ? searchParams.get("pageNo") - 1 : 0,
        pageSize: searchParams.get("pSize") ?? 16,
        totalPages: 0,
        sortBy: searchParams.get("sortBy") ?? orderGroup[0].value,
        sortDir: searchParams.get("sortDir") ?? "desc",
    })

    //Fetch data
    const { data: currCate, isLoading: loadCate, isSuccess: doneCate, isError: errorCate } = useGetCategoryQuery({ slug, include: 'parent' }, { skip: !slug });
    const { data: cates, isLoading: loadCates, isSuccess: doneCates, isError: errorCates } = useGetCategoriesQuery({ include: 'children' }); //Categories
    const { data: pubs, isLoading: loadPubs, isSuccess: donePubs, isError: errorPubs } = useGetPublishersQuery(); //Publishers
    const { data, isError, error, isLoading, isSuccess } = useGetBooksQuery({ //Books
        page: pagination?.currPage,
        size: pagination?.pageSize,
        sortBy: pagination?.sortBy,
        sortDir: pagination?.sortDir,
        keyword: filters?.keyword,
        cateId: filters?.cateId,
        rating: filters?.rating,
        amount: filters?.amount,
        type: filters?.type,
        shopId: filters?.shopId,
        pubId: filters?.pubId,
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
                totalPages: data.info.totalPages,
            });
        }
    }, [data])

    useEffect(() => {
        setFilters({
            ...filters,
            value: searchParams.get("value") ? searchParams.get("value").split(',') : [1000, 10000000],
            keyword: searchParams.get("keyword") ?? "",
            type: searchParams.get("type") ?? "",
            shopId: searchParams.get("shopId") ? +searchParams.get("shopId") : "",
            pubId: searchParams.get("pubId") ? searchParams.get("pubId").split(',') : [],
            cateId: searchParams.get("cateId") ? +searchParams.get("cateId") : "",
            rating: searchParams.get("rating") ? +searchParams.get("rating") : 0,
            amount: searchParams.get("amount") ? +searchParams.get("amount") : 1,
        });

        setPagination({
            ...pagination,
            currPage: searchParams.get("pageNo") ? searchParams.get("pageNo") - 1 : 0,
            pageSize: searchParams.get("pSize") ?? 16,
            sortBy: searchParams.get("sortBy") ?? orderGroup[0].value,
            sortDir: searchParams.get("sortDir") ?? "desc",
        });
    }, [searchParams])

    //Set title
    useTitle('RING! - Cửa hàng');

    //Handle change: replace filters value & set search params
    const handleChangePage = (page) => {
        if (page == 1) {
            searchParams.delete("pageNo");
            setSearchParams(searchParams);
        } else {
            searchParams.set("pageNo", page);
            setSearchParams(searchParams);
        }
        setPagination({ ...pagination, currPage: page - 1 });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    const handleChangeCate = (slug, id) => {
        handleChangePage(1);
        if (filters?.cateId == id || id == "") {
            setFilters({ ...filters, cateId: '' });
            searchParams.delete("cateId");
            setSearchParams(searchParams);
            if (slug) navigate({ pathname: '/filters', search: searchParams.toString() });
        } else {
            searchParams.set("cateId", id);
            setSearchParams(searchParams);
            setFilters({ ...filters, cateId: id });
            if (slug) navigate({ pathname: `/filters/${slug}`, search: searchParams.toString() });
        }
    }

    const handleChangeRange = (newValue) => {
        handleChangePage(1);
        if (newValue.toString() == [1000, 10000000].toString()) {
            searchParams.delete("value");
            setSearchParams(searchParams);
        } else {
            searchParams.set("value", newValue);
            setSearchParams(searchParams);
        }

        newValue = newValue.map(String); //Convert to string array
        setFilters({ ...filters, value: newValue });
    }

    const handleChangeOrder = (newValue) => {
        if (newValue != null) {
            setPagination({ ...pagination, sortBy: newValue });
            searchParams.set("sortBy", newValue);
            setSearchParams(searchParams);
        }
    }

    const handleChangeDir = (newValue) => {
        if (newValue == 'desc') {
            searchParams.delete("sortDir");
            setSearchParams(searchParams);
        } else {
            searchParams.set("sortDir", newValue);
            setSearchParams(searchParams);
        }
        setPagination({ ...pagination, sortDir: newValue });
    }

    const handleChangeSize = (newValue) => {
        handleChangePage(1);
        if (newValue == 16) {
            searchParams.delete("pSize");
            setSearchParams(searchParams);
        } else {
            searchParams.set("pSize", newValue);
            setSearchParams(searchParams);
        }

        //Reset to first page
        searchParams.set("pageNo", page);
        setSearchParams(searchParams);
        setPagination({ ...pagination, pageSize: newValue, currPage: 0 });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    const handleChangeSearch = (newValue) => {
        handleChangePage(1);
        if (newValue == "" || newValue == null) {
            searchParams.delete("keyword");
            setSearchParams(searchParams);
        } else {
            searchParams.set("keyword", newValue);
            setSearchParams(searchParams);
        }
        setFilters({ ...filters, keyword: newValue ?? '' });
    }

    const handleChangePub = (newValue) => {
        handleChangePage(1);
        if (newValue.length == 0) {
            searchParams.delete("pubId");
            setSearchParams(searchParams);
        } else {
            searchParams.set("pubId", newValue);
            setSearchParams(searchParams);
        }
        setFilters({ ...filters, pubId: newValue });
    }

    const handleChangeType = (newValue) => {
        handleChangePage(1);
        if (newValue == "") {
            searchParams.delete("type");
            setSearchParams(searchParams);
        } else {
            searchParams.set("type", newValue);
            setSearchParams(searchParams);
        }
        setFilters({ ...filters, type: newValue });
    }

    const handleChangeShop = (newValue) => {
        handleChangePage(1);
        if (newValue == "") {
            searchParams.delete("shopId");
            setSearchParams(searchParams);
        } else {
            searchParams.set("shopId", newValue);
            setSearchParams(searchParams);
        }
        setFilters({ ...filters, shopId: newValue });
    }

    //Reset filters
    const resetFilter = () => {
        setFilters({
            value: [1000, 10000000],
            keyword: "",
            type: "",
            rating: 0,
            amount: 1,
            shopId: "",
            pubId: [],
            cateId: "",
        })
        setPagination({
            ...pagination,
            currPage: 0,
            pageSize: 16,
            sortBy: orderGroup[0].value,
            sortDir: "desc",
        })
        navigate('/filters')
    }

    const handleClose = () => { setOpen(false) };
    //#endregion

    return (
        <Wrapper>
            <CustomBreadcrumbs separator="›" maxItems={4} aria-label="breadcrumb">
                {!loadCate
                    ? [
                        slug ? [
                            <NavLink to={'/filters'} key={'filters'}>
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
            <Grid container spacing={4} size="grow" sx={{ display: 'flex', justifyContent: 'center' }}>
                {mobileMode ?
                    <>
                        {open &&
                            <Suspense fallback={<></>}>
                                <FilterDialog
                                    {...{ filters, setFilters, resetFilter, open, handleClose, loadCates, doneCates, errorCates, cates, loadPubs, donePubs, errorPubs, pubs }}
                                    onChangeCate={handleChangeCate}
                                    onChangeRange={handleChangeRange}
                                    onChangePub={handleChangePub}
                                    onChangeType={handleChangeType}
                                    onChangeShop={handleChangeShop}
                                />
                            </Suspense>
                        }
                    </>
                    :
                    <Grid size={{ xs: 12, md: 3 }} display={{ xs: "none", md: "block" }} sx={{ overflowX: 'visible', zIndex: 1 }}>
                        <Suspense fallback={<></>}>
                            <FilterList
                                {...{ filters, resetFilter, loadCates, doneCates, errorCates, cates, currCate, loadPubs, donePubs, errorPubs, pubs }}
                                onChangeCate={handleChangeCate}
                                onChangeRange={handleChangeRange}
                                onChangePub={handleChangePub}
                                onChangeType={handleChangeType}
                                onChangeShop={handleChangeShop} />
                        </Suspense>
                    </Grid>
                }
                <Grid size={{ xs: 12, md: 9 }}>
                    <CustomDivider sx={{ display: { xs: 'none', md: 'flex' } }}>{filters?.shop ? `SẢN PHẨM CỦA ${filters.shop}` : 'DANH MỤC SẢN PHẨM'}</CustomDivider>
                    <SortList filters={filters}
                        pagination={pagination}
                        onChangeOrder={handleChangeOrder}
                        onChangeDir={handleChangeDir}
                        onSizeChange={handleChangeSize}
                        onPageChange={handleChangePage}
                        setOpen={setOpen} />
                    <FilteredProducts {...{ data, isError, error, isLoading, isSuccess, pageSize: pagination?.pageSize }} />
                    <AppPagination pagination={pagination}
                        onPageChange={handleChangePage}
                        onSizeChange={handleChangeSize} />
                </Grid>
            </Grid>
        </Wrapper>
    )
}

export default FiltersPage