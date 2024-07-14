import { DeliveryDining as DeliveryDiningIcon, Logout, Speed as SpeedIcon } from '@mui/icons-material';
import { Avatar, Menu, MenuItem, ListItemIcon, Divider } from '@mui/material';

const ProfilePopover = ({ open, anchorEl, handleClose, navigate, auth, signOut }) => {
    const role = auth?.roles?.length;

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
            <MenuItem onClick={() => {
                navigate('/profile/detail')
            }}>
                <Avatar /> Thông tin tài khoản
            </MenuItem>
            <MenuItem onClick={() => {
                navigate('/profile/receipts')
            }}>
                <ListItemIcon>
                    <DeliveryDiningIcon fontSize="small" />
                </ListItemIcon>
                Đơn giao
            </MenuItem>
            <Divider />
            {role >= 2 && (
                <MenuItem onClick={() => {
                    navigate('/dashboard')
                }}>
                    <ListItemIcon>
                        <SpeedIcon fontSize="small" />
                    </ListItemIcon>
                    Dashboard
                </MenuItem>
            )}
            <MenuItem onClick={signOut}>
                <ListItemIcon>
                    <Logout fontSize="small" />
                </ListItemIcon>
                Đăng xuất
            </MenuItem>
        </Menu>
    )
}

export default ProfilePopover