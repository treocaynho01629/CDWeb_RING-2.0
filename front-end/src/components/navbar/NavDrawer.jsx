import { styled } from '@mui/material/styles';
import {
    ShoppingCartOutlined, DeliveryDiningOutlined, LockOutlined, Logout, Speed, NotificationsOutlined,
    Storefront, KeyboardArrowLeft, Brightness3, Brightness7,
} from '@mui/icons-material';
import { Avatar, ListItemIcon, Divider, Box, SwipeableDrawer, List, ListItem, ListItemButton, ListItemText, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import { LogoImage } from '../custom/GlobalComponents';

//#region styled
const DrawerLogo = styled('div')`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 5px;
    width: 100%;
`

const DrawerContainer = styled(Box)(({ theme }) => `
    padding-left: ${theme.spacing(1.5)};
    padding-right: ${theme.spacing(1.5)};
    width: auto;    

    @media (min-width: 450px) {
        width: 400px;
    }
`)
//#endregion

const NavDrawer = ({ location, openDrawer, handleOpen, handleClose, username, roles, products, logout, theme, colorMode }) => {
    const role = roles?.length;

    return (
        <SwipeableDrawer
            anchor='left'
            open={openDrawer}
            onOpen={handleOpen}
            onClose={handleClose}
            disableSwipeToOpen={true}
        >
            <DrawerContainer>
                <Box sx={{ marginY: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Link to={'/'} onClick={handleClose}>
                        <DrawerLogo>
                            <LogoImage src="/full-logo.svg" className="logo" alt="RING! logo" />
                        </DrawerLogo>
                    </Link>
                    <IconButton onClick={handleClose}><KeyboardArrowLeft sx={{ fontSize: 26 }} /></IconButton>
                </Box>
                <Divider />
                <List>
                    <Link to={'/store'}>
                        <ListItem disablePadding onClick={handleClose}>
                            <ListItemButton>
                                <ListItemIcon>
                                    <Storefront />
                                </ListItemIcon>
                                <ListItemText primary="Cửa hàng" />
                            </ListItemButton>
                        </ListItem>
                    </Link>
                </List>
                <Divider />
                <List>
                    <ListItem disablePadding onClick={handleClose}>
                        <ListItemButton>
                            <ListItemIcon>
                                <NotificationsOutlined />
                            </ListItemIcon>
                            <ListItemText primary="Thông báo" />
                        </ListItemButton>
                    </ListItem>
                    <Link to={'/cart'}>
                        <ListItem disablePadding onClick={handleClose}>
                            <ListItemButton >
                                <ListItemIcon>
                                    <ShoppingCartOutlined />
                                </ListItemIcon>
                                <ListItemText primary={`Giỏ hàng (${products?.length} sản phẩm)`} />
                            </ListItemButton>
                        </ListItem>
                    </Link>
                </List>
                <Divider />
                {username
                    ?
                    <Box>
                        <List>
                            <ListItem disablePadding>
                                <Link to={'/profile/detail'}>
                                    <ListItemButton onClick={handleClose}>
                                        <ListItemIcon>
                                            <Avatar />
                                        </ListItemIcon>
                                        <ListItemText primary={username} />
                                    </ListItemButton>
                                </Link>
                            </ListItem>

                            <ListItem disablePadding>
                                <Link to={'/profile/orders'}>
                                    <ListItemButton onClick={handleClose}>
                                        <ListItemIcon>
                                            <DeliveryDiningOutlined />
                                        </ListItemIcon>
                                        <ListItemText primary="Đơn giao" />
                                    </ListItemButton>
                                </Link>
                            </ListItem>
                        </List>
                        <Divider />
                        <List>
                            {role >= 2 && (
                                <Link to={'/dashboard'}>
                                    <ListItem disablePadding onClick={handleClose}>
                                        <ListItemButton>
                                            <ListItemIcon>
                                                <Speed />
                                            </ListItemIcon>
                                            <ListItemText primary="Dashboard" />
                                        </ListItemButton>
                                    </ListItem>
                                </Link>
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
                    </Box>
                    :
                    <List>
                        <Link to={'/auth/login'} state={{ from: location }} replace title="Đăng nhập">
                            <ListItem disablePadding onClick={handleClose}>
                                <ListItemButton>
                                    <ListItemIcon>
                                        <LockOutlined />
                                    </ListItemIcon>
                                    <ListItemText primary="Đăng nhập" />
                                </ListItemButton>
                            </ListItem>
                        </Link>
                    </List>
                }
            </DrawerContainer>
        </SwipeableDrawer >
    )
}

export default NavDrawer