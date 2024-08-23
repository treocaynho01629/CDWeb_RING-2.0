import PropTypes from 'prop-types';
import { useState } from 'react';
import { Toolbar, Typography, IconButton, Tooltip, Popover } from '@mui/material';
import { Delete as DeleteIcon, FilterList } from '@mui/icons-material';

export default function CustomTableToolbar({ filterComponent, icon, title, numSelected, selectedAll, handleDeleteMultiples }) {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (e) => { setAnchorEl(e.currentTarget) }
    const handleClose = () => { setAnchorEl(null) }
    const handleDelete = () => { if (handleDeleteMultiples) handleDeleteMultiples() }

    const open = Boolean(anchorEl);

    return (
        <Toolbar
            sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
                ...((numSelected > 0 || selectedAll) && {
                    bgcolor: 'primary.light',
                    color: 'primary.contrastText'
                }),
            }}
        >
            {numSelected > 0 || selectedAll ? (
                <Typography
                    sx={{ flex: '1 1 100%', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}
                    variant="h6"
                    component="div"
                >
                    {icon}&nbsp;{selectedAll ? "Chọn tất cả" : `Chọn ${numSelected} ${title}`}
                </Typography>
            ) : (
                <Typography
                    sx={{ flex: '1 1 100%', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}
                    variant="h6"
                    id="tableTitle"
                    component="div"
                >
                    {icon}&nbsp;Danh sách {title}
                </Typography>
            )}

            {(numSelected > 0 || selectedAll) ?
                <Tooltip title={`Xoá ${title} đã chọn`}>
                    <IconButton onClick={handleDelete} sx={{color: 'primary.contrastText'}}>
                        <DeleteIcon />
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
    numSelected: PropTypes.number.isRequired,
    selectedAll: PropTypes.bool.isRequired,
};