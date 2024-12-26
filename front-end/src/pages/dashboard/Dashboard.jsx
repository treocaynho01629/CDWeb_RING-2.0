import styled from '@emotion/styled'
import { styled as muiStyled } from '@mui/material';
import { useState } from "react";
import { AutoStories, Group, AttachMoney, Storefront } from "@mui/icons-material";
import { Grid2 as Grid, Paper } from '@mui/material';
import TableProducts from '../../components/dashboard/table/TableProducts'
// import TableUsers from "../../components/dashboard/table/TableUsers";
// import TableReviews from "../../components/dashboard/table/TableReviews";
// import TableOrders from "../../components/dashboard/table/TableOrders";
import ChartUsers from "../../components/dashboard/chart/ChartUsers";
import ChartSales from "../../components/dashboard/chart/ChartSales";
import useAuth from "../../hooks/useAuth";
import useTitle from "../../hooks/useTitle";
import WelcomeCard from '../../components/dashboard/custom/WelcomeCard';
import InfoCard from '../../components/dashboard/custom/InfoCard';
import SummaryTableProducts from '../../components/dashboard/table/SummaryTableProducts';
import SummaryTableOrders from '../../components/dashboard/table/SummaryTableOrders';
import SummaryTableUsers from '../../components/dashboard/table/SummaryTableUsers';

const Dashboard = () => {
  const [userCount, setUserCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const { roles, username } = useAuth();
  const isAdmin = useState((roles?.find(role => ['ROLE_ADMIN'].includes(role))));

  //Set title
  useTitle('Dashboard');

  return (
    <>
      <Grid container size="grow" spacing={3} pt={2}>
        <Grid size={{ xs: 12, sm: 7 }}>
          <WelcomeCard />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <p>STUFF</p>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md_lg: 3 }}>
          <InfoCard
            count={productCount}
            icon={<AutoStories color="info" />}
            title={'Sản phẩm'}
            color="info"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md_lg: 3 }}>
          <InfoCard
            count={orderCount}
            icon={<Storefront color="primary" />}
            title={'Cửa hàng'}
            color="primary"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md_lg: 3 }}>
          <InfoCard
            count={orderCount}
            icon={<Group color="warning" />}
            title={'Thành viên'}
            color="warning"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md_lg: 3 }}>
          <InfoCard
            count={productCount}
            icon={<AttachMoney color="error" />}
            title={'Doanh thu'}
            color="error"
          />
        </Grid>
        <Grid size={12}>
          <ChartSales />
        </Grid>
        {isAdmin &&
          <Grid size={12}>
            <ChartUsers />
          </Grid>
        }
        <Grid size={{ xs: 12, lg: 4 }}>
          <SummaryTableOrders />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <SummaryTableProducts />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <SummaryTableUsers />
        </Grid>
      </Grid>
    </>
  )
}

export default Dashboard