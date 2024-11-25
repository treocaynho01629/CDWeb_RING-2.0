import { Brightness3, Brightness7, DeliveryDiningOutlined, LockOutlined, SettingsBrightness, Speed } from '@mui/icons-material';
import { Avatar, Menu, MenuItem, ListItemIcon, Divider } from '@mui/material';
import { Link } from 'react-router';

const ProfilePopover = ({ open, image, anchorEl, handleClose, roles, logout, mode, toggleMode }) => {
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
            transitionDuration={200}
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
                    <Avatar src={image ? image + '?size=tiny' : null} /> Thông tin tài khoản
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
            {mode &&
                <MenuItem aria-label="toggle-mode" onClick={toggleMode} >
                    <ListItemIcon>
                        {mode === 'dark' ? <Brightness3 fontSize="small" />
                            : mode === 'light' ? <Brightness7 fontSize="small" />
                                : mode === 'system' ? <SettingsBrightness fontSize="small" /> : ''}
                    </ListItemIcon>
                    {mode === 'dark' ? 'Chủ đề tối'
                        : mode === 'light' ? 'Chủ đề mặc định'
                            : mode === 'system' ? 'Theo hệ thống' : ''}
                </MenuItem>
            }
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