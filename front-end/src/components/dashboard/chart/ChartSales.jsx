import styled from 'styled-components'
import { styled as muiStyled } from '@mui/material/styles';

import { CartesianGrid, LineChart, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Line } from 'recharts'
import { Box, Grid, Paper, Divider } from '@mui/material'
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import { Link } from "react-router-dom";
import { TrendingUp, TrendingDown, SsidChart, Sell} from '@mui/icons-material';
import usePrivateFetch from '../../../hooks/usePrivateFetch'

//#region styled
const Percent = styled.p`
    color: ${props => props.theme.palette.secondary.main};
    font-size: 16px;
    font-weight: bold;
`

const Income = styled.span`
    font-size: 20px;
    font-weight: bold;
    color: ${props => props.theme.palette.secondary.main};
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
  [`&.${linearProgressClasses.colorPrimary}`]: {
      backgroundColor: 'lightgray',
  },
  [`&.${linearProgressClasses.colorSecondary}`]: {
    backgroundColor: 'lightgray',
  },
  [`& .${linearProgressClasses.barColorPrimary}`]: {
    backgroundColor: '#63e399',
  },
  [`& .${linearProgressClasses.barColorSecondary}`]: {
      backgroundColor: '#e66161',
  },
}));
//#endregion

const SALES_URL = 'api/orders/sale';

const ChartSales = () => {
    const { loading: loadingSales, data: sales } = usePrivateFetch(SALES_URL);
    
    const chartDisplay = () =>{
      //Month
      var date = new Date();
      const currentMonth = date.getMonth() + 1;
      date.setDate(0);
      const lastMonth = date.getMonth() + 1;

      //Calculate
      let display = {otherData: 0, lastOtherData: 0, otherDataPercent: 0, peakSale: 0}
      let currentMonthSales = sales.filter(x => x.name === `${currentMonth}`);
      let lastMonthSales = sales.filter(x => x.name === `${lastMonth}`);

      display.otherData = currentMonthSales[0]?.otherData ? currentMonthSales[0]?.otherData : 0;
      display.lastOtherData = lastMonthSales[0]?.otherData ? lastMonthSales[0]?.otherData : 0;
      display.otherDataPercent = ((display.otherData / display.lastOtherData) * 100 - 100).toFixed(1);
      display.peakSale = Math.max(...sales.map(x => x.otherData))
      return display;
    }

    if (loadingSales){
        return (<></>)
    } else {

      let display = chartDisplay();

      return (
        <Grid container spacing={3} sx={{mb: 3}}>
            <Grid item xs={12} lg={4}>
                <Paper elevation={3} sx={{height: '100%', padding: 3, display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
                  <Box>
                    <h3 style={{marginTop: 0, display: 'flex', alignItems: 'center'}}><Sell/>&nbsp;Doanh thu đỉnh điểm</h3>
                    <Income>{display?.peakSale?.toLocaleString()} đ</Income>
                    <Divider sx={{my: 2}}/>
                    <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                      <h3 style={{display: 'flex', alignItems: 'center'}}>
                        {display?.otherDataPercent >= 0 ? <TrendingUp/> : <TrendingDown/>}&nbsp;Doanh thu tháng này
                      </h3>
                      <Percent style={{color: display?.otherDataPercent >= 0 ? '#63e399' : '#e66161'}}>{display.otherDataPercent}%</Percent>
                    </Box>
                    <Income style={{color: display?.otherDataPercent >= 0 ? '#63e399' : '#e66161'}}>{display?.otherData?.toLocaleString()} đ</Income>
                    <CustomLinearProgress color={display?.otherDataPercent >= 0 ? 'primary' : 'secondary'} variant="determinate" value={Math.abs(display?.otherDataPercent)}/>
                    <p><b>Tháng trước:&nbsp;</b>{display?.lastOtherData?.toLocaleString()} đ</p>
                  </Box>
                  <Box>
                    <Divider sx={{my: 2}}/>
                    <Link to={'/manage-receipts'}
                    style={{cursor: 'pointer', display: 'flex', justifyContent: 'center'}}>
                      Xem chi tiết
                    </Link>
                  </Box>
                </Paper>
            </Grid>
            <Grid item xs={12} lg={8}>
                <Paper elevation={3} sx={{height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                    <h3 style={{display: 'flex', alignItems: 'center'}}><SsidChart/>&nbsp;Biểu đồ doanh thu theo tháng</h3>
                    <ResponsiveContainer width="95%" height={350}>
                        <LineChart data={sales}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" tickFormatter={(label) => `Tháng ${label}`}/>
                            <YAxis yAxisId={1} orientation="right" mirror label={{ position: 'insideRight', value: 'Doanh số', angle: 90, offset: -10 }} />
                            <YAxis yAxisId={2} tickFormatter={(label) => `${label.toLocaleString()}`} mirror label={{ position: 'insideLeft', value: 'Doanh thu', angle: -90, offset: -10 }} />
                            <Tooltip />
                            <Legend />
                            <Line yAxisId={1} type="basis" dataKey="data" name="Doanh số" stroke="#8dcbf5" />
                            <Line yAxisId={2} type="monotone" dataKey="otherData" name="Doanh thu" stroke="#63e399" />
                        </LineChart>
                    </ResponsiveContainer>
                </Paper>
            </Grid>
        </Grid>
      )
    }
}

export default ChartSales