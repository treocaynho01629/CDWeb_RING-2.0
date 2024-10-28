import styled from "styled-components"
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

const StyledPageItem = styled(PaginationItem)`
    background-color: ${props => props.theme.palette.action.focus};

    &:hover {
        background-color: ${props => props.theme.palette.primary.light};
        color: ${props => props.theme.palette.primary.contrastText};
    }

    &.Mui-disabled {
        display: none;
    }

    &.MuiPaginationItem-ellipsis {
        background-color: transparent;
        font-weight: bold;
    }
`
//#endregion

const AppPagination = ({ mobileMode, pagination, onPageChange, onSizeChange }) => {
    //Initial value
    const currPage = pagination?.currPage + 1;
    const totalPages = pagination?.totalPages;

    //Change current page
    const handlePageChange = (e, page) => { if (onPageChange) onPageChange(page) }

    //Change amount display
    const handleChangeSize = (e) => { if (onSizeChange) onSizeChange(e.target.value) }

    return (
        <Container>
            <Stack spacing={2} sx={{ my: 5 }}>
                <Pagination
                    page={currPage ?? 1}
                    count={totalPages}
                    shape="rounded"
                    color="primary"
                    onChange={handlePageChange}
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
                <MenuItem value={12}>Hiển thị 12</MenuItem>
                <MenuItem value={24}>Hiển thị 24</MenuItem>
                <MenuItem value={48}>Hiển thị 48</MenuItem>
            </TextField>
        </Container>
    )
}

export default AppPagination