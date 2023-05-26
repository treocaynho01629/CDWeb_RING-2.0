import { useState, useEffect } from "react";

import styled from 'styled-components'
import { styled as muiStyled } from '@mui/material/styles';

import TableBook from '../../components/dashboard/TableBooks'
import TableAccounts from "../../components/dashboard/TableAccounts";
import TableReviews from "../../components/dashboard/TableReviews";
import TableReceipts from "../../components/dashboard/TableReceipts";
import ChartAccounts from "../../components/dashboard/ChartAccounts";
import ChartSales from "../../components/dashboard/ChartSales";

import { AutoStories as AutoStoriesIcon, Group as GroupIcon, Receipt as ReceiptIcon, Try as TryIcon } from "@mui/icons-material";
import { Grid, Paper } from '@mui/material';
import useAuth from "../../hooks/useAuth";

//#region preStyled
const CountContainer = muiStyled(Paper)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '20px 15px'
}));

const CountInfo = styled.div`
  text-align: right;
`

const countIconStyle = {
  color: '#63e399', 
  backgroundColor: '#ebebeb', 
  borderRadius: '50%', 
  padding: '8px', 
  fontSize: '60px'
}
//#endregion

const Dashboard = () => {
  const [accCount, setAccCount] = useState(0);
  const [bookCount, setBookCount] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [receiptCount, setReceiptCount] = useState(0);
  const { auth } = useAuth();
  const [admin, setAdmin] = useState((auth?.roles?.find(role => ['ROLE_ADMIN'].includes(role.roleName))));

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = `RING! - Dashboard`;
  }, [])

  return (
    <>
      <h2>Chào mừng {auth.userName}!</h2>
      <h3 style={{color: 'darkgray'}}>Dashboard</h3>
      <Grid container spacing={3} sx={{marginBottom: '20px'}}>
        <Grid item sm={6} md={3}>
          <CountContainer elevation={3} >
            <AutoStoriesIcon sx={countIconStyle}/>
            <CountInfo><h2 style={{margin: 0}}>{bookCount}</h2><span>Cuốn sách</span></CountInfo>
          </CountContainer>
        </Grid>
        <Grid item sm={6} md={3}>
          <CountContainer elevation={3} >
            <ReceiptIcon sx={countIconStyle}/>
            <CountInfo><h2 style={{margin: 0}}>{receiptCount}</h2><span>Đơn hàng</span></CountInfo>
          </CountContainer>
        </Grid>
        {admin? 
        <>
        <Grid item sm={6} md={3}>
          <CountContainer elevation={3} >
            <GroupIcon sx={countIconStyle}/>
            <CountInfo><h2 style={{margin: 0}}>{accCount}</h2><span>Thành viên</span></CountInfo>
          </CountContainer>
        </Grid>
        <Grid item sm={6} md={3}>
          <CountContainer elevation={3} >
            <TryIcon sx={countIconStyle}/>
            <CountInfo><h2 style={{margin: 0}}>{reviewCount}</h2><span>Đánh giá</span></CountInfo>
          </CountContainer>
        </Grid>
        </>
        :null}
      </Grid>
      <ChartSales/>
      {admin ? 
      <ChartAccounts/>
      :null}
      <Grid container spacing={3} sx={{marginBottom: '20px'}}>
        <Grid item sm={12} lg={6}>
          <TableBook mini={true} setBookCount={setBookCount}/>
        </Grid>
        <Grid item sm={12} lg={6}>
          <TableReceipts mini={true} setReceiptCount={setReceiptCount}/>
        </Grid>
      </Grid>
      {admin ? 
      <Grid container spacing={3} sx={{marginBottom: '20px'}}>
        <Grid item sm={12} lg={6}>
          <TableAccounts mini={true} setAccCount={setAccCount}/>
        </Grid>
        <Grid item sm={12} lg={6}>
          <TableReviews mini={true} setReviewCount={setReviewCount}/>
        </Grid>
      </Grid>
      :null}
    </>
  )
}

export default Dashboard