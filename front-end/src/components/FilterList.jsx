import styled from 'styled-components'
import { useState, useEffect, useMemo } from "react"
import { Grid, Box, Divider, Checkbox, FormGroup, FormControlLabel, MenuItem, List, ListItemButton, Collapse, Skeleton, Stack } from '@mui/material';
import { ExpandLess, ExpandMore, PriceChange as PriceChangeIcon, Category as CategoryIcon, Class as ClassIcon, Tune as TuneIcon, FilterAltOff } from '@mui/icons-material';
import { marks, bookTypes } from "../ultils/filters";
import CustomSlider from "./custom/CustomSlider";
import CustomButton from "./custom/CustomButton";
import CustomDivider from './custom/CustomDivider';
import CustomInput from './custom/CustomInput';

//#region styled
const TitleContainer = styled.div`
    width: 100%;
    max-width: 250px;
`

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
//#endregion

const CateFilter = ({ loadCates, cates, cateId, onChangeCate }) => {
  const [open, setOpen] = useState(false); //Open sub cate

  //Change cate
  const handleCateChange = (id) => {
    onChangeCate(id);
  }

  //Open sub cate
  const handleClick = (id) => {
    setOpen((prevState) => ({ ...prevState, [id]: !prevState[id] }));
  };

  return (
    <Filter>
      <TitleContainer>
        <FilterText><CategoryIcon />&nbsp;Danh mục</FilterText>
      </TitleContainer>

      <List
        sx={{ width: '100%', maxWidth: 250, py: 0 }}
        component="nav"
        aria-labelledby="nested-list"
      >
        {(loadCates || !cates?.length ? Array.from(new Array(5)) : cates).map((cate, index) => (
          <Grid key={`${cate?.id}-${index}`}>
            {cate
              ?
              <ListItemButton
                sx={{
                  pl: 0, py: 0,
                  justifyContent: 'space-between',
                  '&.Mui-selected': {
                    color: '#63e399'
                  },
                }}
                selected={cateId == cate?.id}>
                <FilterText onClick={() => handleCateChange(cate?.id)}>{cate?.categoryName}</FilterText>
                {cate.cateSubs.length == 0
                  ? null
                  : <>
                    {open[cate?.id] ? <ExpandLess onClick={() => handleClick(cate?.id)} />
                      : <ExpandMore onClick={() => handleClick(cate?.id)} />}
                  </>
                }

              </ListItemButton>
              :
              <ListItemButton>
                <Skeleton variant="text" sx={{ fontSize: '16px' }} width="70%" />
              </ListItemButton>
            }
            {cate?.cateSubs?.map((sub, index) => (
              <Grid key={index}>
                <Collapse in={open[cate?.id]} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    <ListItemButton sx={{ pl: 2, py: 0, color: 'gray' }}>
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
  )
}

const PublisherFilter = ({ loadPubs, pubs, selectedPub, setSelectedPub, onChangePub }) => {

  //Change pub
  const handleChangePub = (e) => {
    if (onChangePub) {
      const selectedIndex = selectedPub.indexOf(e.target.value);
      let newSelected = [];

      if (selectedIndex === -1) {
        newSelected = newSelected.concat(selectedPub, e.target.value);
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
  }

  const isSelected = (id) => selectedPub.indexOf(id) !== -1;

  return (
    <Filter>
      <TitleContainer>
        <FilterText><ClassIcon />&nbsp;Nhà xuất bản</FilterText>
      </TitleContainer>

      <FormGroup sx={{ padding: 0 }}>
        {(loadPubs || !pubs?.length ? Array.from(new Array(10)) : pubs).map((pub, index) => {
          const isItemSelected = isSelected(`${pub?.id}`);

          if (pub) {
            return (
              <FormControlLabel key={`${pub?.id}-${index}`}
                control={
                  <Checkbox value={pub?.id}
                    checked={isItemSelected}
                    onChange={handleChangePub}
                    disableRipple
                    name={pub?.pubName}
                    sx={{
                      paddingLeft: 0,
                      '&.Mui-checked': {
                        color: '#63e399',
                      }
                    }} />
                }
                label={pub?.pubName}
              />
            )
          } else {
            return (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <Checkbox disabled
                  disableRipple
                  sx={{
                    paddingLeft: 0,
                    '&.Mui-checked': {
                      color: '#63e399',
                    }
                  }} />
                <Skeleton variant="text" sx={{ fontSize: '14px' }} width={200} />
              </div>
            )
          }
        })}
      </FormGroup>
    </Filter>
  )
}

const RangeFilter = ({ valueInput, setValueInput, onChangeRange }) => {
  //Range value
  const firstValue = useMemo(() => reverseCalculateValue(valueInput[0]), [valueInput[0]]);
  const secondValue = useMemo(() => reverseCalculateValue(valueInput[1]), [valueInput[1]]);
  const [value, setValue] = useState(firstValue, secondValue);

  //Reset slider value on load
  useEffect(() => {
    handleBlur();
  }, []);

  useEffect(() => {
    setValue([reverseCalculateValue(valueInput[0]), reverseCalculateValue(valueInput[1])]);
  }, [valueInput]);

  //Scale calculate function
  function calculateValue(value) {
    const result = (2 ** value) * 1000;

    //Threshold
    if (result < 0) return 0;
    if (result > 10000000) return 10000000;

    return result;
  }

  function reverseCalculateValue(value) {
    const result = Math.log(value / 1000) / Math.log(2);

    //Threshold
    if (result < 0) return 0;
    if (result > 13) return 15;

    return result;
  }

  function valuetext(value) {
    let scaledValue = value;
    if (scaledValue >= 10000000) {
      scaledValue = 10000000;
    }
    return `${scaledValue.toLocaleString()} đ`;
  }

  //Change range functions
  const handleChangeRange = (event, newValue) => {
    //New value
    const firstInput = calculateValue(newValue[0]);
    const secondInput = calculateValue(newValue[1]);
    const newInputValue = [firstInput, secondInput];

    //Set
    setValue(newValue);
    setValueInput(newInputValue);
  };

  const handleChangeRangeCommited = () => {
    onChangeRange(valueInput);
  };

  const handleInputChange = (event) => {
    //Input
    let newValue = [...valueInput];
    let calculatedInputValue = event.target.value === '' ? '' : Number(event.target.value);

    //Threshold
    if (calculatedInputValue < 0) calculatedInputValue = 0;
    if (calculatedInputValue > 10000000) calculatedInputValue = 10000000;
    newValue[0] = calculatedInputValue;

    //Range
    let rangeValue = [...value]
    const calculatedValue = reverseCalculateValue(newValue[0]);
    rangeValue[0] = calculatedValue;

    //Set
    setValueInput(newValue);
    setValue(rangeValue);
    onChangeRange(newValue);
  };

  const handleInputChange2 = (event) => {
    //Input
    let newValue = [...valueInput];
    let calculatedInputValue = event.target.value === '' ? '' : Number(event.target.value);

    //Threshold
    if (calculatedInputValue < 0) calculatedInputValue = 0;
    if (calculatedInputValue > 10000000) calculatedInputValue = 10000000;
    newValue[1] = calculatedInputValue;

    //Range
    let rangeValue = [...value]
    rangeValue[1] = reverseCalculateValue(newValue[1]);

    //Set
    setValueInput(newValue);
    setValue(rangeValue);
    onChangeRange(newValue);
  };

  const handleBlur = () => {
    let newValue = [...valueInput];
    if (newValue[0] < 0) {
      newValue[0] = 1000;
      setValueInput(newValue);
      onChangeRange(newValue);
    } else if (newValue[0] > 10000000) {
      newValue[0] = 10000000;
      setValueInput(newValue);
      onChangeRange(newValue);
    }

    if (newValue[1] < 0) {
      newValue[1] = 1000;
      setValueInput(newValue);
      onChangeRange(newValue);
    } else if (newValue[1] > 10000000) {
      newValue[1] = 10000000;
      setValueInput(newValue);
      onChangeRange(newValue);
    }
  };

  return (
    <Filter>
      <TitleContainer>
        <FilterText><PriceChangeIcon />&nbsp;Khoảng giá</FilterText>
      </TitleContainer>

      <Box sx={{ width: 220 }}>
        <CustomSlider
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
          />đ&nbsp;
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
          />đ&nbsp;
        </PriceInputContainer>
      </InputContainer>
    </Filter>
  )
}

const OtherFilters = ({ type, seller, setSeller, onChangeType, onChangeSeller }) => {

  //Change type
  const handleChangeType = (event) => {
    if (onChangeType) onChangeType(event.target.value)
  }

  //change seller
  const handleChangeSeller = (event) => {
    event.preventDefault();
    if (onChangeSeller) onChangeSeller(seller);
  };

  return (
    <Filter>
      <TitleContainer>
        <FilterText><TuneIcon />&nbsp;KHÁC</FilterText>
      </TitleContainer>
      <CustomInput
        label="Hình thức bìa"
        select
        margin="dense"
        fullWidth
        id="type"
        value={type}
        onChange={handleChangeType}
      >
        <MenuItem key="all" value="">Tất cả</MenuItem>
        {bookTypes.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </CustomInput>
      <CustomInput
        margin="dense"
        id="seller"
        label="Tên người bán"
        fullWidth
        variant="outlined"
        value={seller}
        onBlur={handleChangeSeller}
        onChange={(e) => setSeller(e.target.value)}
      />
    </Filter>
  )
}

const FilterList = (props) => {
  //#region construct
  const { filters, onChangeCate, onChangeRange, onChangePub, onChangeType, onChangeSeller,
    loadCates, cates, loadPubs, pubs, resetFilter
  } = props;

  //Initial data
  const [cateId, setCateId] = useState(filters?.cateId);
  const [valueInput, setValueInput] = useState(filters?.value);
  const [type, setType] = useState(filters?.type);
  const [seller, setSeller] = useState(filters?.seller);
  const [selectedPub, setSelectedPub] = useState(filters?.pubId);

  //Update value
  useEffect(() => {
    setCateId(filters?.cateId);
  }, [filters?.cateId]);

  useEffect(() => {
    setType(filters?.type);
  }, [filters?.type]);

  useEffect(() => {
    setSeller(filters?.seller);
  }, [filters?.seller]);

  useEffect(() => {
    setValueInput(filters?.value);
  }, [filters?.value]);

  useEffect(() => {
    setSelectedPub(filters?.pubId);
  }, [filters?.pubId]);
  //#endregion

  return (
    <>
      <CustomDivider>BỘ LỌC</CustomDivider>
      <Stack
        spacing={{ xs: 1 }}
        direction={'column'}
        useFlexGap
        flexWrap="wrap"
        divider={<Divider flexItem />}
      >
        <RangeFilter {...{ valueInput, setValueInput, onChangeRange }} />
        <CateFilter {...{ loadCates, cates, cateId, onChangeCate }} />
        <PublisherFilter {...{ loadPubs, pubs, selectedPub, setSelectedPub, onChangePub }} />
        <OtherFilters {...{ type, seller, setSeller, onChangeType, onChangeSeller }} />
      </Stack>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <CustomButton variant="contained" color="error" size="large" onClick={resetFilter}><FilterAltOff />Xoá bộ lọc</CustomButton>
      </div>
    </>
  )
}

export default FilterList;