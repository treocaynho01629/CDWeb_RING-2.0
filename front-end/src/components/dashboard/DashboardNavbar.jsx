import { styled as muiStyled } from '@mui/material/styles';
import { useState } from 'react';
import { Toolbar, IconButton, Stack, Badge, Tooltip, Avatar, Menu, MenuItem, Divider, ListItemIcon, Box, alpha, Chip, Typography } from '@mui/material';
import { Menu as MenuIcon, Logout, Home as HomeIcon, NotificationsNone, SettingsOutlined } from '@mui/icons-material';
import { useNavigate } from "react-router-dom";
import MuiAppBar from '@mui/material/AppBar';
import useLogout from "../../hooks/useLogout";
import useAuth from '../../hooks/useAuth';

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
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: alpha(theme.palette.background.default, 0.5),
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
  const [anchorEl, setAnchorEl] = useState(null);
  const openProfile = Boolean(anchorEl);
  const navigate = useNavigate();
  const logout = useLogout();

  const handleClick = (event) => { setAnchorEl(event.currentTarget) };
  const handleClose = () => { setAnchorEl(null) };
  const handleToggleDrawer = () => { setOpen(prev => !prev) };

  return (
    <AppBar position="sticky" open={open} elevation={0}>
      <Toolbar disableGutters sx={{ justifyContent: 'space-between', padding: '5px 10px' }}>
        <Box display={'flex'} alignItems={'center'}>
          <IconButton aria-label="open drawer" onClick={handleToggleDrawer}>
            <MenuIcon />
          </IconButton>
          <Box display={'flex'} alignItems={'center'} px={1}>
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
          <StyledIconButton disableRipple disableFocusRipple aria-label="notification">
            <Badge badgeContent={0} anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}>
              <NotificationsNone />
            </Badge>
          </StyledIconButton>
          <StyledIconButton disableRipple disableFocusRipple aria-label="notification">
            <SettingsOutlined />
          </StyledIconButton>
          <Tooltip title="Tài khoản">
            <StyledIconButton
              disableRipple disableFocusRipple
              onClick={handleClick}
              size="small"
              sx={{ ml: 2 }}
              aria-controls={openProfile ? 'account-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={openProfile ? 'true' : undefined}
            >
              <Avatar sx={{ width: 32, height: 32 }}>M</Avatar>
            </StyledIconButton>
          </Tooltip>
        </Stack>
        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={openProfile}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              borderRadius: 0,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem>
            <Avatar /> Thông tin tài khoản
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => navigate('/')}>
            <ListItemIcon>
              <HomeIcon fontSize="small" />
            </ListItemIcon>
            Trang chủ
          </MenuItem>
          <MenuItem onClick={logout}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            Đăng xuất
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}