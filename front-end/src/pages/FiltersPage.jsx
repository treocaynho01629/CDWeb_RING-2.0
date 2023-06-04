import React, { useEffect, useState } from 'react'

import styled from "styled-components"

import AppPagination from '../components/AppPagination'
import FilterList from "../components/FilterList"
import FilteredProducts from "../components/FilteredProducts"
import SortList from "../components/SortList"

import { Divider, Grid, Dialog, DialogContent, Box } from '@mui/material';

import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';

import { styled as muiStyled } from '@mui/system';
import useFetch from '../hooks/useFetch'
import { useNavigate, useSearchParams } from 'react-router-dom'

//#region styled
const Wrapper = styled.div`
    padding-right: 15px;
    padding-left: 15px;
    margin-right: auto;
    margin-left: auto;
    display: flex;

    @media (min-width: 600px) {
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

const Button = styled.button`
    background-color: #63e399;
    padding: 10px 20px;
    margin: 0 5px;
    font-size: 16px;
    font-weight: 500;
    border-radius: 0;
    border: none;
    transition: all 0.5s ease;
    display: flex;
    align-items: center;

    &:hover {
        background-color: lightgray;
        color: black;
    };

    &:focus {
        outline: none;
        border: none;
        border: 0;
    };

    outline: none;
    border: 0;
