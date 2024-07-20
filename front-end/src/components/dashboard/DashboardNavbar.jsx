import React, { useState } from 'react';
import styled from 'styled-components'
import { styled as muiStyled } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';

import { Toolbar, IconButton, Stack, Badge, Tooltip, Avatar, Menu, MenuItem, Divider, ListItemIcon} from '@mui/material';
import MuiAppBar from '@mui/material/AppBar';

import { Menu as MenuIcon, Logout, Home as HomeIcon, NotificationsActive as NotificationsActiveIcon} from '@mui/icons-material';

import { useNavigate, Link } from "react-router-dom";
import useLogout from "../../hooks/useLogout";
import useAuth from "../../hooks/useAuth";

//#region preStyled
const NavItem = styled.div`
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    margin-left: 15px;
`

const StyledIconButton = muiStyled(IconButton)(({ theme }) => ({
  '&:hover': {
      backgroundColor: 'transparent',
      color: '#63e399',
  },

  '&:focus':{
      outline: 'none',
  },

  outline: 'none',
  border: '0',
  borderRadius: '0',
}));

const StyledBadge = muiStyled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    left: -3,
    top: 4,
    border: `2px solid`,
    padding: '0 4px',
    color: 'white',
    backgroundColor: '#63e399'
  },
}));

const Logo = styled.h2`
    position: relative;
    font-family: abel;
    font-size: 27px;
    text-transform: uppercase;
    font-weight: 500;
    color: ${props => props.theme.palette.secondary.main};
    cursor: pointer;
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    margin: 5px 0px 5px 0px;
`

const ImageLogo = styled.img`
    width: 40px;
    height: 40px;
    margin-left: 15px;
    margin-right: 15px;
    padding: 0;
`

const drawerWidth = 250;

const AppBar = muiStyled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));
//#endregion

export default function DashboardNavbar(props) {
    const {open, setOpen} = props;
    const [anchorEl, setAnchorEl] = useState(null);
    const openProfile = Boolean(anchorEl);
    const theme = useTheme();
    const { auth } = useAuth();
    const navigate = useNavigate();
    const logout = useLogout();

    const signOut = async () => {
      await logout();
      const { enqueueSnackbar } = await import('notistack');
      navigate('/');
      enqueueSnackbar('Đã đăng xuất!', { variant: 'error' });
    }
  
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };

    const handleDrawerOpen = () => {
      setOpen(true);
    };

  return (
    <AppBar sx={{backgroundColor: 'white'}} position="fixed" open={open}>
    <Toolbar disableGutters sx={{justifyContent: 'space-between'}}>
      <div style={{display: 'flex', alignItems: 'center'}}>
        <ImageLogo style={{...(open && { display: 'none' })}} src="/bell.svg" className="logo" alt="RING! logo" />
        <IconButton
        color="inherit"
        aria-label="open drawer"
        onClick={handleDrawerOpen}
        edge="start"
        sx={{
            marginLeft: '5px',
            ...(open && { display: 'none' }),
        }}
        >
        <MenuIcon sx={{color: 'gray'}}/>
        </IconButton>
        <Link to={'/dashboard'} style={{marginLeft: '20px'}}>
            <Logo>
                RING!&nbsp; <p style={{color: '#424242', margin: 0}}>- DASHBOARD</p>
            </Logo>
        </Link>
      </div>
      <NavItem style={{marginRight: '20px'}}>
          <Stack spacing={1} direction="row" sx={{ color: 'action.active' }}>
              <StyledIconButton disableRipple disableFocusRipple aria-label="notification">
                  <StyledBadge badgeContent={0} anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'left',
                  }}>
                      <NotificationsActiveIcon/>
                  </StyledBadge>
                  <p style={{fontSize: '13px', marginLeft: '5px'}}>Thông báo</p>
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
                      <p style={{fontSize: '13px', marginLeft: '5px'}}>{auth.userName}</p>
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
            <Divider/>
            <MenuItem onClick={() => navigate('/')}>
                <ListItemIcon>
                    <HomeIcon fontSize="small" />
                </ListItemIcon>
                Trang chủ
            </MenuItem>
            <MenuItem onClick={signOut}>
                <ListItemIcon>
                    <Logout fontSize="small" />
                </ListItemIcon>
                Đăng xuất
            </MenuItem>
          </Menu>
      </NavItem>
    </Toolbar>
    </AppBar>
  );
}