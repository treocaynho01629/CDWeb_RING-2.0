import React, { useEffect, useState } from 'react'

import styled from "styled-components"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import AppPagination from '../components/AppPagination'
import FilterList from "../components/FilterList"
import FilteredProducts from "../components/FilteredProducts"
import SortList from "../components/SortList"

import Divider from '@mui/material/Divider';
import Grid from "@mui/material/Grid"

import { styled as muiStyled } from '@mui/system';
import useFetch from '../hooks/useFetch'
import { useSearchParams } from 'react-router-dom'

//#region styled
const Container = styled.div`
`

const Wrapper = styled.div`
    padding-right: 15px;
    padding-left: 15px;
    margin-right: auto;
    margin-left: auto;

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

const BOOKS_URL = 'api/books/filters';

const FiltersPage = () => {
    //#region construct
    const[searchParams, setSearchParams] = useSearchParams();
    const[booksList, setBooksList] = useState([]);
    const[filters, setFilters] = useState({
        value: searchParams.get("value") ? searchParams.get("value").split(',') : [1000, 10000000],
        keyword: searchParams.get("keyword") ? searchParams.get("keyword") : "",
        type: searchParams.get("type") ? searchParams.get("type") : "",
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
        + "&fromRage=" + filters.value[0]
        + "&toRange=" + filters.value[1]);

    //Load
    useEffect(() => {
        if (!loading && data){
            loadBooks(); 
        }
        console.log(filters?.value);
    }, [loading])

    const loadBooks = ()=>{
        setPagination({ ...pagination, totalPages: data?.totalPages});
        setBooksList(data?.content);
    };

    //Change
    const handleCateChange = (id) => {
        handlePageChange(1);
        if (filters?.cateId == id){
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
    };

    const handleChangeDir = (newValue) => {
        if (newValue == 'desc'){
            searchParams.delete("sortDir");
            setSearchParams(searchParams);
        } else {
            searchParams.set("sortDir", newValue);
            setSearchParams(searchParams);
        }
        setPagination({...pagination, sortDir: newValue});
    };

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
    };

    const handleChangeSearch = (newValue) => {
        handlePageChange(1);
        setFilters({...filters, keyword: newValue});
        searchParams.set("keyword", newValue);
        setSearchParams(searchParams);
    };

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
    };
    //#endregion

    return (
    <Container>
        <Navbar/>
        <Wrapper>
            <Grid container spacing={5}>
                <Grid item xs={12} md={3}>
                    <FilterList  filters={filters}
                    onCateChange={handleCateChange}
                    onRangeChange={handleRangeChange}
                    onChangePub={handleChangePub}/>
                    Quang cao them sau
                </Grid>
                <Grid item xs={12} md={9}>
                    <Title>DANH MỤC SẢN PHẨM</Title>
                    <SortList filters={filters}
                    pagination={pagination}
                    onChangeOrder={handleChangeOrder}
                    onChangeDir={handleChangeDir}
                    onChangeSearch={handleChangeSearch}/>
                    <FilteredProducts loading={loading} 
                    booksList={booksList}/>
                    <AppPagination pagination={pagination}
                    onPageChange={handlePageChange}
                    onSizeChange={handleChangeSize}/>
                </Grid>
            </Grid>
        </Wrapper>
        <Footer/>
    </Container>
  )
}

export default FiltersPage