import styled from 'styled-components';
import {
    ShoppingCart as ShoppingCartIcon, DeliveryDining as DeliveryDiningIcon, Lock as LockIcon,
    Logout, Speed as SpeedIcon, NotificationsActive as NotificationsActiveIcon, Storefront, KeyboardArrowLeft
} from '@mui/icons-material';
import { Avatar, ListItemIcon, Divider, Box, SwipeableDrawer, List, ListItem, ListItemButton, ListItemText, Grid } from '@mui/material';
import { Link } from 'react-router-dom';

//#region styled
const DrawerLogo = styled.h2`
    position: relative;
    font-family: abel;
    font-size: 27px;
    text-transform: uppercase;
    font-weight: 500;
    color: ${props => props.theme.palette.secondary.main};
    cursor: pointer;
    align-items: center;
    display: flex;
    width: 251px;
    margin: 5px 5px 5px -5px;
    white-space: nowrap;
    overflow: hidden;
    transition: all 1.25s ease;

    @media (min-width: 450px) {
        margin: 5px 0px 5px 15px;
    }
`
//#endregion

const NavDrawer = ({ openDrawer, setOpen, toggleDrawer, auth, products, navigate, signOut, ImageLogo, Button }) => {
    const role = auth?.roles?.length;
    
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
                role="presentation"
            >
                <Box sx={{ marginY: '15px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Link to={`/`} onClick={toggleDrawer(false)} style={{ paddingLeft: '20px' }}>
                        <DrawerLogo>
                            <ImageLogo src="/bell.svg" className="logo" alt="RING! logo" />RING!&nbsp; <p style={{ color: '#424242', margin: 0 }}>- BOOKSTORE</p>
                        </DrawerLogo>
                    </Link>
                    <Button style={{ marginRight: '15px' }} onClick={toggleDrawer(false)}><KeyboardArrowLeft sx={{ fontSize: 26 }} /></Button>
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
                            <ListItemText primary="CỬA HÀNG" />
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
                            <ListItemText primary="THÔNG BÁO" />
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
                            <ListItemText>GIỎ HÀNG ({products?.length} SẢN PHẨM)</ListItemText>
                        </ListItemButton>
                    </ListItem>
                </List>
                <Divider />
                {auth?.userName
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
                                    <ListItemText primary={auth?.userName} />
                                </ListItemButton>
                            </ListItem>

                            <ListItem disablePadding>
                                <ListItemButton onClick={() => {
                                    navigate('/profile/receipts')
                                    setOpen(false)
                                }}>
                                    <ListItemIcon>
                                        <DeliveryDiningIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="ĐƠN GIAO" />
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
                                        <ListItemText primary="DASHBOARD" />
                                    </ListItemButton>
                                </ListItem>
                            )}

                            <ListItem disablePadding>
                                <ListItemButton onClick={signOut}>
                                    <ListItemIcon>
                                        <Logout />
                                    </ListItemIcon>
                                    <ListItemText primary="ĐĂNG XUẤT" />
                                </ListItemButton>
                            </ListItem>
                        </List>
                    </Grid>
                    :
                    <List sx={{ marginLeft: '15px' }}>
                        <ListItem disablePadding onClick={() => navigate('/login')}>
                            <ListItemButton>
                                <ListItemIcon>
                                    <LockIcon />
                                </ListItemIcon>
                                <ListItemText primary="ĐĂNG NHẬP" />
                            </ListItemButton>
                        </ListItem>
                    </List>
                }
            </Box>
        </SwipeableDrawer>
    )
}

export default NavDrawer