import React, { useEffect, useState, useRef } from 'react'

import styled from "styled-components"
import { styled as muiStyled } from '@mui/system';

import { TextField, MenuItem, ToggleButton, ToggleButtonGroup } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

//#region styled
const Container = styled.div`
`

const SearchInput = styled(TextField)({
    '& .MuiInputBase-root': {
      borderRadius: 0,
      margin: '10px 0px',
      maxWidth: '500px',
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
`

const StyledToggleButtonGroup = muiStyled(ToggleButtonGroup)(({ theme }) => ({
    '& .MuiToggleButtonGroup-grouped': {
      backgroundColor: 'rgb(39, 39, 39)',
      color: 'rgba(255, 255, 255, 0.7)',
      fontWeight: 400,
      border: 0,
      borderRadius: 0,
      marginLeft: '10px',
    },
}));
  
const StyledToggleButton = muiStyled(ToggleButton)(({ theme }) => ({
    padding: '7px 15px',
    marginRight: '10px',
    textTransform: 'none',
    fontSize: '16px',
    '&:hover': {
        backgroundColor: '#63e399',
    },
    '&.Mui-selected': {
        fontWeight: 'bold',
        backgroundColor: '#63e399',
        color: 'white',
    },
    '&:focus': {
        outline: 'none',
        border: 'none',
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

const orderGroup = [
    {
        value: 'id',
        label: 'Mới nhất',
    },
    {
        value: 'orderTime',
        label: 'Bán chạy',
    },
    {
        value: 'rateAmount',
        label: 'Yêu thích',
    },
    {
        value: 'price',
        label: 'Giá bán',
    },
];

const SortList = (props) => {
    const { filters, pagination, onChangeOrder, onChangeDir, onChangeSearch } = props;
    const [ sortBy, setSortBy] = useState(pagination.sortBy);
    const [ sortDir, setSortDir] = useState(pagination.sortDir);
    const searchRef = useRef(null);

    const handleChangeOrder = (event, newValue) => {
        if (newValue != null && onChangeOrder){
            onChangeOrder(newValue);
        }
    };

    const handleChangeDir = (event) => {
        if (onChangeDir){
            onChangeDir(event.target.value)
        }
    };

    const handleSubmitSearch = (event) => {
        event.preventDefault();
        if (onChangeSearch){
            onChangeSearch(searchRef.current.value);
        }
    };

    useEffect(() => {
        setSortBy(pagination?.sortBy);
        setSortDir(pagination?.sortDir);
    }, [pagination])

  return (
    <Container>
        <SortContainer>
            <Sort>
                <h4>Sắp xếp theo</h4>
                <StyledToggleButtonGroup
                    value={sortBy}
                    exclusive
                    onChange={handleChangeOrder}
                >
                    {orderGroup.map((order, index) => (
                    <StyledToggleButton key={index} value={order.value}>{order.label}</StyledToggleButton>
                    ))}
                </StyledToggleButtonGroup>
            </Sort>
            <CustomInput
            select
            value={sortDir}
            onChange={handleChangeDir}
            >
                <MenuItem value={'desc'}>Cao đến thấp</MenuItem>
                <MenuItem value={'asc'}>Thấp đến cao</MenuItem>
            </CustomInput>
        </SortContainer>
        {filters?.keyword ?
        <form onSubmit={handleSubmitSearch}>
            <SearchInput placeholder='Từ khoá... '
                id="search"
                size="small"
                fullWidth
                defaultValue={filters.keyword}
                inputRef={searchRef}
                onBlur={handleSubmitSearch}
                InputProps={{
                    endAdornment: <SearchIcon style={{color:"gray"}}/>
                }}
            />
        </form> 
        : null
        }
    </Container>
  )
}

export default SortList