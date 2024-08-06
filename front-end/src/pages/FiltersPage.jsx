import styled from "styled-components"
import { useEffect, useState } from 'react'
import { Grid, useTheme, useMediaQuery } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useGetCategoriesQuery } from "../features/categories/categoriesApiSlice";
import { useGetPublishersQuery } from "../features/publishers/publishersApiSlice";
import { useGetBooksByFilterQuery } from "../features/books/booksApiSlice";
import AppPagination from '../components/custom/AppPagination'
import FilterList from "../components/product/FilterList"
import FilteredProducts from "../components/product/FilteredProducts"
import SortList from "../components/product/SortList"
import FilterDialog from '../components/product/FilterDialog'
import CustomDivider from "../components/custom/CustomDivider";
import useTitle from "../hooks/useTitle";

//#region styled
const Wrapper = styled.div`
    display: flex;
    
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

const FiltersPage = () => {
    //#region construct
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const theme = useTheme();
    const mobileMode = useMediaQuery(theme.breakpoints.down('md'));

    //Filter & pagination
    const [filters, setFilters] = useState({
        value: searchParams.get("value") ? searchParams.get("value").split(',') : [1000, 10000000],
        keyword: searchParams.get("keyword") ?? "",
        type: searchParams.get("type") ?? "",
        seller: searchParams.get("seller") ?? "",
        pubId: searchParams.get("pubId") ?? [],
        cateId: searchParams.get("cateId") ?? "",
    })
    const [pagination, setPagination] = useState({
        currPage: searchParams.get("pageNo") ? searchParams.get("pageNo") - 1 : 0,
        pageSize: searchParams.get("pSize") ?? 16,
        totalPages: 0,
        sortBy: searchParams.get("sortBy") ?? "id",
        sortDir: searchParams.get("sortDir") ?? "desc",
    })

    //Fetch data
    const { data: cates, isLoading: loadCates, isSuccess: doneCates, isError: errorCates } = useGetCategoriesQuery(); //Categories
    const { data: pubs, isLoading: loadPubs, isSuccess: donePubs, isError: errorPubs } = useGetPublishersQuery(); //Publishers
    const { data, isError, error, isLoading, isSuccess } = useGetBooksByFilterQuery({ //Books
        page: pagination?.currPage,
        size: pagination?.pageSize,
        sortBy: pagination?.sortBy,
        sortDir: pagination?.sortDir,
        keyword: filters?.keyword,
        cateId: filters?.cateId,
        type: filters?.type,
        seller: filters?.seller,
        pubId: filters?.pubId,
        value: filters?.value
    });

    //Dialog open state
    const [open, setOpen] = useState(false);

    //Set data after fetch
    useEffect(() => {
        if (!isLoading && isSuccess && data) {
            setPagination({
                ...pagination,
                totalPages: data?.info?.totalPages,
                currPage: data?.info?.currPage,
                pageSize: data?.info?.pageSize
            });
        }
    }, [data])

    //Update keyword from navbar
    useEffect(() => {
        const keyword = searchParams.get("keyword");
        if ((keyword != filters.keyword)) handleChangeSearch(keyword);
    }, [searchParams])

    //Set title
    useTitle('RING! - Cửa hàng');

    //Handle change: replace filters value & set search params
    const handleChangeCate = (id) => {
        handleChangePage(1);
        if (filters?.cateId == id || id == "") {
            searchParams.delete("cateId");
            setSearchParams(searchParams);
        } else {
            searchParams.set("cateId", id);
            setSearchParams(searchParams);
        }
        setFilters({ ...filters, cateId: id ?? '' });
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
        setFilters({ ...filters, value: newValue });
    }

    const handleChangePage = (page) => {
        if (page == 1) {
            searchParams.delete("pageNo");
            setSearchParams(searchParams);
        } else {
            searchParams.set("pageNo", page);
            setSearchParams(searchParams);
        }
        setPagination({ ...pagination, currPage: page - 1 });
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
        setPagination({ ...pagination, pageSize: newValue });
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
        setFilters({ ...filters, keyword: newValue });
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

    const handleChangeSeller = (newValue) => {
        handleChangePage(1);
        if (newValue == "") {
            searchParams.delete("seller");
            setSearchParams(searchParams);
        } else {
            searchParams.set("seller", newValue);
            setSearchParams(searchParams);
        }
        setFilters({ ...filters, seller: newValue });
    }

    //Reset filters
    const resetFilter = () => {
        setFilters({
            value: [1000, 10000000],
            keyword: "",
            type: "",
            seller: "",
            pubId: [],
            cateId: "",
        })
        setPagination({
            ...pagination,
            currPage: 0,
            pageSize: 16,
            sortBy: "id",
            sortDir: "desc",
        })
        navigate('/filters')
    }

    //Close dialog
    const handleClose = () => {
        setOpen(false);
    };
    //#endregion

    return (
        <Wrapper>
            <Grid container spacing={5} sx={{ display: 'flex', justifyContent: 'center' }}>
                {mobileMode ?
                    <FilterDialog
                        {...{ filters, setFilters, resetFilter, open, handleClose, loadCates, doneCates, errorCates, cates, loadPubs, donePubs, errorPubs, pubs }}
                        onChangeCate={handleChangeCate}
                        onChangeRange={handleChangeRange}
                        onChangePub={handleChangePub}
                        onChangeType={handleChangeType}
                        onChangeSeller={handleChangeSeller}
                    />
                    :
                    <Grid item xs={12} md={3} display={{ xs: "none", md: "block" }} sx={{ overflowX: 'visible', zIndex: 1 }}>
                        <FilterList
                            {...{ filters, resetFilter, loadCates, doneCates, errorCates, cates, loadPubs, donePubs, errorPubs, pubs }}
                            onChangeCate={handleChangeCate}
                            onChangeRange={handleChangeRange}
                            onChangePub={handleChangePub}
                            onChangeType={handleChangeType}
                            onChangeSeller={handleChangeSeller} />
                    </Grid>
                }
                <Grid item xs={12} md={9}>
                    <CustomDivider>DANH MỤC SẢN PHẨM</CustomDivider>
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