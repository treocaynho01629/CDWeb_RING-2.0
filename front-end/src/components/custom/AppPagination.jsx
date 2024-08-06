import styled from "styled-components"
import { useEffect, useState } from 'react'
import { styled as muiStyled } from '@mui/system';
import { Pagination, PaginationItem, Stack, MenuItem } from '@mui/material';
import CustomInput from './CustomInput';

//#region styled
const Container = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`

const StyledPageItem = muiStyled(PaginationItem)(({ theme }) => ({
    backgroundColor: theme.palette.action.focus,

    '&:hover': {
        backgroundColor: theme.palette.secondary.light,
        color: theme.palette.secondary.contrastText,
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

const AppPagination = (props) => {
    const { pagination, onPageChange, onSizeChange } = props;

    //Initial value
    const [page, setPage] = useState(pagination.currPage);
    const [count, setCount] = useState(pagination.totalPages);

    //Update value
    useEffect(() => {
        setPage(pagination?.currPage + 1);
        setCount(pagination?.totalPages);
    }, [pagination])

    //Change current page
    const handlePageChange = (event, page) => {
        if (onPageChange) {
            onPageChange(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    //Change amount display
    const handleChangeSize = (event) => { if (onSizeChange) onSizeChange(event.target.value) }

    return (
        <Container>
            <Stack spacing={2} sx={{ my: 5 }}>
                <Pagination 
                count={count ? count : 0} 
                    shape="rounded"
                    page={page}
                    onChange={handlePageChange}
                    color="secondary"
                    renderItem={(item) => (
                        <StyledPageItem  {...item} />
                    )}
                />
            </Stack>
            <CustomInput
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
            </CustomInput>
        </Container>
    )
}

export default AppPagination