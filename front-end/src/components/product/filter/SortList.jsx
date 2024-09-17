import styled from "styled-components"
import { useEffect, useState } from 'react'
import { styled as muiStyled } from '@mui/system';
import { Grid2 as Grid, Button, MenuItem, ToggleButton, ToggleButtonGroup, TextField } from '@mui/material';
import { Search, Sort } from '@mui/icons-material';
import { orderGroup } from "../../../ultils/filters";
import QuickPagination from "../../custom/QuickPagination";

//#region styled
const Container = styled.div`
    margin: 20px 0;
    background-color: ${props => props.theme.palette.background.default};
    
    /* ${props => props.theme.breakpoints.down("sm_md")} {
        position: sticky;
        top: 66.5px;
        left: 0;
        z-index: 100;
    } */
`

const SortContainer = styled.div`
    width: 100%;
`

const Keyword = styled.div`
    display: flex;
    align-items: center;
    margin: 10px 0;

    b {
        color: ${props => props.theme.palette.warning.main};
    }
`

const StyledToggleButtonGroup = muiStyled(ToggleButtonGroup)(({ theme }) => ({
    '& .MuiToggleButtonGroup-grouped': {
        backgroundColor: '#272727',
        color: '#ffffffb2',
        fontWeight: 400,
        border: 0,
        borderRadius: 0,
    },

    [theme.breakpoints.down('sm_md')]: {
        width: '100%',
    },
}));

const StyledToggleButton = muiStyled(ToggleButton)(({ theme }) => ({
    padding: '10px 15px',
    marginRight: '5px',
    textTransform: 'none',
    fontSize: '14px',
    minWidth: '25%',
    transition: 'all .3s ease',

    '&:hover': {
        backgroundColor: theme.palette.primary.main,
    },
    '&.Mui-selected': {
        backgroundColor: theme.palette.primary.main,
        color: 'white',
    },
    '&:focus': {
        outline: 'none',
        border: 'none',
    },
    [theme.breakpoints.down('sm_md')]: {
        marginRight: 0,
    },
}));

const FilterTitle = styled.h4`
    display: block;
    margin-right: 15px;

    ${props => props.theme.breakpoints.down("md_lg")} {
        display: none;
    }
`
//#endregion

const SortList = (props) => {
    const { filters, pagination, onChangeOrder, onChangeDir, onSizeChange, onPageChange, setOpen } = props;

    //Initial value
    const [sortBy, setSortBy] = useState(pagination?.sortBy);
    const [sortDir, setSortDir] = useState(pagination?.sortDir);

    //Update sort
    useEffect(() => {
        setSortBy(pagination?.sortBy);
        setSortDir(pagination?.sortDir);
    }, [pagination])

    //Change order by
    const handleChangeOrder = (event, newValue) => {
        if (newValue != null && onChangeOrder) onChangeOrder(newValue);
    };

    //Change sort direction
    const handleChangeDir = (event) => {
        if (onChangeDir) onChangeDir(event.target.value)
    };

    //Change amount display
    const handleChangeSize = (event) => { if (onSizeChange) onSizeChange(event.target.value) }

    //Toggle open filter dialog
    const handleSetOpen = (event) => { if (setOpen) setOpen(true) }

    return (
        <Container>
            <SortContainer>
                {filters?.keyword &&
                    <Keyword><Search /> Kết quả từ khoá: '<b>{filters.keyword}</b>'</Keyword>
                }
                <Grid container size="grow" spacing={0} sx={{ width: '100%' }}>
                    <Grid size={{ xs: 12, sm: 8 }} sx={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: '5px' }}>
                        <FilterTitle>Xếp theo</FilterTitle>
                        <StyledToggleButtonGroup
                            value={sortBy}
                            exclusive
                            onChange={handleChangeOrder}
                            size="large"
                        >
                            {orderGroup.map((order, index) => (
                                <StyledToggleButton
                                    key={`${order?.label}-${index}`}
                                    value={order?.value}
                                >
                                    {order?.label}
                                </StyledToggleButton>
                            ))}
                        </StyledToggleButtonGroup>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }} sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', md: 'flex-end' } }}>
                        <TextField
                            size="small"
                            select
                            value={sortDir}
                            onChange={handleChangeDir}
                        >
                            <MenuItem value={'desc'}>Cao đến thấp</MenuItem>
                            <MenuItem value={'asc'}>Thấp đến cao</MenuItem>
                        </TextField>
                        <TextField
                            size="small"
                            select
                            value={pagination?.pageSize}
                            onChange={handleChangeSize}
                            sx={{ marginLeft: '5px', display: { xs: 'block', sm: 'none' } }}
                        >
                            <MenuItem value={8}>Hiển thị 8</MenuItem>
                            <MenuItem value={16}>Hiển thị 16</MenuItem>
                            <MenuItem value={24}>Hiển thị 24</MenuItem>
                            <MenuItem value={48}>Hiển thị 48</MenuItem>
                        </TextField>
                        {/* <QuickPagination {...{ pagination, onPageChange, onSizeChange }} /> */}
                        <Button
                            size="small"
                            variant="outlined"
                            sx={{ height: '40px', marginLeft: '5px', display: { xs: 'flex', md: 'none' } }}
                            onClick={handleSetOpen}
                            startIcon={<Sort />}
                        >
                            Lọc
                        </Button>
                    </Grid>
                </Grid>
            </SortContainer>
        </Container>
    )
}

export default SortList