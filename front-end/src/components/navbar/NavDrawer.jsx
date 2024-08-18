import styled from 'styled-components';
import {
    ShoppingCart as ShoppingCartIcon, DeliveryDining as DeliveryDiningIcon, Lock as LockIcon,
    Logout, Speed as SpeedIcon, NotificationsActive as NotificationsActiveIcon, Storefront, KeyboardArrowLeft,
    Brightness3,
    Brightness7
} from '@mui/icons-material';
import { Avatar, ListItemIcon, Divider, Box, SwipeableDrawer, List, ListItem, ListItemButton, ListItemText, Grid, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';

//#region styled
const DrawerLogo = styled.h2`
    position: relative;
    font-family: abel;
    text-transform: uppercase;
    font-size: 27px;
    font-weight: 500;
    color: ${props => props.theme.palette.primary.main};
    align-items: center;
    display: flex;
    white-space: nowrap;
    margin: 5px 0px 5px 15px;

    p {
        color: ${props => props.theme.palette.text.secondary};
        margin: 0;
    }

    ${props => props.theme.breakpoints.down("sm")} {
        margin: 5px 5px 5px -5px;
    }
`
//#endregion

const NavDrawer = ({ location, openDrawer, setOpen, toggleDrawer, username, roles, products, navigate, logout, ImageLogo, theme, colorMode }) => {
    const role = roles?.length;

    return (
        <SwipeableDrawer
            anchor='left'
            open={openDrawer}
            onOpen={toggleDrawer(true)}
            onClose={toggleDrawer(false)}
            disableSwipeToOpen={false}
            ModalProps={{
                keepMounted: true,
            }}
        >
            <Box
                sx={{
                    width: 'auto',
                    ["@media (min-width:450px)"]: { width: 400 }
                }}
            >
                <Box sx={{ marginY: '15px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Link to={`/`} onClick={toggleDrawer(false)} style={{ paddingLeft: '20px' }}>
                        <DrawerLogo>
                            <ImageLogo src="/bell.svg" className="logo" alt="RING! logo" />RING!&nbsp; <p>- BOOKSTORE</p>
                        </DrawerLogo>
                    </Link>
                    <IconButton sx={{ marginRight: '15px' }} onClick={toggleDrawer(false)}><KeyboardArrowLeft sx={{ fontSize: 26 }} /></IconButton>
                </Box>
                <Divider />
                <List sx={{ marginLeft: '15px' }}>
                    <ListItem disablePadding onClick={() => {
                        navigate('/filters')
                        setOpen(false)
                    }}>
                        <ListItemButton>
                            <ListItemIcon>
                                <Storefront />
                            </ListItemIcon>
                            <ListItemText primary="Cửa hàng" />
                        </ListItemButton>
                    </ListItem>
                </List>
                <Divider />
                <List sx={{ marginLeft: '15px' }}>
                    <ListItem disablePadding onClick={toggleDrawer(false)}>
                        <ListItemButton>
                            <ListItemIcon>
                                <NotificationsActiveIcon />
                            </ListItemIcon>
                            <ListItemText primary="Thông báo" />
                        </ListItemButton>
                    </ListItem>

                    <ListItem disablePadding onClick={() => {
                        navigate('/cart')
                        setOpen(false)
                    }}>
                        <ListItemButton >
                            <ListItemIcon>
                                <ShoppingCartIcon />
                            </ListItemIcon>
                            <ListItemText primary={`Giỏ hàng (${products?.length} sản phẩm)`} />
                        </ListItemButton>
                    </ListItem>
                </List>
                <Divider />
                {username
                    ?
                    <Grid>
                        <List sx={{ marginLeft: '15px' }}>
                            <ListItem disablePadding>
                                <ListItemButton onClick={() => {
                                    navigate('/profile/detail')
                                    setOpen(false)
                                }}>
                                    <ListItemIcon>
                                        <Avatar />
                                    </ListItemIcon>
                                    <ListItemText primary={username} />
                                </ListItemButton>
                            </ListItem>

                            <ListItem disablePadding>
                                <ListItemButton onClick={() => {
                                    navigate('/profile/orders')
                                    setOpen(false)
                                }}>
                                    <ListItemIcon>
                                        <DeliveryDiningIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Đơn giao" />
                                </ListItemButton>
                            </ListItem>
                        </List>
                        <Divider />
                        <List sx={{ marginLeft: '15px' }}>
                            {role >= 2 && (
                                <ListItem disablePadding onClick={() => navigate('/dashboard')}>
                                    <ListItemButton>
                                        <ListItemIcon>
                                            <SpeedIcon />
                                        </ListItemIcon>
                                        <ListItemText primary="Dashboard" />
                                    </ListItemButton>
                                </ListItem>
                            )}
                            <ListItem disablePadding>
                                <ListItemButton onClick={colorMode.toggleColorMode}>
                                    <ListItemIcon>
                                        {theme.palette.mode === 'dark' ? <Brightness3 fontSize="small" /> : <Brightness7 fontSize="small" />}
                                    </ListItemIcon>
                                    <ListItemText primary={theme.palette.mode === 'dark' ? 'Chủ đề tối' : 'Chủ đề mặc định'} />
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemButton onClick={() => logout()}>
                                    <ListItemIcon>
                                        <Logout />
                                    </ListItemIcon>
                                    <ListItemText primary="Đăng xuất" />
                                </ListItemButton>
                            </ListItem>
                        </List>
                    </Grid>
                    :
                    <List sx={{ marginLeft: '15px' }}>
                        <ListItem disablePadding onClick={() => navigate('/login', { state: { from: location }, replace: true })}>
                            <ListItemButton>
                                <ListItemIcon>
                                    <LockIcon />
                                </ListItemIcon>
                                <ListItemText primary="Đăng nhập" />
                            </ListItemButton>
                        </ListItem>
                    </List>
                }
            </Box>
        </SwipeableDrawer >
    )
}

export default NavDrawer