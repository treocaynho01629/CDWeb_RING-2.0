import { useEffect, useState } from 'react'

import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import Stack from '@mui/material/Stack';
import { styled as muiStyled } from '@mui/system';

const StyledPageItem = muiStyled(PaginationItem)(({ theme }) => ({
    borderRadius: 0,
    backgroundColor: 'lightgray',

    '&:hover': {
        backgroundColor: '#63e399',
        color:'white',
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

const AppPagination = (props) => {
    const {pagination, onPageChange} = props;
    const [page, setPage] = useState(pagination.currPage);
    const [count, setCount] = useState(pagination.totalPages);

    const handlePageChange = (event, page) => {
        if (onPageChange){
            onPageChange(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    useEffect(() => {
        setPage(pagination?.currPage + 1);
        setCount(pagination?.totalPages);
    }, [pagination])

    return (
    <Stack spacing={2} sx={{my: 5}}>
    <Pagination count={count} shape="rounded" 
    page={page}
    onChange={handlePageChange} 
    renderItem={(item) => (
        <StyledPageItem
        //   component={Link}
        //   to={`/inbox${item.page === 1 ? '' : `?page=${item.page}`}`}
          {...item}
        />
    )}/>
    </Stack>
  )
}

export default AppPagination