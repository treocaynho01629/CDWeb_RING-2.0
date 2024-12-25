import { styled as muiStyled } from '@mui/material';
import { useState } from 'react';
import { Toolbar, IconButton, Stack, Badge, Tooltip, Avatar, Menu, MenuItem, Divider, ListItemIcon, Box, alpha, Chip, Typography } from '@mui/material';
import { Menu as MenuIcon, Logout, Home as HomeIcon, NotificationsNone, SettingsOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router';
import MuiAppBar from '@mui/material/AppBar';
import useLogout from "../../../hooks/useLogout";
import useAuth from '../../../hooks/useAuth';
import DashboardSetting from './DashboardSetting';

//#region preStyled
const StyledIconButton = muiStyled(IconButton)(({ theme }) => ({
  borderRadius: 0,
  transition: 'all .25s ease',

  '&:hover': {
    color: theme.palette.primary.main,
    transform: 'scale(1.05)',
  },
}));

const AppBar = muiStyled(MuiAppBar, { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
  backgroundColor: `${alpha(theme.palette.background.default, 0.5)} !important`,
  backdropFilter: 'blur(10px)',

  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
}));
//#endregion

export default function DashboardNavbar({ open, setOpen }) {
  const { roles, username } = useAuth();
  const isAdmin = useState((roles?.find(role => ['ROLE_ADMIN'].includes(role))));
  const [openSetting, setOpenSetting] = useState(false)
  const navigate = useNavigate();
  const signOut = useLogout();

  const handleToggleDrawer = () => { setOpen(prev => !prev) };

  return (
    <AppBar position="sticky" open={open} elevation={0}>
      <Toolbar disableGutters sx={{ justifyContent: 'space-between', padding: '5px 10px' }}>
        <Box display="flex" alignItems="center">
          <IconButton aria-label="open drawer" onClick={handleToggleDrawer}>
            <MenuIcon />
          </IconButton>
          <Box display="flex" alignItems="center" px={1}>
            <Typography variant="body2" color='text.primary' mr={1}>
              {username}
            </Typography>
            <Chip label={isAdmin ? 'Admin' : 'Nhân viên'}
              color={isAdmin ? 'primary' : 'info'}
              size="small"
              sx={{ fontWeight: 'bold' }}
            />
          </Box>
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
              <Avatar sx={{ width: 32, height: 32 }}/>
            </StyledIconButton>
          </Tooltip>
        </Stack>
        <DashboardSetting {...{ open: openSetting, setOpen: setOpenSetting }} />
      </Toolbar>
    </AppBar>
  );
}