import styled from 'styled-components'
import { styled as muiStyled } from '@mui/material/styles';
import { useState, useEffect } from "react";
import { Grid, Paper } from '@mui/material';
import { useNavigate } from "react-router-dom"
import ChartAccounts from '../../components/dashboard/chart/ChartAccounts'
import TableUsers from "../../components/dashboard/table/TableUsers";
import GroupIcon from '@mui/icons-material/Group';
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

const ManageUsers = () => {
  const [accCount, setAccCount] = useState(0);
  const navigate = useNavigate();

  //Set title
  useTitle('RING! - Người dùng');

  return (
    <>
      <h2>Quản lý người dùng</h2>
      <h3 style={{ color: 'darkgray', cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>Dashboard / Quản lý người dùng</h3>
      <Grid container spacing={3} sx={{ marginBottom: '20px' }}>
        <Grid item sm={6} md={3}>
          <CountContainer elevation={3} >
            <GroupIcon sx={countIconStyle} />
            <CountInfo><h2 style={{ margin: 0 }}>{accCount}</h2><span>Thành viên</span></CountInfo>
          </CountContainer>
        </Grid>
      </Grid>
      <ChartAccounts />
      <TableUsers setAccCount={setAccCount} />
    </>
  )
}

export default ManageUsers