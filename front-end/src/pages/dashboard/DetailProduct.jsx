import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import styled from 'styled-components'

import DashboardNavbar from "../../components/dashboard/DashboardNavbar";
import DashboardDrawer from "../../components/dashboard/DashboardDrawer";
import TableReviews from "../../components/dashboard/TableReviews";
import TableReceipts from "../../components/dashboard/TableReceipts";

import CssBaseline from '@mui/material/CssBaseline';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Divider  from '@mui/material/Divider';

import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SkipNextIcon from '@mui/icons-material/SkipNext';

import useFetch from '../../hooks/useFetch'
import { Link, useParams } from 'react-router-dom';

//#region styled
const CustomButton = styled.button`
    width: 70%;
    border-radius: 0;
    padding: 15px;
    margin-top: -15px;
    border: none;
    outline: none;
    background-color: #63e399;
    color: white;
    font-size: 18px;
    justify-content: center;
    font-weight: bold;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    text-align: center;
    justify-content: center;
    transition: all 0.5s ease;

    &:hover {
        background-color: lightgray;
        color: gray;
    }
`

const Title = styled.h2`
    font-size: 35px;
    line-height: normal;
    text-overflow: ellipsis;
	overflow: hidden;
	white-space: break-word;
    max-width: 400px;
	
	@supports (-webkit-line-clamp: 2) {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: break-word;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
`
//#endregion

const BOOK_URL = `/api/books/`;

const DetailProduct = () => {
    const {id} = useParams();
    const theme = useTheme();
    const [open, setOpen] = useState(false);
    const [reviewCount, setReviewCount] = useState(0);
    const [receiptCount, setReceiptCount] = useState(0);

    const { loading, data } = useFetch(BOOK_URL + id);

    return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <DashboardNavbar open={open} setOpen={setOpen}/>
      <DashboardDrawer open={open} setOpen={setOpen}/>

      <Box component="main" sx={{ flexGrow: 1, p: 3 , marginTop: '80px'}}>
        <Card sx={{ display: 'flex', justifyContent: 'between', marginBottom: 3}}>
            <CardMedia
            component="img"
            sx={{ width: 500, borderRadius: 5, margin: 3 }}
            image={data?.image}
            />
            <Divider sx={{marginLeft: 2, marginRight: 2}} orientation="vertical" variant="middle" flexItem/>
            <Box sx={{ flex: '1 0 auto', display: 'flex', justifyContent: 'space-between'}}>
            <CardContent sx={{ flex: '1 0 auto', padding: '50px'}}>
                <Title>
                {data?.title}
                </Title>
                <Typography my={2} component="div" variant="h5">
                Giá: {data?.price.toLocaleString()} đ
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={4}>
                        <Typography my={1} variant="h6" color="text.primary" component="div">
                        Thể loại:
                        </Typography>
                        <Typography my={1} variant="h6" color="text.primary" component="div">
                        Nhà xuất bản:
                        </Typography>
                        <Typography my={1} variant="h6" color="text.primary" component="div">
                        Tác giả: 
                        </Typography>
                        <Typography my={1} variant="h6" color="text.primary" component="div">
                        Bìa: 
                        </Typography>
                        <Typography my={1} variant="h6" color="text.primary" component="div">
                        Người bán:
                        </Typography>
                    </Grid>
                    <Grid item xs={8}>
                        <Typography my={1} variant="h6" color="text.secondary" component="div">
                        {data?.cateName}
                        </Typography>
                        <Typography my={1} variant="h6" color="text.secondary" component="div">
                        {data?.publisher?.pubName}
                        </Typography>
                        <Typography my={1} variant="h6" color="text.secondary" component="div">
                        {data?.author}
                        </Typography>
                        <Typography my={1} variant="h6" color="text.secondary" component="div">
                        {data?.type}
                        </Typography>
                        <Typography my={1} variant="h6" color="text.secondary" component="div">
                        <Link to={'/'}>{data?.sellerName}</Link>
                        </Typography>
                    </Grid>
                </Grid>
                <CustomButton style={{marginTop: '10px'}}>Xem trang sản phẩm</CustomButton>
            </CardContent>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', pr: 2, pt: 2 }}>
                <IconButton aria-label="play/pause">
                    <PlayArrowIcon sx={{ height: 38, width: 38 }} />
                </IconButton>
            </Box>
            </Box>
        </Card>

        <Grid container spacing={3}>
          <Grid item sm={12} lg={6}>
            <TableReceipts setReceiptCount={setReceiptCount}/>
          </Grid>
          <Grid item sm={12} lg={6}>
            <TableReviews setReviewCount={setReviewCount} id={id}/>
          </Grid>
        </Grid>
      </Box>
    </Box>
      
    );
}

export default DetailProduct