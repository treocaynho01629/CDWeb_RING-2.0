import { useState, useEffect } from "react"
import styled from 'styled-components'
import { styled as muiStyled } from '@mui/system';

import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import Collapse from '@mui/material/Collapse';

import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import PriceChangeIcon from '@mui/icons-material/PriceChange';
import CategoryIcon from '@mui/icons-material/Category';
import ClassIcon from '@mui/icons-material/Class';

import axios from '../api/axios'
import { Grid } from "@mui/material";

//#region styled
const Container = styled.div`
`

const TitleContainer = styled.div`
    width: 100%;
    max-width: 250px;
`

const Title = muiStyled(Divider)({
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#63e399',
    textAlign: 'center',
    justifyContent: 'center',
    margin: '10px 0px',
});

const Filter = styled.div`
    padding: 20px 0px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`

const FilterText = styled.h3`
    font-size: 16px;
    text-transform: uppercase;
    margin: 5px 0px;
    color: inherit;
    display: flex;
    align-items: center;

    &:hover {
        color: #63e399;
    }
`

const InputContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`

const PriceInputContainer = styled.div`
    width: 90px;
    border: 0.5px solid lightgray;
    align-items: center;
    justify-content: center;
    display: flex;
`

const PriceInput = styled.input`
    height: 45px;
    width: 100%;
    padding-left: 10px;
    background: transparent;
    color: black;
    resize: none;
    outline: none;
    border: none;
    display: flex;
    flex: 1;
