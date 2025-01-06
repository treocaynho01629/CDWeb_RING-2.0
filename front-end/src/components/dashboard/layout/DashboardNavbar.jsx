import { Suspense, lazy, useCallback, useState } from 'react';
import { Toolbar, IconButton, Stack, Tooltip, Avatar, Box, alpha, Chip, Typography, Button, Skeleton } from '@mui/material';
import { Menu as MenuIcon, Logout, Home as HomeIcon, NotificationsNone, SettingsOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router';
import { useGetPreviewShopsQuery } from './../../../features/shops/shopsApiSlice';
import MuiAppBar from '@mui/material/AppBar';
import useLogout from "../../../hooks/useLogout";
import useAuth from '../../../hooks/useAuth';
import DashboardSetting from './DashboardSetting';
import styled from '@emotion/styled';

const ShopSelect = lazy(() => import("./ShopSelect"));

//#region preStyled
const StyledIconButton = styled(IconButton)(({ theme }) => ({
  borderRadius: 0,
  transition: 'all .25s ease',

  '&:hover': {
    color: theme.palette.primary.main,
    transform: 'scale(1.05)',
  },
}));

const AppBar = styled(MuiAppBar, { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
  backgroundColor: `${alpha(theme.palette.background.default, 0.5)} !important`,
  backdropFilter: 'blur(10px)',

  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
}));

const ShopButton = styled(Button)`
  display: flex;
  align-items: center;
  border-radius: 5px;
  cursor: pointer;
`
//#endregion

export default function DashboardNavbar({ open, setOpen }) {
  const { roles, shop, username } = useAuth();
  const isAdmin = useState((roles?.find(role => ['ROLE_ADMIN'].includes(role))));
  const [openSetting, setOpenSetting] = useState(false)
  const [currShop, setCurrShop] = useState(shop ?? '');
  const [anchorEl, setAnchorEl] = useState(undefined);
  const openShop = Boolean(anchorEl);
  const navigate = useNavigate();
  const signOut = useLogout();

  //Shop select
  const { data, isLoading, isSuccess, isError } = useGetPreviewShopsQuery();

  const handleOpenShop = (e) => { setAnchorEl(e.currentTarget); };
  const handleCloseShop = useCallback(() => { setAnchorEl(null) }, [anchorEl]);

  const handleToggleDrawer = () => { setOpen(prev => !prev) };

  return (
    <AppBar position="sticky" open={open} elevation={0}>
      <Toolbar disableGutters sx={{ justifyContent: 'space-between', padding: '5px 10px' }}>
        <Box display="flex" alignItems="center">
          <IconButton aria-label="open drawer" onClick={handleToggleDrawer}>
            <MenuIcon />
          </IconButton>
          <ShopButton
            onClick={handleOpenShop}
            disabled={isLoading}
            color="default"
          >
            <Avatar sx={{ width: 22, height: 22 }} />
            <Typography variant="body2" color='text.primary' mx={1}>
              {isLoading ? <Skeleton variant="text" width={100} /> : username}
            </Typography>
            <Chip label={isAdmin ? 'Admin' : 'Nhân viên'}
              color={isAdmin ? 'primary' : 'info'}
              size="small"
              sx={{ fontWeight: 'bold' }}
            />
          </ShopButton>
          <Suspense fallback={null}>
            {anchorEl !== undefined &&
              <ShopSelect {...{ open: openShop, anchorEl, handleClose: handleCloseShop, shop, data }} />
            }
          </Suspense>
        </Box>
        <Stack spacing={1} direction="row" sx={{ color: 'action.active' }}>
          <Tooltip title="Tài khoản">
            <StyledIconButton
              disableRipple disableFocusRipple
              onClick={() => setOpenSetting(true)}
              size="small"
              sx={{ ml: 2 }}
              aria-controls={openSetting ? 'account-menu' : undefined}
              aria-expanded={openSetting ? 'true' : undefined}
            >
              <Avatar sx={{ width: 32, height: 32 }} />
            </StyledIconButton>
          </Tooltip>
        </Stack>
        <DashboardSetting {...{ open: openSetting, setOpen: setOpenSetting }} />
      </Toolbar>
    </AppBar>
  );
}