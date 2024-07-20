import styled from "styled-components"
import { useEffect, useState, useRef } from 'react'
import { styled as muiStyled } from '@mui/system';
import { Grid, TextField, MenuItem, ToggleButton, ToggleButtonGroup, Tooltip, IconButton } from '@mui/material';
import { Search as SearchIcon, SearchOff, FilterAlt } from '@mui/icons-material';
import { orderGroup } from "../../ultils/filters";
import CustomInput from "../custom/CustomInput";
import CustomButton from "../custom/CustomButton";

//#region styled
const Container = styled.div`
    margin-bottom: 5px;
`

const SearchInput = styled(TextField)({
    maxWidth: '500px',
    '& .MuiFormControl-root': {
        backgroundColor: 'red',
        display: 'flex',
        justifyContent: 'center'
    },
    '& .MuiInputBase-root': {
        borderRadius: 0,
        margin: '10px 0px',
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

const SortContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
`

const Sort = styled.div`
    align-items: center;
    display: flex;
    width: 100%;
`

const StyledToggleButtonGroup = muiStyled(ToggleButtonGroup)(({ theme }) => ({
    width: '100%',

    '@media screen and (min-width: 768px)': {
        width: 'auto',
        marginLeft: '10px',
    },

    '& .MuiToggleButtonGroup-grouped': {
        backgroundColor: '#272727',
        color: '#ffffffb2',
        fontWeight: 400,
        border: 0,
        borderRadius: 0,
    },
}));

const StyledToggleButton = muiStyled(ToggleButton)(({ theme }) => ({
    padding: '10px 15px',
    marginRight: 0,
    textTransform: 'none',
    fontSize: '14px',
    minWidth: '25%',
    transition: 'all .3s ease',

    '@media screen and (min-width: 768px)': {
        marginRight: '5px',
    },

    '&:hover': {
        backgroundColor: theme.palette.secondary.main,
    },
    '&.Mui-selected': {
        backgroundColor: theme.palette.secondary.main,
        color: 'white',
    },
    '&:focus': {
        outline: 'none',
        border: 'none',
    },
}));

const FilterTitle = styled.h4`
    display: none;

    @media (min-width: 768px) {
        display: block;
    }
`
//#endregion

const SortList = (props) => {
    const { filters, pagination, onChangeOrder, onChangeDir, onChangeSearch, onSizeChange, setOpen } = props;
    const searchRef = useRef(null);

    //Initial value
    const [sortBy, setSortBy] = useState(pagination?.sortBy);
    const [sortDir, setSortDir] = useState(pagination?.sortDir);
    const [toggleSearch, setToggleSearch] = useState(filters?.keyword ? true : false);

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

    //Change search value
    const handleSubmitSearch = (event) => {
        event.preventDefault();
        if (onChangeSearch) onChangeSearch(searchRef.current.value);
    };

    //Change amount display
    const handleChangeSize = (event) => { if (onSizeChange) onSizeChange(event.target.value) }

    //Toggle open search input / filter dialog
    const handleToggleSearch = () => setToggleSearch((toggleSearch) => !toggleSearch);
    const handleSetOpen = (event) => { if (setOpen) setOpen(true) }

    return (
        <Container>
            <SortContainer>
                <Sort>
                    <Grid container spacing={0} sx={{ width: '100%' }}>
                        <Grid item xs={12} md={8} sx={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: '5px' }}>
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
                        <Grid item xs={12} md={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', md: 'flex-end' } }}>
                            <Tooltip title="Tìm kiếm">
                                <IconButton aria-label="search"
                                    onClick={handleToggleSearch}
                                    onMouseDown={(e) => e.preventDefault}
                                    sx={{ marginRight: 0, zIndex: 10, display: { xs: 'none', sm: 'block' } }}>
                                    {toggleSearch ?
                                        <SearchIcon sx={{ fontSize: '26px', color: '#63e399' }} />
                                        : <SearchOff sx={{ fontSize: '26px' }} />}
                                </IconButton>
                            </Tooltip>
                            <CustomInput
                                size="small"
                                select
                                value={sortDir}
                                onChange={handleChangeDir}
                            >
                                <MenuItem value={'desc'}>Cao đến thấp</MenuItem>
                                <MenuItem value={'asc'}>Thấp đến cao</MenuItem>
                            </CustomInput>
                            <CustomInput
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
                            </CustomInput>
                            <CustomButton
                                size="small"
                                variant="outlined"
                                sx={{ height: '40px', marginLeft: '5px', display: { xs: 'flex', md: 'none' } }}
                                onClick={handleSetOpen}
                            >
                                <FilterAlt />Lọc
                            </CustomButton>
                        </Grid>
                    </Grid>
                </Sort>
            </SortContainer>
            {
                toggleSearch
                &&
                <form onSubmit={handleSubmitSearch} style={{ display: 'flex', justifyContent: 'center' }}>
                    <SearchInput placeholder='Từ khoá... '
                        id="search"
                        size="small"
                        fullWidth
                        defaultValue={filters.keyword}
                        inputRef={searchRef}
                        onBlur={handleSubmitSearch}
                        InputProps={{
                            endAdornment: <SearchIcon style={{ color: "gray" }} />
                        }}
                    />
                </form>
            }
        </Container>
    )
}

export default SortList