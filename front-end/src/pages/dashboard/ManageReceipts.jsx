import styled from 'styled-components'
import { styled as muiStyled } from '@mui/material/styles';
import { useState } from "react";
import { Grid, Paper } from '@mui/material';
import { useNavigate } from "react-router-dom"
import ChartSales from '../../components/dashboard/chart/ChartSales'
import TableReceipts from "../../components/dashboard/table/TableReceipts";
import ReceiptIcon from '@mui/icons-material/Receipt';
import useTitle from '../../hooks/useTitle';

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

const ManageReceipts = () => {
  const [receiptCount, setReceiptCount] = useState(0);
  const navigate = useNavigate();

  //Set title
  useTitle('RING! - Doanh thu');

  return (
    <>
      <h2>Quản lý doanh thu</h2>
      <h3 style={{ color: 'darkgray', cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>Dashboard / Quản lý doanh thu</h3>
      <Grid container spacing={3} sx={{ marginBottom: '20px' }}>
        <Grid item sm={6} md={3}>
          <CountContainer elevation={3} >
            <ReceiptIcon sx={countIconStyle} />
            <CountInfo><h2 style={{ margin: 0 }}>{receiptCount}</h2><span>Đơn hàng</span></CountInfo>
          </CountContainer>
        </Grid>
      </Grid>
      <ChartSales />
      <TableReceipts/>
    </>
  )
}

export default ManageReceipts