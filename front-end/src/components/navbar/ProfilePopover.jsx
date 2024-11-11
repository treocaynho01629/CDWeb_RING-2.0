import { Brightness3, Brightness7, DeliveryDiningOutlined, LockOutlined, Speed } from '@mui/icons-material';
import { Avatar, Menu, MenuItem, ListItemIcon, Divider } from '@mui/material';
import { Link } from 'react-router-dom';

const ProfilePopover = ({ open, image, anchorEl, handleClose, roles, logout, theme, colorMode }) => {
    const role = roles?.length;

    return (
        <Menu
            id="account-menu"
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            onClick={handleClose}
            disableRestoreFocus
            disableScrollLock
            sx={{ pointerEvents: 'none', }}
            slotProps={{
                paper: {
                    elevation: 0,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        bgcolor: 'background.elevate',
                        mt: 1.5,
                        borderRadius: 0,
                        pointerEvents: 'auto',

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
                            bgcolor: 'background.elevate',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    },
                    onMouseLeave: handleClose
                }
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
            <Link to={'/profile/detail'} style={{ color: 'inherit' }}>
                <MenuItem>
                    <Avatar src={image ? image + '?size=tiny' : null}/> Thông tin tài khoản
                </MenuItem>
            </Link>
            <Link to={'/profile/order'} style={{ color: 'inherit' }}>
                <MenuItem>
                    <ListItemIcon>
                        <DeliveryDiningOutlined fontSize="small" />
                    </ListItemIcon>
                    Đơn giao
                </MenuItem>
            </Link>
            <Divider />
            {role >= 2 && (
                <Link to={'/dashboard'} style={{ color: 'inherit' }}>
                    <MenuItem>
                        <ListItemIcon>
                            <Speed fontSize="small" />
                        </ListItemIcon>
                        Dashboard
                    </MenuItem>
                </Link>
            )}
            <MenuItem aria-label="toggle-mode" onClick={colorMode.toggleColorMode} >
                <ListItemIcon>
                    {theme.palette.mode === 'dark' ? <Brightness3 fontSize="small" /> : <Brightness7 fontSize="small" />}
                </ListItemIcon>
                {theme.palette.mode === 'dark' ? 'Chủ đề tối' : 'Chủ đề mặc định'}
            </MenuItem>
            <MenuItem onClick={() => logout()}>
                <ListItemIcon>
                    <LockOutlined fontSize="small" />
                </ListItemIcon>
                Đăng xuất
            </MenuItem>
        </Menu>
    )
}

export default ProfilePopover