import { Avatar, Menu, MenuItem, Paper } from '@mui/material';

const ShopSelect = ({ open, anchorEl, handleClose, shop, data }) => {
    let shopsContent;

    if (data) {
        const { ids, entities } = data;

        shopsContent = ids?.length
            ? ids?.map((id, index) => {
                const shop = entities[id];

                return (
                    <MenuItem key={`${id}-${index}`} value={id} sx={{ px: 1, fontSize: 14 }}>
                        <Avatar
                            src={shop?.image ? shop.image + '?size=tiny' : null}
                            sx={{ width: 22, height: 22, mr: 1 }}
                        /> {shop?.name}
                    </MenuItem>
                )
            })
            :
            <MenuItem sx={{ px: 1, fontSize: 14 }}>
                Thêm cửa hàng
            </MenuItem>
    }

    return (
        <Menu
            id="shop-menu"
            open={open}
            value={shop}
            anchorEl={anchorEl}
            onClose={handleClose}
            onClick={handleClose}
            transitionDuration={200}
            slotProps={{
                paper: {
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        bgcolor: 'background.paper',
                        mt: 1,
                        ml: -.5
                    },
                }
            }}
            MenuListProps={{ sx: { padding: .5 } }}
            transformOrigin={{ horizontal: 'left', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        >
            <Paper elevation={7} sx={{
                display: 'block',
                position: 'absolute',
                top: 0,
                left: 17,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                boxShadow: 'none',
                zIndex: 0,
            }} />
            <MenuItem value={''} sx={{ px: 1, fontSize: 14 }}>
                <Avatar sx={{ width: 22, height: 22, mr: 1 }}/> Tổng thể
            </MenuItem>
            {shopsContent}
        </Menu>
    )
}

export default ShopSelect