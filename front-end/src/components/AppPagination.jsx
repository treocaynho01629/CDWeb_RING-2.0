import { useEffect, useState } from 'react'

import styled from "styled-components"
import { styled as muiStyled } from '@mui/system';

import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import MenuItem from "@mui/material/MenuItem"

//#region styled
const Container = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`

const StyledPageItem = muiStyled(PaginationItem)(({ theme }) => ({
    borderRadius: 0,
    backgroundColor: 'lightgray',

    '&:hover': {
        backgroundColor: '#63e399',
        color:'white',
    },

    '&:focus': {
        outline: 'none',
        border: 'none'
    },

    '&.Mui-disabled': {
        display: 'none',
    },

    '&.MuiPaginationItem-ellipsis': {
        backgroundColor: 'transparent',
        fontWeight: 'bold',
    },

    '&.Mui-selected': {
        backgroundColor: '#63e399',
        color:'white',
    },
}));

const CustomInput = styled(TextField)({
    '& .MuiInputBase-root': {
        borderRadius: 0,
        padding: 0,
        height: '42px',
    },
    '& label.Mui-focused': {
        color: '#A0AAB4'
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: '#B2BAC2',
    },
    '& .MuiOutlinedInput-root': {
        borderRadius: 0,
        '& fieldset': {
        borderRadius: 0,
        borderColor: '#E0E3E7',
        },
        '&:hover fieldset': {
        borderRadius: 0,
        borderColor: '#B2BAC2',
        },
        '&.Mui-focused fieldset': {
        borderRadius: 0,
        borderColor: '#6F7E8C',
        },
    },
    '& input:valid + fieldset': {
        borderColor: 'lightgray',
        borderRadius: 0,
        borderWidth: 1,
    },
});
//#endregion

const AppPagination = (props) => {
    const {pagination, onPageChange, onSizeChange} = props;
    const [page, setPage] = useState(pagination.currPage);
    const [count, setCount] = useState(pagination.totalPages);

    const handlePageChange = (event, page) => {
        if (onPageChange){
            onPageChange(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    const handleChangeSize = (event) => {
        if (onSizeChange){
            onSizeChange(event.target.value);
        }
    }

    useEffect(() => {
        setPage(pagination?.currPage + 1);
        setCount(pagination?.totalPages);
    }, [pagination])

    return (
    <Container>
        <Stack spacing={2} sx={{my: 5}}>
        <Pagination count={count ? count : 0} shape="rounded" 
        page={page}
        onChange={handlePageChange} 
        renderItem={(item) => (
            <StyledPageItem
            {...item}
            />
        )}/>
        </Stack>
        <CustomInput
        select
        value={pagination.pageSize}
        onChange={handleChangeSize}
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