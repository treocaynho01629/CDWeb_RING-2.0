import PropTypes from 'prop-types';
import { useState } from 'react';
import { Toolbar, Typography, IconButton, Tooltip, Popover } from '@mui/material';
import { FilterList } from '@mui/icons-material';

export default function CustomTableToolbar({ filterComponent, icon, title, numSelected, submitIcon, submitTooltip, 
    onSubmitSelected }) {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (e) => { setAnchorEl(e.currentTarget) }
    const handleClose = () => { setAnchorEl(null) }
    const handleSubmitSelected = () => { if (onSubmitSelected) onSubmitSelected() }

    const open = Boolean(anchorEl);

    return (
        <Toolbar
            sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
                ...(numSelected > 0 && {
                    bgcolor: 'primary.light',
                    color: 'primary.contrastText'
                }),
            }}
        >
            <Typography
                sx={{ flex: '1 1 100%', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}
                variant="h6"
                id="tableTitle"
                component="div"
            >
                {icon}&nbsp;{numSelected > 0 ? `Chọn ${numSelected} ` : 'Danh sách '}{title}
            </Typography>
            {numSelected > 0 
                ? handleSubmitSelected !== undefined &&
                <Tooltip title={submitTooltip ?? 'Xác nhận'}>
                    <IconButton onClick={handleSubmitSelected} sx={{ color: 'primary.contrastText' }}>
                        {submitIcon}
                    </IconButton>
                </Tooltip>
                : filterComponent !== undefined &&
                <Tooltip title={`Lọc ${title}`}>
                    <IconButton onClick={handleClick} >
                        <FilterList />
                    </IconButton>
                </Tooltip>
            }
            {filterComponent !== undefined
                &&
                <Popover
                    id="filter-popover"
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                >
                    {filterComponent}
                </Popover>
            }
        </Toolbar>
    );
}

CustomTableToolbar.propTypes = {
    icon: PropTypes.element,
    title: PropTypes.string.isRequired,
    submitIcon: PropTypes.element,
    submitTooltip: PropTypes.string,
    numSelected: PropTypes.number,
    filterComponent: PropTypes.element,
    onSubmitSelected: PropTypes.func,
};