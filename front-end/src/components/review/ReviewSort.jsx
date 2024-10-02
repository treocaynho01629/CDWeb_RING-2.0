import styled from 'styled-components'
import { MenuItem, TextField } from '@mui/material'
import { rateLabels } from '../../ultils/filters';
import { Star } from '@mui/icons-material';

//#region styled
const SortContainer = styled.div`
    display: flex;
    align-items: center;
    padding: 5px 0;
`

const SortLabel = styled.b`
    margin-right: 16px;

    ${props => props.theme.breakpoints.down("sm")} {
        display: none;
    }
`
//#endregion

const ReviewSort = ({ sortBy, handleChangeOrder, filterBy, handleChangeFilter, count }) => {
    return (
        <SortContainer>
            <SortLabel>Lọc theo</SortLabel>
            <TextField
                size="small"
                select
                value={sortBy}
                onChange={handleChangeOrder}
                sx={{ marginRight: 1 }}
            >
                <MenuItem value={'createdDate'}>Xếp theo mới nhất</MenuItem>
                <MenuItem value={'rating'}>Xếp theo đánh giá</MenuItem>
            </TextField>
            <TextField
                size="small"
                select
                value={filterBy}
                onChange={handleChangeFilter}
                slotProps={{
                    input: {
                        startAdornment: <Star fontSize="inherit" sx={{ mr: 1, color: 'warning.light' }} />,
                    }
                }}
            >
                <MenuItem value={'all'} selected>Tất cả</MenuItem>
                {Object.entries(rateLabels).map(([value, label]) => (
                    <MenuItem key={`filter-item=${value}`} value={value}>{value} ({label} - {count[value]})</MenuItem>
                ))}
            </TextField>
        </SortContainer>
    )
}

export default ReviewSort