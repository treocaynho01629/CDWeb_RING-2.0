import React, { useState } from 'react'
import styled from 'styled-components'
import { styled as muiStyled } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';

import { ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon, ExpandLess, ExpandMore
, Category as CategoryIcon, Group as GroupIcon, Person as PersonIcon
, Try as TryIcon, Equalizer as EqualizerIcon, TrendingUp as TrendingUpIcon, Receipt as ReceiptIcon
, AutoStories as AutoStoriesIcon, Speed as SpeedIcon } from '@mui/icons-material';
import { Divider, ListItem, ListItemButton, ListItemIcon, ListItemText, List, IconButton, Collapse } from '@mui/material';
import MuiDrawer from '@mui/material/Drawer';

import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

//#region preStyled
const drawerWidth = 250;

const ImageLogo = styled.img`
    width: 60px;
    height: 60px;
    margin-left: 85px;
    padding: 0;
`

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
    backgroundColor: '#fefefe',
});
  
const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
      width: `calc(${theme.spacing(8)} + 1px)`,
    },
});
  
const DrawerHeader = muiStyled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(0, 1),
    backgroundColor: '#63e399',
    ...theme.mixins.toolbar,
}));
  
const Drawer = muiStyled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
        ...openedMixin(theme),
        '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
        ...closedMixin(theme),
        '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);
//#endregion

const DashboardDrawer = (props) => {
    const {open, setOpen} = props;
    const [openList, setOpenList] = useState(true);
    const theme = useTheme();
    const navigate = useNavigate();
    const { auth } = useAuth();
    const [admin, setAdmin] = useState((auth?.roles?.find(role => ['ROLE_ADMIN'].includes(role.roleName))));

    const handleClick = (id) => {
      setOpenList((prevState) => ({ ...prevState, [id]: !prevState[id] }));
      setOpen(true);
    };

    const handleDrawerClose = () => {
      setOpen(false);
    };

  return (
    <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <ImageLogo src="/bell.svg" className="logo" alt="RING! logo" />
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          <ListItem key={0} disablePadding sx={{ display: 'block' }}>
            <ListItemButton onClick={() => navigate('/dashboard')}
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}
              >
              <SpeedIcon />
              </ListItemIcon>
              <ListItemText primary={"Dashboard"} sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>
        </List>
        <Divider />
        <List>
          <ListItem key={1} disablePadding sx={{ display: 'block' }}>
            <ListItemButton onClick={() => handleClick(1)}
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}
              >
                <AutoStoriesIcon/>
              </ListItemIcon>
              <ListItemText primary={'Quản lý sách'} sx={{ opacity: open ? 1 : 0 }} />
              {openList[1] ? <ExpandLess sx={{ display: open ? 'block' : 'none' }}/> 
              : <ExpandMore sx={{ display: open ? 'block' : 'none' }}/>}
            </ListItemButton>
          </ListItem>
          <Collapse in={openList[1]} timeout="auto" unmountOnExit sx={{ display: open ? 'block' : 'none' }}>
            <List component="div" disablePadding>
              <ListItemButton sx={{ pl: 4 }} onClick={() => navigate('/manage-books')}>
                <ListItemIcon>
                  <AutoStoriesIcon />
                </ListItemIcon>
                <ListItemText primary="Sách" />
              </ListItemButton>
              {admin ?
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemIcon>
                  <CategoryIcon />
                </ListItemIcon>
                <ListItemText primary="Danh mục | NXB" />
              </ListItemButton>
              : null}
            </List>
          </Collapse>

          {admin ?
          <>
          <ListItem key={2} disablePadding sx={{ display: 'block' }}>
            <ListItemButton onClick={() => handleClick(2)}
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}
              >
                <GroupIcon/>
              </ListItemIcon>
              <ListItemText primary={'Quản lý người dùng'} sx={{ opacity: open ? 1 : 0 }} />
              {openList[2] ? <ExpandLess sx={{ display: open ? 'block' : 'none' }}/> 
              : <ExpandMore sx={{ display: open ? 'block' : 'none' }}/>}
            </ListItemButton>
          </ListItem>
          <Collapse in={openList[2]} timeout="auto" unmountOnExit sx={{ display: open ? 'block' : 'none' }}>
            <List component="div" disablePadding>
              <ListItemButton sx={{ pl: 4 }} onClick={() => navigate('/manage-accounts')}>
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText primary="Người dùng" />
              </ListItemButton>
              <ListItemButton sx={{ pl: 4 }} onClick={() => navigate('/manage-reviews')}>
                <ListItemIcon>
                  <TryIcon />
                </ListItemIcon>
                <ListItemText primary="Đánh giá" />
              </ListItemButton>
            </List>
          </Collapse>
          </>
          : null}

          <ListItem key={3} disablePadding sx={{ display: 'block' }}>
            <ListItemButton onClick={() => handleClick(3)}
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}
              >
                <EqualizerIcon/>
              </ListItemIcon>
              <ListItemText primary={'Quản lý doanh thu'} sx={{ opacity: open ? 1 : 0 }} />
              {openList[3] ? <ExpandLess sx={{ display: open ? 'block' : 'none' }}/> 
              : <ExpandMore sx={{ display: open ? 'block' : 'none' }}/>}
            </ListItemButton>
          </ListItem>
          <Collapse in={openList[3]} timeout="auto" unmountOnExit sx={{ display: open ? 'block' : 'none' }}>
            <List component="div" disablePadding>
              <ListItemButton sx={{ pl: 4 }} onClick={() => navigate('/manage-receipts')}>
                <ListItemIcon>
                  <TrendingUpIcon />
                </ListItemIcon>
                <ListItemText primary="Doanh thu" />
              </ListItemButton>
            </List>
          </Collapse>
        </List>
      </Drawer>
  )
}

export default DashboardDrawer