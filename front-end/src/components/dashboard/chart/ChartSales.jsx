import styled from '@emotion/styled'
import { styled as muiStyled } from '@mui/material';
import { CartesianGrid, LineChart, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Line } from 'recharts'
import { Box, Grid2 as Grid, Paper, Divider, LinearProgress } from '@mui/material'
import { Link } from 'react-router';
import { TrendingUp, TrendingDown, SsidChart, Sell } from '@mui/icons-material';
import { useGetSaleQuery } from '../../../features/orders/ordersApiSlice';

//#region styled
const Percent = styled.p`
    color: ${props => props.theme.palette.primary.main};
    font-size: 16px;
    font-weight: bold;
`

const Income = styled.span`
    font-size: 20px;
    font-weight: bold;
    color: ${props => props.theme.palette.primary.main};
    margin: 0;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    text-align: center;
`

const CustomLinearProgress = muiStyled(LinearProgress)(({ theme }) => ({
  borderRadius: 0,
  height: 15,
  margin: '15px 0px',
}));
//#endregion

const ChartSales = () => {
  const { data, isLoading, isSuccess, isError, error } = useGetSaleQuery();

  const chartDisplay = () => {
    //Month
    var date = new Date();
    date.setDate(0);
    const currentMonth = date.getMonth() + 1;
    const lastMonth = date.getMonth() + 1;

    //Calculate
    let display = { sales: 0, lastSales: 0, salesPercentage: 0, peakSales: 0 }
    let currentMonthSales = data.filter(x => x.name === `${currentMonth}`)[0].data;
    let lastMonthSales = data.filter(x => x.name === `${lastMonth}`)[0].data;

    display.sales = currentMonthSales?.sales ?? 0;
    display.lastSales = lastMonthSales?.sales ?? 0;
    display.salesPercentage = ((display.sales / display.lastSales) * 100 - 100).toFixed(1);
    display.peakSales = Math.max(...data.map(x => x.sales))
    return display;
  }

  if (isLoading) {
    return (<></>)
  } else {

    let display = chartDisplay();

    return (
      <Grid container spacing={3} size="grow" mb={3}>
        <Grid size={{ xs: 12, lg: 4 }}>
          <Paper elevation={3} sx={{ height: '100%', padding: 3, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Box>
              <h3 style={{ marginTop: 0, display: 'flex', alignItems: 'center' }}><Sell />&nbsp;Doanh thu đỉnh điểm</h3>
              <Income>{display?.peakSale?.toLocaleString()} đ</Income>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <h3 style={{ display: 'flex', alignItems: 'center' }}>
                  {display?.salesPercentage >= 0 ? <TrendingUp /> : <TrendingDown />}&nbsp;Doanh thu tháng này
                </h3>
                <Percent style={{ color: display?.salesPercentage >= 0 ? '#63e399' : '#e66161' }}>{display.salesPercentage}%</Percent>
              </Box>
              <Income style={{ color: display?.salesPercentage >= 0 ? '#63e399' : '#e66161' }}>{display?.sales?.toLocaleString()} đ</Income>
              <CustomLinearProgress color={display?.salesPercentage >= 0 ? 'primary' : 'secondary'} variant="determinate" value={Math.abs(display?.salesPercentage)} />
              <p><b>Tháng trước:&nbsp;</b>{display?.lastSales?.toLocaleString()} đ</p>
            </Box>
            <Box>
              <Divider sx={{ my: 2 }} />
              <Link to={'/manage-orders'}
                style={{ cursor: 'pointer', display: 'flex', justifyContent: 'center' }}>
                Xem chi tiết
              </Link>
            </Box>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Paper elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <h3 style={{ display: 'flex', alignItems: 'center' }}><SsidChart />&nbsp;Biểu đồ doanh thu theo tháng</h3>
            <ResponsiveContainer width="95%" height={350}>
              <LineChart data={data}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tickFormatter={(label) => `Tháng ${label}`} />
                <YAxis yAxisId={1} orientation="right" mirror label={{ position: 'insideRight', value: 'Doanh số', angle: 90, offset: -10 }} />
                <YAxis yAxisId={2} tickFormatter={(label) => `${label.toLocaleString()}`} mirror label={{ position: 'insideLeft', value: 'Doanh thu', angle: -90, offset: -10 }} />
                <Tooltip />
                <Legend />
                <Line yAxisId={1} type="basis" dataKey="data.books" name="Doanh số" stroke="#8dcbf5" />
                <Line yAxisId={2} type="monotone" dataKey="data.sales" name="Doanh thu" stroke="#63e399" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    )
  }
}

export default ChartSales