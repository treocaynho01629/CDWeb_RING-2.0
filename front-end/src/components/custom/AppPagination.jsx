import styled from "styled-components"
import { useEffect, useState } from 'react'
import { styled as muiStyled } from '@mui/system';
import { Pagination, PaginationItem, Stack, MenuItem, TextField } from '@mui/material';

//#region styled
const Container = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;

    ${props => props.theme.breakpoints.down("sm")} {
        justify-content: center;
    }
`

const StyledPageItem = muiStyled(PaginationItem)(({ theme }) => ({
    backgroundColor: theme.palette.action.focus,

    '&:hover': {
        backgroundColor: theme.palette.primary.light,
        color: theme.palette.primary.contrastText,
    },

    '&.Mui-disabled': {
        display: 'none',
    },

    '&.MuiPaginationItem-ellipsis': {
        backgroundColor: 'transparent',
        fontWeight: 'bold',
    },
}));
//#endregion

const AppPagination = ({ pagination, onPageChange, onSizeChange }) => {
    //Initial value
    const [page, setPage] = useState(pagination.currPage + 1);
    const [count, setCount] = useState(pagination.totalPages ?? 0);

    //Update value
    useEffect(() => {
        setPage(pagination?.currPage + 1);
        setCount(pagination?.totalPages);
    }, [pagination])

    //Change current page
    const handlePageChange = (e, page) => { if (onPageChange) onPageChange(page) }

    //Change amount display
    const handleChangeSize = (e) => { if (onSizeChange) onSizeChange(e.target.value) }

    return (
        <Container>
            <Stack spacing={2} sx={{ my: 5 }}>
                <Pagination
                    count={count ? count : 0}
                    shape="rounded"
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                    renderItem={(item) => (
                        <StyledPageItem {...item} />
                    )}
                />
            </Stack>
            <TextField
                size="small"
                select
                value={pagination?.pageSize}
                onChange={handleChangeSize}
                sx={{ display: { xs: 'none', sm: 'block' } }}
            >
                <MenuItem value={8}>Hiển thị 8</MenuItem>
                <MenuItem value={16}>Hiển thị 16</MenuItem>
                <MenuItem value={24}>Hiển thị 24</MenuItem>
                <MenuItem value={48}>Hiển thị 48</MenuItem>
            </TextField>
        </Container>
    )
}

export default AppPagination