import styled from "styled-components"
import { useEffect, useState } from 'react'
import { Divider, Grid } from '@mui/material';
import { styled as muiStyled } from '@mui/system';
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useGetCategoriesQuery } from "../features/categories/categoriesApiSlice";
import { useGetPublishersQuery } from "../features/publishers/publishersApiSlice";
import { useGetBooksByFilterQuery } from "../features/books/booksApiSlice";
import AppPagination from '../components/custom/AppPagination'
import FilterList from "../components/product/FilterList"
import FilteredProducts from "../components/product/FilteredProducts"
import SortList from "../components/product/SortList"
import FilterDialog from '../components/product/FilterDialog'

//#region styled
const Wrapper = styled.div`
    display: flex;
    overflow-x: hidden;
    
    @media (min-width: 600px) {
        overflow-x: visible;
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

const Title = muiStyled(Divider)({
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#63e399',
    textAlign: 'center',
    justifyContent: 'center',
    margin: '10px 0px',
});
//#endregion

const FiltersPage = () => {
    //#region construct
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

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
        currPage: searchParams.get("pageNo") ?? 0,
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
    }, [isLoading])

    //Set title
    useEffect(() => {
        document.title = 'RING! - Cửa hàng';
        window.scrollTo(0, 0);
    }, [])

    //Handle change: replace filters value & set search params
    const handleChangeCate = (id) => {
        handlePageChange(1);
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
        handlePageChange(1);
        if (newValue.toString() == [1000, 10000000].toString()) {
            searchParams.delete("value");
            setSearchParams(searchParams);
        } else {
            searchParams.set("value", newValue);
            setSearchParams(searchParams);
        }
        setFilters({ ...filters, value: newValue });
    }

    const handlePageChange = (page) => {
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
        handlePageChange(1);
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
        handlePageChange(1);
        if (newValue == "") {
            searchParams.delete("keyword");
            setSearchParams(searchParams);
        } else {
            searchParams.set("keyword", newValue);
            setSearchParams(searchParams);
        }
        setFilters({ ...filters, keyword: newValue });
    }

    const handleChangePub = (newValue) => {
        handlePageChange(1);
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
        handlePageChange(1);
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
        handlePageChange(1);
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
            currPage: 0,
            pageSize: 16,
            totalPages: 0,
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
            <FilterDialog
                {...{ filters, setFilters, resetFilter, open, handleClose, loadCates, doneCates, errorCates, cates, loadPubs, donePubs, errorPubs, pubs }}
                onChangeCate={handleChangeCate}
                onChangeRange={handleChangeRange}
                onChangePub={handleChangePub}
                onChangeType={handleChangeType}
                onChangeSeller={handleChangeSeller}
            />
            <Grid container spacing={5} sx={{ display: 'flex', justifyContent: 'center' }}>
                <Grid item xs={12} md={3.5} lg={3} display={{ xs: "none", md: "block" }} sx={{ overflowX: 'visible' }}>
                    <FilterList
                        {...{ filters, resetFilter, loadCates, doneCates, errorCates, cates, loadPubs, donePubs, errorPubs, pubs }}
                        onChangeCate={handleChangeCate}
                        onChangeRange={handleChangeRange}
                        onChangePub={handleChangePub}
                        onChangeType={handleChangeType}
                        onChangeSeller={handleChangeSeller} />
                </Grid>
                <Grid item xs={12} md={8.5} lg={9}>
                    <Title>DANH MỤC SẢN PHẨM</Title>
                    <SortList filters={filters}
                        pagination={pagination}
                        onChangeOrder={handleChangeOrder}
                        onChangeDir={handleChangeDir}
                        onChangeSearch={handleChangeSearch}
                        onSizeChange={handleChangeSize}
                        setOpen={setOpen} />
                    <FilteredProducts {...{ data, isError, error, isLoading, isSuccess, pageSize: pagination?.pageSize }} />
                    <AppPagination pagination={pagination}
                        onPageChange={handlePageChange}
                        onSizeChange={handleChangeSize} />
                </Grid>
            </Grid>
        </Wrapper>
    )
}

export default FiltersPage