import { lazy, Suspense, useState } from "react";
import { Box, Button, Grid2 as Grid } from '@mui/material';
import { Add, Group } from "@mui/icons-material";
import { useGetUserAnalyticsQuery, usersApiSlice } from "../../features/users/usersApiSlice";
import { HeaderContainer } from "../../components/dashboard/custom/ShareComponents";
import { NavLink } from "react-router";
import CustomDashboardBreadcrumbs from "../../components/dashboard/custom/CustomDashboardBreadcrumbs";
import ChartUsers from '../../components/dashboard/chart/ChartUsers'
import TableUsers from "../../components/dashboard/table/TableUsers";
import useTitle from '../../hooks/useTitle';
import InfoCard from "../../components/dashboard/custom/InfoCard";
import PendingModal from "../../components/layout/PendingModal";

const UserFormDialog = lazy(() => import("../../components/dashboard/dialog/UserFormDialog"));

const ManageUsers = () => {
  const [contextUser, setContextUser] = useState(null);
  const [open, setOpen] = useState(undefined);
  const [pending, setPending] = useState(false);

  const { data: userAnalytics } = useGetUserAnalyticsQuery();
  const [getUser, { isLoading }] = usersApiSlice.useLazyGetUserQuery();


  const handleOpen = () => {
    setContextUser(null);
    setOpen(true);
  }

  const handleOpenEdit = (userId) => {
    getUser(userId)
      .unwrap()
      .then((user) => {
        setContextUser(user);
        setOpen(true);
      })
      .catch((rejected) => console.error(rejected));
  }

  const handleClose = () => {
    setOpen(false);
  }

  //Set title
  useTitle('Thành viên');

  return (
    <>
      {(isLoading || pending) &&
        <Suspense fallBack={null}>
          <PendingModal open={(isLoading || pending)} message="Đang gửi yêu cầu..." />
        </Suspense>
      }
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
      <Box mb={3}>
        <InfoCard
          icon={<Group color="warning" />}
          info={userAnalytics}
          color="warning"
        />
      </Box>
      <TableUsers {...{ handleOpenEdit, pending, setPending }} />
      <Suspense fallback={null}>
        {open !== undefined && <UserFormDialog {...{ open, handleClose, user: contextUser, pending, setPending }} />}
      </Suspense>
    </>
  )
}

export default ManageUsers