`

const PriceSlider = muiStyled(Slider)({
  color: '#63e399',
  height: 8,

  '& .MuiSlider-track': {
    border: 'none',
  },

  '& .MuiSlider-thumb': {
    height: 24,
    width: 24,
    backgroundColor: '#fff',
    border: '2px solid currentColor',
    '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
      boxShadow: 'inherit',
    },
    '&:before': {
      display: 'none',
    },
  },
  '& .MuiSlider-valueLabel': {
    backgroundColor: '#63e399',
  },
});

function valuetext(value) {
  let scaledValue = value;
  if (scaledValue >= 10000000) {
    scaledValue = 10000000;
  }
  return `${scaledValue.toLocaleString()} đ`;
}
//#endregion

const CATEGORIES_URL = 'api/categories';
const PUBLISHERS_URL = 'api/publishers';
const marks = [
  {
    value: 0,
    label: '0 đ',
  },
  {
    value: 3.75,
    label: '',
  },
  {
    value: 7.5,
    label: '200,000 đ',
  },
  {
    value: 11.25,
    label: '',
  },
  {
    value: 15,
    label: '10tr',
  },
];

const FilterList = (props) => {
  //#region construct
  const {filters, onCateChange, onRangeChange, onChangePub} = props;
  const [open, setOpen] = useState(false);
  const [cateId, setCateId] = useState(filters?.cateId);
  const [catesList, setCatesList] = useState([])
  const [pubList, setPubList] = useState([]);
  const [selectedPub, setSelectedPub] = useState(filters?.pubId);
  const [valueInput, setValueInput] = useState(filters?.value);
  const [value, setValue] = useState([reverseCalculateValue(valueInput[0]), reverseCalculateValue(valueInput[1])]);

  //Scale
  function calculateValue(value) {
    return ( 2 ** value) * 1000;
  }

  function reverseCalculateValue(value){
    return Math.log(value / 1000) / Math.log(2);
  }

  // Change stuff
  const handleCateChange = (id) => {
    onCateChange(id);
  }

  const handleClick = (id) => {
    setOpen((prevState) => ({ ...prevState, [id]: !prevState[id] }));
  };

  const handleChangeRange = (event, newValue) => {
    setValue(newValue);
    let newInputValue = [calculateValue(newValue[0]), calculateValue(newValue[1])];
    setValueInput(newInputValue);
  };

  const handleChangeRangeCommited = () => {
    onRangeChange(valueInput);
  };

  const handleInputChange = (event) => {
    let newValue = [...valueInput]
    newValue[0] = event.target.value === '' ? '' : Number(event.target.value);
    let rangeValue = [...value]
    rangeValue[0] = reverseCalculateValue(newValue[0]);
    setValueInput(newValue);
    setValue(rangeValue);
    onRangeChange(newValue);
  };

  const handleInputChange2 = (event) => {
    let newValue = [...valueInput]
    newValue[1] = event.target.value === '' ? '' : Number(event.target.value);
    let rangeValue = [...value]
    rangeValue[1] = reverseCalculateValue(newValue[1]);
    setValueInput(newValue);
    setValue(rangeValue);
    onRangeChange(newValue);
  };

  const handleChangePub = (event) => {
    if (onChangePub){
      const selectedIndex = selectedPub.indexOf(event.target.value);
      let newSelected = [];

      if (selectedIndex === -1) {
        newSelected = newSelected.concat(selectedPub, event.target.value);
      } else if (selectedIndex === 0) {
        newSelected = newSelected.concat(selectedPub.slice(1));
      } else if (selectedIndex === selectedPub.length - 1) {
        newSelected = newSelected.concat(selectedPub.slice(0, -1));
      } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(
          selectedPub.slice(0, selectedIndex),
          selectedPub.slice(selectedIndex + 1),
        );
      }

      setSelectedPub(newSelected);
      onChangePub(newSelected);
    }
  };

  const handleBlur = () => {
    let newValue = [...valueInput]
    if (newValue[0] < 0) {
      newValue[0] = 1000;
      setValueInput(newValue);
      onRangeChange(newValue);
    } else if (newValue[0] > 10000000) {
      newValue[0] = 10000000;
      setValueInput(newValue);
      onRangeChange(newValue);
    }

    if (newValue[1] < 0) {
      newValue[1] = 1000;
      setValueInput(newValue);
      onRangeChange(newValue);
    } else if (newValue[1] > 10000000) {
      newValue[1] = 10000000;
      setValueInput(newValue);
      onRangeChange(newValue);
    }
  };

  useEffect(()=>{
    setSelectedPub(filters?.pubId);
    setCateId(filters?.cateId);
  }, [filters]);

  //Load
  useEffect(()=>{
    loadCategories();
    loadPublishers();
    handleBlur();
  }, []);

  const loadCategories = async()=>{
      const result = await axios.get(CATEGORIES_URL);
      setCatesList(result.data);
  };

  const loadPublishers = async()=>{
    const result = await axios.get(PUBLISHERS_URL);
    setPubList(result.data);
  };

  const isSelected = (id) => selectedPub.indexOf(id) !== -1;
  //#endregion

  return (
    <Container>
      <Title>BỘ LỌC</Title>

      <Filter>
        <TitleContainer>
          <FilterText><PriceChangeIcon/>&nbsp;Khoảng giá</FilterText>
        </TitleContainer>
        
        <Box sx={{ width: 220}}>
          <PriceSlider
            getAriaLabel={() => 'Bộ lọc giá'}
            value={value} 
            min={0}
            max={15}
            scale={calculateValue}
            marks={marks}
            valueLabelDisplay="auto"
            getAriaValueText={valuetext}
            valueLabelFormat={valuetext}
            onChange={handleChangeRange}
            onChangeCommitted={handleChangeRangeCommited}
            onBlur={handleBlur}
            size="lg"
          />
        </Box>
        <InputContainer>
          <PriceInputContainer>
            <PriceInput 
            type="number"
            min="1000"
            max="10000000"
            step="5000"
            onChange={handleInputChange} 
            onBlur={handleBlur} 
            value={valueInput[0]}
            inputProps={{
              step: 1000,
              min: 1000,
              max: 10000000,
              type: 'number',
              'aria-labelledby': 'input-slider',
            }}
            />
          </PriceInputContainer>
          &nbsp;đến&nbsp;
          <PriceInputContainer>
            <PriceInput 
            type="number"
            min="1000"
            max="10000000"
            step="5000"
            onChange={handleInputChange2} 
            onBlur={handleBlur} 
            value={valueInput[1]}
            inputProps={{
              step: 1000,
              min: 1000,
              max: 10000000,
              type: 'number',
              'aria-labelledby': 'input-slider',
            }}
            />
          </PriceInputContainer>
        </InputContainer>
      </Filter>
      <Divider/>
      <Filter>
        <TitleContainer>
          <FilterText><CategoryIcon/>&nbsp;Danh mục</FilterText>
        </TitleContainer>

        <List
          sx={{ width: '100%', maxWidth: 250, py: 0}}
          component="nav"
          aria-labelledby="nested-list"
        >
          {catesList.map((cate, index) => (
            <Grid key={index}>
              <ListItemButton 
              sx={{pl: 0, py: 0, 
                justifyContent: 'space-between',
                '&.Mui-selected': {
                  color: '#63e399'
                },
              }}
              selected={cateId == cate?.id}>
                <FilterText onClick={() => handleCateChange(cate.id)}>{cate.categoryName}</FilterText>
                { cate.cateSubs.length == 0
                  ? null
                  : <>
                  {open[cate.id] ? <ExpandLess onClick={() => handleClick(cate.id)}/> 
                      : <ExpandMore onClick={() => handleClick(cate.id)}/>}
                    </>
                }
                
              </ListItemButton>
              {cate.cateSubs.map((sub, index2) => (
                <Grid key={index2}>
                  <Collapse in={open[cate.id]} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    <ListItemButton sx={{ pl: 2 , py: 0, color: 'gray'}}>
                      <FilterText>{sub.subName}</FilterText>
                    </ListItemButton>
                  </List>
                </Collapse>
                </Grid>
              ))}
            </Grid>
          ))}
        </List>
      </Filter>
      <Divider/>
      <Filter>
        <TitleContainer>
          <FilterText><ClassIcon/>&nbsp;Nhà xuất bản</FilterText>
        </TitleContainer>

        <FormGroup sx={{padding: 0}}>
        {pubList.map((pub, index) => {
          const isItemSelected = isSelected(`${pub.id}`);

          return (
            <FormControlLabel
              control={
                <Checkbox value={pub.id} 
                checked={isItemSelected} 
                onChange={handleChangePub} 
                disableRipple
                name={pub.pubName}
                sx={{paddingLeft: 0, 
                  '&.Mui-checked': {
                  color: '#63e399',
                }}} />
              }
              label={pub.pubName}
            />
          )
        })}
        </FormGroup>
      </Filter>
    </Container>
  )
}

export default FilterList