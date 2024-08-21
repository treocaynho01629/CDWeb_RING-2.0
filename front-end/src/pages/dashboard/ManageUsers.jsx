import { useState } from "react";
import { Box, Breadcrumbs, Button, Grid, Typography } from '@mui/material';
import { Link } from "react-router-dom"
import { Add, Group } from "@mui/icons-material";
import ChartAccounts from '../../components/dashboard/chart/ChartAccounts'
import TableUsers from "../../components/dashboard/table/TableUsers";
import useTitle from '../../hooks/useTitle';
import CountCard from "../../components/dashboard/custom/CountCard";


const ManageUsers = () => {
  const [userCount, setUserCount] = useState(0);

  //Set title
  useTitle('RING! - Thành viên');

  return (
    <>
      <h2>Quản lý thành viên</h2>
      <Box display={'flex'} justifyContent={'space-between'}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link style={{ color: 'inherit' }} to={'/dashboard'}>Dashboard</Link>
          <Typography color="text.secondary">Quản lý thành viên</Typography>
        </Breadcrumbs>
        <Button variant="outlined" size="large" startIcon={<Add />}>
          Thêm thành viên mới
        </Button>
      </Box>
      <br />
      <Grid container spacing={3} sx={{ marginBottom: '20px' }}>
        <Grid item sm={6} md={4}>
          <CountCard
            count={userCount}
            icon={<Group />}
            title={'Thành viên'}
          />
        </Grid>
      </Grid>
      <ChartAccounts />
      <TableUsers setUserCount={setUserCount} />
    </>
  )
}

export default ManageUsers