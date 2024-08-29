import styled from 'styled-components'
import { styled as muiStyled } from '@mui/material/styles';
import { useState, useEffect } from "react";
import { AutoStories as AutoStoriesIcon, Group as GroupIcon, Receipt as ReceiptIcon, Try as TryIcon } from "@mui/icons-material";
import { Grid2 as Grid, Paper } from '@mui/material';
import TableProducts from '../../components/dashboard/table/TableProducts'
import TableUsers from "../../components/dashboard/table/TableUsers";
import TableReviews from "../../components/dashboard/table/TableReviews";
import TableOrders from "../../components/dashboard/table/TableOrders";
import ChartUsers from "../../components/dashboard/chart/ChartUsers";
import ChartSales from "../../components/dashboard/chart/ChartSales";
import useAuth from "../../hooks/useAuth";
import useTitle from "../../hooks/useTitle";

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
  const [userCount, setUserCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const { roles, username } = useAuth();
  const [admin, setAdmin] = useState((roles?.find(role => ['ROLE_ADMIN'].includes(role))));

  //Set title
  useTitle('RING! - Dashboard');

  return (
    <>
      <h2>Chào mừng {username}!</h2>
      <Grid container size="grow" spacing={3} mb={2}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <CountContainer elevation={3} >
            <AutoStoriesIcon sx={countIconStyle} />
            <CountInfo><h2 style={{ margin: 0 }}>{productCount}</h2><span>Cuốn sách</span></CountInfo>
          </CountContainer>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <CountContainer elevation={3} >
            <ReceiptIcon sx={countIconStyle} />
            <CountInfo><h2 style={{ margin: 0 }}>{orderCount}</h2><span>Đơn hàng</span></CountInfo>
          </CountContainer>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <CountContainer elevation={3} >
            <ReceiptIcon sx={countIconStyle} />
            <CountInfo><h2 style={{ margin: 0 }}>{orderCount}</h2><span>Đơn hàng</span></CountInfo>
          </CountContainer>
        </Grid>
      </Grid>
      <ChartSales />
      {admin && <ChartUsers />}
      <Grid container size="grow" spacing={3} mb={2}>
        <Grid size={{ xs: 12, lg: 6 }}>
          <TableProducts mini={true} setProductCount={setProductCount} />
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }}>
          <TableOrders mini={true} setOrderCount={setOrderCount} />
        </Grid>
        {admin &&
          <>
            <Grid size={{ xs: 12, lg: 6 }}>
              <TableUsers mini={true} setUserCount={setUserCount} />
            </Grid>
            <Grid size={{ xs: 12, lg: 6 }}>
              <TableReviews mini={true} setReviewCount={setReviewCount} />
            </Grid>
          </>
        }
      </Grid>
    </>
  )
}

export default Dashboard