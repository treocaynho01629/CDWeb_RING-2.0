import React, { useEffect, useState } from 'react'

import styled from "styled-components"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import AppPagination from '../components/AppPagination'
import FilterList from "../components/FilterList"
import FilteredProducts from "../components/FilteredProducts"

import Divider from '@mui/material/Divider';
import { Grid } from "@mui/material"

import { styled as muiStyled } from '@mui/system';
import useFetch from '../hooks/useFetch'
import { useSearchParams } from 'react-router-dom'

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

const SortContainer = styled.div`
    display: flex;
    justify-content: space-between;
`

const Sort = styled.div`
    align-items: center;
    display: flex;
    margin: 20px 20px 0px;
`

const SortText = styled.h4`
`

const SortButton = styled.button`
    background-color: lightgray;
    padding: 10px 20px;
    margin-left: 20px;
    font-size: 16px;
    font-weight: 500;
    border-radius: 0;
    border: none;
    transition: all 0.5s ease;
    color: black;

    &:hover {
        background-color: #63e399;
        color: white;
    }
`

const Select = styled.select`
    margin-left: 20px;
    padding: 10px 20px;
    background-color: lightgray;
    font-size: 16px;
    font-weight: 500;
    border: none;
    color: black;
    outline: none;
    border: none;
`

const Option = styled.option`
    padding: 10px 20px;
    background-color: lightgray;
    font-size: 16px;
    font-weight: 500;
    border: none;
    color: black;
    outline: none;
    border: none;
`

const pageSize = 8;
const BOOKS_URL = 'api/books/filters';

const FiltersPage = () => {
    const[searchParams, setSearchParams] = useSearchParams();
    const[booksList, setBooksList] = useState([]);
    const[filters, setFilters] = useState({
        cateId: searchParams.get("cateId") ? searchParams.get("cateId") : "",
        value: [1000, 10000000],
        keyword: searchParams.get("keyword") ? searchParams.get("keyword") : ""
    })
    const[pagination, setPagination] = useState({
        currPage: 0,
        pageSize: pageSize,
        totalPages: 0,
        sortBy: "id"
    })
    const { loading, data } = useFetch(BOOKS_URL 
        + "?pageNo=" + pagination.currPage 
        + "&pSize=" + pagination.pageSize 
        + "&sortBy=" + pagination.sortBy
        + "&cateId=" + filters.cateId
        + "&keyword=" + filters.keyword
        + "&fromRage=" + filters.value[0]
        + "&toRange=" + filters.value[1]);

    //Load
    useEffect(() => {
        loadBooks(); 
    }, [loading == false])

    useEffect(() => {
        setFilters({...filters, 
            keyword: searchParams.get("keyword") ? searchParams.get("keyword") : "",
            cateId: searchParams.get("cateId") ? searchParams.get("cateId") : ""})
    }, [searchParams])

    const loadBooks = async()=>{
        setPagination({ ...pagination, totalPages: data?.totalPages - 1});
        setBooksList(data?.content);
    };

    //Change
    const handleCateChange = (id) => {
        handlePageChange(1);
        setFilters({...filters, cateId: id});
    }

    const handleRangeChange = (newValue) => {
        handlePageChange(1);
        setFilters({...filters, value: newValue});
    }

    const handlePageChange = (page) => {
        setPagination({...pagination, currPage: page - 1});
    }

    return (
    <Container>
        <Navbar/>
        <Wrapper>
            <Grid container spacing={5}>
                <Grid item xs={12} md={3}>
                    <FilterList  onCateChange={handleCateChange}
                    onRangeChange={handleRangeChange}/>
                    Quang cao them sau
                </Grid>
                <Grid item xs={12} md={9}>
                    <Title>DANH MỤC SẢN PHẨM</Title>
                    <SortContainer>
                        <Sort>
                            <SortText>Sắp xếp theo</SortText>
                            <SortButton>Phổ Biến</SortButton> 
                            <SortButton>Mới Nhất</SortButton> 
                            <SortButton>Bán Chạy</SortButton> 
                            <Select>
                                <Option disabled>Giá</Option>
                                <Option>Thấp Đến Cao</Option>
                                <Option>Cao Đến Thấp</Option>
                            </Select>
                        </Sort>
                    </SortContainer>
                    <FilteredProducts loading={loading} 
                    booksList={booksList}/>
                    <AppPagination pagination={pagination}
                    onPageChange={handlePageChange}/>
                </Grid>
            </Grid>
        </Wrapper>
        <Footer/>
    </Container>
  )
}

export default FiltersPage