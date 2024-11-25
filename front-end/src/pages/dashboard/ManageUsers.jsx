import { lazy, Suspense, useState } from "react";
import { Box, Breadcrumbs, Button, Grid2 as Grid, Typography } from '@mui/material';
import { Link } from 'react-router'
import { Add, Group } from "@mui/icons-material";
import ChartUsers from '../../components/dashboard/chart/ChartUsers'
import TableUsers from "../../components/dashboard/table/TableUsers";
import useTitle from '../../hooks/useTitle';
import CountCard from "../../components/dashboard/custom/CountCard";

const UserFormDialog = lazy(() => import("../../components/dashboard/dialog/UserFormDialog"));

const ManageUsers = () => {
  const [userCount, setUserCount] = useState(0);
  const [contextUser, setContextUser] = useState(null);
  const [open, setOpen] = useState(false);

  const handleOpen = (user) => {
    setContextUser(user);
    setOpen(true);
  }

  const handleClose = () => {
    setContextUser(null);
    setOpen(false);
  }

  //Set title
  useTitle('RING! - Thành viên');

  return (
    <>
      <h2>Quản lý thành viên</h2>
      <Box display="flex" justifyContent={'space-between'}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link style={{ color: 'inherit' }} to={'/dashboard'}>Dashboard</Link>
          <Typography color="text.secondary">Quản lý thành viên</Typography>
        </Breadcrumbs>
        <Button variant="outlined" size="large" startIcon={<Add />} onClick={() => handleOpen()}>
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
      <ChartUsers />
      <TableUsers setUserCount={setUserCount} />
      <Suspense fallback={<></>}>
        {open && <UserFormDialog open={open} handleClose={handleClose}/>}
      </Suspense>
    </>
  )
}

export default ManageUsers