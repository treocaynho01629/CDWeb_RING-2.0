import styled from "styled-components"
import { useEffect, useState } from 'react'
import { Stack, Button } from '@mui/material';
import { AspectRatio, KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";

//#region styled
const Container = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 40px 0;
`

const PaginateButton = styled.button`
    border: none;
    background-color: ${props => props.theme.palette.action.focus};

`
//#endregion

const QuickPagination = (props) => {
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
    const handleChangeSize = (event) => {if (onSizeChange) onSizeChange(event.target.value)}

    return (
        <Container>
            <Button variant="outlined" sx={{aspectRatio: 1/1}}>
                <KeyboardArrowLeft/>
            </Button>
            <Button>
                <KeyboardArrowRight/>
            </Button>
            {/* <Stack spacing={2} sx={{ my: 5 }}>
                <Pagination count={count ? count : 0} shape="rounded"
                    page={page}
                    onChange={handlePageChange}
                    renderItem={(item) => (
                        <StyledPageItem
                            {...item}
                        />
                    )} />
            </Stack> */}
        </Container>
    )
}

export default QuickPagination