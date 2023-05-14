import { useState } from "react";
import TableBook from '../components/TableBook'
import DashboardNavbar from "../components/DashboardNavbar";
import TableAccount from "../components/TableAccount";
import DashboardDrawer from "../components/DashboardDrawer";

import Grid from '@mui/material/Grid';

import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';

const Admin = () => {
  const [open, setOpen] = useState(false);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <DashboardNavbar open={open} setOpen={setOpen}/>
      <DashboardDrawer open={open} setOpen={setOpen}/>

      <Box component="main" sx={{ flexGrow: 1, p: 3 , marginTop: '80px'}}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TableBook/>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TableAccount/>
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}

export default Admin