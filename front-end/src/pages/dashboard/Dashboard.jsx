import styled from '@emotion/styled'
import { styled as muiStyled } from '@mui/material';
import { useState } from "react";
import { AutoStories as AutoStoriesIcon, Group as GroupIcon, Receipt as ReceiptIcon, Try as TryIcon } from "@mui/icons-material";
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
        <Grid size={{ xs: 12, sm: 4 }}>
          <InfoCard
            count={productCount}
            icon={<AutoStoriesIcon color="primary" />}
            title={'Sản phẩm'}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <InfoCard
            count={orderCount}
            icon={<ReceiptIcon color="primary" />}
            title={'Đơn hàng'}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <InfoCard
            count={productCount}
            icon={<AutoStoriesIcon color="primary" />}
            title={'Sản phẩm'}
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
        <Grid size={{ xs: 12, lg: 3.5 }}>
          <SummaryTableProducts title={'test'} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 5 }}>
          <SummaryTableProducts title={'test'} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3.5 }}>
          <SummaryTableProducts title={'test'} />
        </Grid>
      </Grid>
    </>
  )
}

export default Dashboard