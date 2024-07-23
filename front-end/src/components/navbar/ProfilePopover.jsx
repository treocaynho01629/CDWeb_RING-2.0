import { DeliveryDining as DeliveryDiningIcon, Logout, Speed as SpeedIcon } from '@mui/icons-material';
import { Avatar, Menu, MenuItem, ListItemIcon, Divider } from '@mui/material';
import { Link } from 'react-router-dom';

const ProfilePopover = ({ open, anchorEl, handleClose, navigate, roles, logout }) => {
    const role = roles?.length;

    return (
        <Menu
            id="account-menu"
            open={open}
            anchorEl={anchorEl}
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
            <Link to={'/profile/detail'} style={{ color: 'inherit' }}>
                <MenuItem onClick={() => handleClose()}>
                    <Avatar /> Thông tin tài khoản
                </MenuItem>
            </Link>
            <Link to={'/profile/receipts'} style={{ color: 'inherit' }}>
                <MenuItem onClick={() => handleClose()}>
                    <ListItemIcon>
                        <DeliveryDiningIcon fontSize="small" />
                    </ListItemIcon>
                    Đơn giao
                </MenuItem>
            </Link>
            <Divider />
            {role >= 2 && (
                <Link to={'/dashboard'} style={{ color: 'inherit' }}>
                    <MenuItem onClick={() => handleClose()}>
                        <ListItemIcon>
                            <SpeedIcon fontSize="small" />
                        </ListItemIcon>
                        Dashboard
                    </MenuItem>
                </Link>
            )}
            <MenuItem onClick={() => logout()}>
                <ListItemIcon>
                    <Logout fontSize="small" />
                </ListItemIcon>
                Đăng xuất
            </MenuItem>
        </Menu>
    )
}

export default ProfilePopover