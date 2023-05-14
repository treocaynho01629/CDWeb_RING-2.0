import * as React from 'react';
import styled from 'styled-components'
import { styled as otherStyled } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';

import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

import { useNavigate, Link } from "react-router-dom";

const Logo = styled.h2`
    position: relative;
    font-family: abel;
    font-size: 27px;
    text-transform: uppercase;
    font-weight: 500;
    color: #63e399;
    cursor: pointer;
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    margin: 5px 0px 5px 0px;
`

const ImageLogo = styled.img`
    width: 40px;
    height: 40px;
    margin: 0 10px 0 0;
    padding: 0;
`

const drawerWidth = 300;

const AppBar = otherStyled(MuiAppBar, {
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

export default function DashboardNavbar(props) {
    const {open, setOpen} = props;
    const theme = useTheme();
  

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  return (
    <AppBar sx={{backgroundColor: 'white'}} position="fixed" open={open}>
    <Toolbar>
        <IconButton
        color="inherit"
        aria-label="open drawer"
        onClick={handleDrawerOpen}
        edge="start"
        sx={{
            ...(open && { display: 'none' }),
        }}
        >
        <MenuIcon sx={{color: 'gray'}}/>
        </IconButton>
        <Link to={`/`} 
        style={{
            paddingLeft: '20px',
            ...(open && { display: 'none' }),
        }}>
            <Logo>
                <ImageLogo src="/bell.svg" className="logo" alt="RING! logo" />RING!&nbsp; <p style={{color: '#424242', margin: 0}}>- BOOKSTORES</p>
            </Logo>
        </Link>
    </Toolbar>
    </AppBar>
  );
}