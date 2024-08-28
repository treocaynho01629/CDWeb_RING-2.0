import { styled } from '@mui/system';
import {
    ShoppingCart, DeliveryDining as DeliveryDiningIcon, Lock as LockIcon, Logout, Speed as SpeedIcon, Notifications,
    Storefront, KeyboardArrowLeft, Brightness3, Brightness7
} from '@mui/icons-material';
import { Avatar, ListItemIcon, Divider, Box, SwipeableDrawer, List, ListItem, ListItemButton, ListItemText, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';

//#region styled
const DrawerLogo = styled('h2')`
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

const DrawerContainer = styled(Box)(({ theme }) => `
    padding-left: ${theme.spacing(1.5)};
    padding-right: ${theme.spacing(1.5)};
    width: auto;    

    @media (min-width: 450px) {
        width: 400px;
    }
`)
//#endregion

const NavDrawer = ({ location, openDrawer, setOpen, username, roles, products,
    logout, ImageLogo, theme, colorMode }) => {
    const role = roles?.length;

    const handleOpen = () => { setOpen(true) }
    const handleClose = () => { setOpen(false) }

    return (
        <SwipeableDrawer
            anchor='left'
            open={openDrawer}
            onOpen={handleOpen}
            onClose={handleClose}
            disableSwipeToOpen={false}
            ModalProps={{ keepMounted: true }}
        >
            <DrawerContainer>
                <Box sx={{ marginY: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Link to={`/`} onClick={handleClose}>
                        <DrawerLogo>
                            <ImageLogo src="/bell.svg" className="logo" alt="RING! logo" />RING!&nbsp; <p>- BOOKSTORE</p>
                        </DrawerLogo>
                    </Link>
                    <IconButton onClick={handleClose}><KeyboardArrowLeft sx={{ fontSize: 26 }} /></IconButton>
                </Box>
                <Divider />
                <List>
                    <Link to={'/filters'}>
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
                                <Notifications />
                            </ListItemIcon>
                            <ListItemText primary="Thông báo" />
                        </ListItemButton>
                    </ListItem>
                    <Link to={'/cart'}>
                        <ListItem disablePadding onClick={handleClose}>
                            <ListItemButton >
                                <ListItemIcon>
                                    <ShoppingCart />
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
                                            <DeliveryDiningIcon />
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
                                                <SpeedIcon />
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
                        <Link to={'/login'} state={{ from: location }} replace title="Đăng nhập">
                            <ListItem disablePadding onClick={handleClose}>
                                <ListItemButton>
                                    <ListItemIcon>
                                        <LockIcon />
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