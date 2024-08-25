import { useState } from "react";
import { Box, Breadcrumbs, Grid, Typography } from '@mui/material';
import { Link } from "react-router-dom"
import { Receipt } from '@mui/icons-material';
import ChartSales from '../../components/dashboard/chart/ChartSales'
import TableOrders from "../../components/dashboard/table/TableOrders";
import useTitle from '../../hooks/useTitle';
import CountCard from "../../components/dashboard/custom/CountCard";

const ManageOrders = () => {
  const [orderCount, setOrderCount] = useState(0);

  //Set title
  useTitle('RING! - Doanh thu');

  return (
    <>
      <h2>Quản lý doanh thu</h2>
      <Box display={'flex'} justifyContent={'space-between'}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link style={{ color: 'inherit' }} to={'/dashboard'}>Dashboard</Link>
          <Typography color="text.secondary">Quản lý đơn hàng</Typography>
        </Breadcrumbs>
      </Box>
      <br />
      <Grid container spacing={3} sx={{ marginBottom: '20px' }}>
        <Grid item sm={6} md={4}>
          <CountCard
            count={orderCount}
            icon={<Receipt />}
            title={'Đơn hàng'}
          />
        </Grid>
      </Grid>
      <ChartSales />
      <TableOrders setOrderCount={setOrderCount} />
    </>
  )
}

export default ManageOrders