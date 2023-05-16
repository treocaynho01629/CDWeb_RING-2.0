import { useState } from "react";

import styled from 'styled-components'
import { styled as muiStyled } from '@mui/material/styles';

import TableBook from '../../components/dashboard/TableBook'
import DashboardNavbar from "../../components/dashboard/DashboardNavbar";
import DashboardDrawer from "../../components/dashboard/DashboardDrawer";

import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import GroupIcon from '@mui/icons-material/Group';
import ReceiptIcon from '@mui/icons-material/Receipt';
import TryIcon from '@mui/icons-material/Try';

import Grid from '@mui/material/Grid';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';

//#region preStyled
const CountContainer = muiStyled(Paper)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '10px 15px'
}));

const CountInfo = styled.div`
  text-align: right;
`

const countIconStyle = {
  color: '#63e399', 
  backgroundColor: '#ebebeb', 
  borderRadius: '50%', 
  padding: '8px', 
  fontSize: '45px'
}
//#endregion

const ManageBooks = () => {
  const [open, setOpen] = useState(false);
  const [accCount, setAccCount] = useState(0);
  const [bookCount, setBookCount] = useState(0);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <DashboardNavbar open={open} setOpen={setOpen}/>
      <DashboardDrawer open={open} setOpen={setOpen}/>

      <Box component="main" sx={{ flexGrow: 1, p: 3 , marginTop: '80px'}}>
        <Grid container spacing={3} sx={{marginBottom: '20px'}}>
          <Grid item sm={6} md={3}>
            <CountContainer elevation={3} >
              <AutoStoriesIcon sx={countIconStyle}/>
              <CountInfo><h2 style={{margin: 0}}>{bookCount}</h2><span>Cuốn sách</span></CountInfo>
            </CountContainer>
          </Grid>
        </Grid>

        <TableBook setBookCount={setBookCount}/>
      </Box>
    </Box>
  )
}

export default ManageBooks