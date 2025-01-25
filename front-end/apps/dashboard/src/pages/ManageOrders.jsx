import { useState } from "react";
import { Box, Breadcrumbs, Grid2 as Grid, Typography } from '@mui/material';
import { Link } from 'react-router'
import { Receipt } from '@mui/icons-material';
import { useTitle } from "@ring/shared";
import ChartSales from '../components/chart/ChartSales'
import TableOrders from "../components/table/TableOrders";
// import CountCard from "../../components/custom/CountCard";

const ManageOrders = () => {
  const [orderCount, setOrderCount] = useState(0);

  //Set title
  useTitle('Doanh thu');

  return (
    <>
      <h2>Quản lý doanh thu</h2>
      <Box display="flex" justifyContent="space-between" mb={1}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link style={{ color: 'inherit' }} to={'/dashboard'}>Dashboard</Link>
          <Typography color="text.secondary">Quản lý đơn hàng</Typography>
        </Breadcrumbs>
      </Box>
      <Grid container spacing={3} sx={{ marginBottom: '20px' }}>
        <Grid item sm={6} md={4}>
          {/* <CountCard
            count={orderCount}
            icon={<Receipt />}
            title={'Đơn hàng'}
          /> */}
        </Grid>
      </Grid>
      <ChartSales />
      <TableOrders setOrderCount={setOrderCount} />
    </>
  )
}

export default ManageOrders