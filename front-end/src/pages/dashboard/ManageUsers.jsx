import { lazy, Suspense, useState } from "react";
import { Box, Button, Grid2 as Grid } from '@mui/material';
import { Add, Group } from "@mui/icons-material";
import { useGetUserAnalyticsQuery } from "../../features/users/usersApiSlice";
import { HeaderContainer } from "../../components/dashboard/custom/ShareComponents";
import { NavLink } from "react-router";
import CustomDashboardBreadcrumbs from "../../components/dashboard/custom/CustomDashboardBreadcrumbs";
import ChartUsers from '../../components/dashboard/chart/ChartUsers'
import TableUsers from "../../components/dashboard/table/TableUsers";
import useTitle from '../../hooks/useTitle';
import InfoCard from "../../components/dashboard/custom/InfoCard";

const UserFormDialog = lazy(() => import("../../components/dashboard/dialog/UserFormDialog"));

const ManageUsers = () => {
  const [contextUser, setContextUser] = useState(null);
  const [open, setOpen] = useState(false);

  const { data: userAnalytics } = useGetUserAnalyticsQuery();

  const handleOpen = (user) => {
    setContextUser(user);
    setOpen(true);
  }

  const handleClose = () => {
    setContextUser(null);
    setOpen(false);
  }

  //Set title
  useTitle('Thành viên');

  return (
    <>
      <HeaderContainer>
        <div>
          <h2>Quản lý thành viên</h2>
          <CustomDashboardBreadcrumbs separator="." maxItems={4} aria-label="breadcrumb">
            <NavLink to={'/dashboard/user'}>Quản lý thành viên</NavLink>
          </CustomDashboardBreadcrumbs>
        </div>
        <Button variant="outlined" startIcon={<Add />} onClick={handleOpen}>
          Thêm
        </Button>
      </HeaderContainer>
      <Box mb={4}>
        <InfoCard
          icon={<Group color="warning" />}
          info={userAnalytics}
          color="warning"
        />
      </Box>
      <TableUsers />
      <Suspense fallback={<></>}>
        {open && <UserFormDialog open={open} handleClose={handleClose} />}
      </Suspense>
    </>
  )
}

export default ManageUsers