`

const CustomDialog = muiStyled(Dialog)(({ theme }) => ({
    '& .MuiDialog-paper': {
      borderRadius: 0,
      padding: '20px 15px',
    },
    '& .MuiDialogContent-root': {
      padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
      padding: theme.spacing(1),
    },
}));

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

const BOOKS_URL = 'api/books/filters';

const FiltersPage = () => {
    //#region construct
    const[searchParams, setSearchParams] = useSearchParams();
    const[booksList, setBooksList] = useState([]);
    const[filters, setFilters] = useState({
        value: searchParams.get("value") ? searchParams.get("value").split(',') : [1000, 10000000],
        keyword: searchParams.get("keyword") ? searchParams.get("keyword") : "",
        type: searchParams.get("type") ? searchParams.get("type") : "",
        seller: searchParams.get("seller") ? searchParams.get("seller") : "",
        pubId: searchParams.get("pubId") ? searchParams.get("pubId").split(',') : [],
        cateId: searchParams.get("cateId") ? searchParams.get("cateId") : "",
    })
    const[pagination, setPagination] = useState({
        currPage: searchParams.get("pageNo") ? searchParams.get("pageNo") : 0,
        pageSize: searchParams.get("pSize") ? searchParams.get("pSize") : 16,
        totalPages: 0,
        sortBy: searchParams.get("sortBy") ? searchParams.get("sortBy") : "id",
        sortDir: searchParams.get("sortDir") ? searchParams.get("sortDir") : "desc",
    })
    const { loading, data } = useFetch(BOOKS_URL 
        + "?pageNo=" + pagination.currPage 
        + "&pSize=" + pagination.pageSize 
        + "&sortBy=" + pagination.sortBy
        + "&sortDir=" + pagination.sortDir
        + "&cateId=" + filters.cateId
        + "&pubId=" + filters.pubId
        + "&type=" + filters.type
        + "&keyword=" + filters.keyword
        + "&seller=" + filters.seller
        + "&fromRange=" + filters.value[0]
        + "&toRange=" + filters.value[1]);
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    //Load
    useEffect(() => {
        if (!loading && data){
            setPagination({ ...pagination, totalPages: data?.totalPages});
            setBooksList(data?.content);
        }
    }, [loading])
    
    useEffect(() => {
        document.title = 'RING! - Cửa hàng';
        window.scrollTo(0, 0);
    }, [])

    //Change
    const handleCateChange = (id) => {
        handlePageChange(1);
        if (filters?.cateId == id || id == ""){
            setFilters({...filters, cateId: ''});
            searchParams.delete("cateId");
            setSearchParams(searchParams);
        } else {
            setFilters({...filters, cateId: id});
            searchParams.set("cateId", id);
            setSearchParams(searchParams);
        }
    }
    
    const handleRangeChange = (newValue) => {
        handlePageChange(1);
        if (newValue.toString() == [1000, 10000000].toString()){
            searchParams.delete("value");
            setSearchParams(searchParams);
        } else {
            searchParams.set("value", newValue);
            setSearchParams(searchParams);
        }
        setFilters({...filters, value: newValue});
    }

    const handlePageChange = (page) => {
        if (page == 1){
            searchParams.delete("pageNo");
            setSearchParams(searchParams);
        } else {
            searchParams.set("pageNo", page);
            setSearchParams(searchParams);
        }
        setPagination({...pagination, currPage: page - 1});
    }

    const handleChangeOrder = (newValue) => {
        if (newValue != null){
            setPagination({...pagination, sortBy: newValue});
            searchParams.set("sortBy", newValue);
            setSearchParams(searchParams);
        }
    }

    const handleChangeDir = (newValue) => {
        if (newValue == 'desc'){
            searchParams.delete("sortDir");
            setSearchParams(searchParams);
        } else {
            searchParams.set("sortDir", newValue);
            setSearchParams(searchParams);
        }
        setPagination({...pagination, sortDir: newValue});
    }

    const handleChangeSize = (newValue) => {
        handlePageChange(1);
        if (newValue == 16){
            searchParams.delete("pSize");
            setSearchParams(searchParams);
        } else {
            searchParams.set("pSize", newValue);
            setSearchParams(searchParams);
        }
        setPagination({...pagination, pageSize: newValue});
    }

    const handleChangeSearch = (newValue) => {
        handlePageChange(1);
        if (newValue == ""){
            searchParams.delete("keyword");
            setSearchParams(searchParams);
        } else {
            searchParams.set("keyword", newValue);
            setSearchParams(searchParams);
        }
        setFilters({...filters, keyword: newValue});
    }

    const handleChangePub = (newValue) => {
        handlePageChange(1);
        if (newValue.length == 0){
            searchParams.delete("pubId");
            setSearchParams(searchParams);
        } else {
            searchParams.set("pubId", newValue);
            setSearchParams(searchParams);
        }
        setFilters({...filters, pubId: newValue});
    }

    const handleChangeType = (newValue) => {
        handlePageChange(1);
        if (newValue == ""){
            searchParams.delete("type");
            setSearchParams(searchParams);
        } else {
            searchParams.set("type", newValue);
            setSearchParams(searchParams);
        }
        setFilters({...filters, type: newValue});
    }

    const handleChangeSeller = (newValue) => {
        handlePageChange(1);
        if (newValue == ""){
            searchParams.delete("seller");
            setSearchParams(searchParams);
        } else {
            searchParams.set("seller", newValue);
            setSearchParams(searchParams);
        }
        setFilters({...filters, seller: newValue});
    }

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

    const handleClose = () => {
        setOpen(false);
    };
    //#endregion

    let filterList = <>
        <FilterList  filters={filters}
            onCateChange={handleCateChange}
            onRangeChange={handleRangeChange}
            onChangePub={handleChangePub}
            onChangeType={handleChangeType}
            onChangeSeller={handleChangeSeller}/>
        <div style={{display: 'flex', justifyContent: 'center', marginTop: '20px'}}>
            <Button onClick={resetFilter}><FilterAltOffIcon/>Xoá bộ lọc</Button>
            <Box display={{sx: 'block', md: 'none'}}>
                <Button onClick={handleClose}>Áp dụng</Button>
            </Box>
        </div>
    </>

    return (
    <Wrapper>
        <CustomDialog open={open} onClose={handleClose} maxWidth={'md'}>
            <DialogContent>
                {filterList}
            </DialogContent>
        </CustomDialog>
        <Grid container spacing={5} sx={{display: 'flex', justifyContent: 'center'}}>
            <Grid item xs={12} md={3.5} lg={3} display={{ xs: "none", md: "block" }}>
                {filterList}
            </Grid>
            <Grid item xs={12} md={8.5} lg={9}>
                <Title>DANH MỤC SẢN PHẨM</Title>
                <SortList filters={filters}
                pagination={pagination}
                onChangeOrder={handleChangeOrder}
                onChangeDir={handleChangeDir}
                onChangeSearch={handleChangeSearch}
                setOpen={setOpen}/>
                <FilteredProducts loading={loading} 
                booksList={booksList}/>
                <AppPagination pagination={pagination}
                onPageChange={handlePageChange}
                onSizeChange={handleChangeSize}/>
            </Grid>
        </Grid>
    </Wrapper>
  )
}

export default FiltersPage