import PropTypes from 'prop-types';
import { visuallyHidden } from '@mui/utils';
import { Box, TableCell, TableHead, TableRow, TableSortLabel, Checkbox } from '@mui/material';

export default function CustomTableHead({ headCells, onSelectAllClick, sortDir, sortBy, numSelected, onRequestSort, selectedAll }) {
    const createSortHandler = (property) => (e) => { onRequestSort(e, property) };

    return (
        <TableHead>
            <TableRow sx={{ height: '58px' }}>
                <TableCell padding="checkbox">
                    <Checkbox
                        color="primary"
                        indeterminate={numSelected > 0 && !selectedAll}
                        checked={selectedAll}
                        onChange={onSelectAllClick}
                        inputProps={{ 'aria-label': 'Chọn tất cả' }}
                    />
                </TableCell>
                {headCells.map((headCell, index) => (
                    <TableCell
                        key={`${headCell.id}-${index}`}
                        align={headCell.align}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        style={{ width: headCell.width }}
                        sortDirection={sortBy === headCell.id ? sortDir : false}
                    >
                        {headCell.sortable ? (
                            <TableSortLabel
                                active={sortBy === headCell.id}
                                direction={sortBy === headCell.id ? sortDir : 'asc'}
                                onClick={createSortHandler(headCell.id)}
                            >
                                {headCell.label}
                                {sortBy === headCell.id ? (
                                    <Box component="span" sx={visuallyHidden}>
                                        {sortDir === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                    </Box>
                                ) : null}
                            </TableSortLabel>
                        ) : (
                            <TableSortLabel hideSortIcon>
                                {headCell.label}
                            </TableSortLabel>
                        )}
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

CustomTableHead.propTypes = {
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
};