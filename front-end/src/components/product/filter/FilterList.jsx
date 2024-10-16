import styled from 'styled-components'
import { useState, useEffect, useMemo } from "react"
import { Box, Button, Divider, Checkbox, FormGroup, FormControlLabel, MenuItem, List, ListItemButton, Collapse, Skeleton, Stack, InputAdornment, TextField } from '@mui/material';
import { ExpandLess, ExpandMore, PriceChange as PriceChangeIcon, Category as CategoryIcon, Class as ClassIcon, Tune as TuneIcon, FilterAltOff } from '@mui/icons-material';
import { marks, bookTypes } from "../../../ultils/filters";
import CustomSlider from "../../custom/CustomSlider";
import CustomDivider from '../../custom/CustomDivider';

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
    font-size: 14px;
    text-transform: uppercase;
    margin: 5px 0px;
    color: inherit;
    display: flex;
    align-items: center;
`

const LabelText = styled.span`
  font-size: 14px;
`

const InputContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;

    ${props => props.theme.breakpoints.down("md_lg")} {
        flex-direction: column;
    }
`

const StyledNumberInput = styled(TextField)(({ theme }) => ({
  "input[type=number]::-webkit-outer-spin-button": {
    "-webkit-appearance": "none",
  },
  "input[type=number]::-webkit-inner-spin-button": {
    "-webkit-appearance": "none",
  }
}));

const StyledListItemButton = styled(ListItemButton)`
    padding: 0;
    justify-content: space-between;

    &.secondary {
      padding-left: 16px;
      font-size: 13px;
      color: ${props => props.theme.palette.text.secondary};

      &.Mui-selected {
        color: ${props => props.theme.palette.primary.main};
      }
    }

    &.Mui-selected {
      color: ${props => props.theme.palette.primary.main};
    }
`
//#endregion

const CateFilter = ({ loadCates, doneCates, errorCates, cates, cateId, onChangeCate }) => {
  const [open, setOpen] = useState(false); //Open sub cate

  //Change cate
  const handleCateChange = (slug, id) => { onChangeCate(slug, id); }

  //Open sub cate
  const handleClick = (e, id) => {
    setOpen((prevState) => ({ ...prevState, [id]: !prevState[id] }));
    e.stopPropagation();
  };

  let catesContent;

  if (loadCates || errorCates) {
    catesContent = (
      Array.from(new Array(5)).map((item, index) => (
        <Box key={`cate-${index}`}>
          <ListItemButton>
            <Skeleton variant="text" sx={{ fontSize: '14px' }} width="70%" />
          </ListItemButton>
        </Box>
      ))
    )
  } else if (doneCates) {
    const { ids, entities } = cates;

    catesContent = ids?.length
      ? ids?.map((id, index) => {
        const cate = entities[id];

        return (
          <Box key={`${id}-${index}`}>
            <StyledListItemButton
              selected={cateId == id}
              onClick={() => handleCateChange(cate?.slug, id)}
            >
              <FilterText>{cate?.categoryName}</FilterText>
              {cate.children?.length ?
                <>
                  {open[id] ? <ExpandLess onClick={(e) => handleClick(e, id)} />
                    : <ExpandMore onClick={(e) => handleClick(e, id)} />}
                </>
                : null
              }
            </StyledListItemButton>
            {cate?.children &&
              <Collapse in={open[id]} timeout="auto" unmountOnExit>
                {cate.children?.map((child, subIndex) => (
                  <List key={`${child?.id}-${subIndex}`} component="div" disablePadding>
                    <StyledListItemButton
                      className="secondary"
                      selected={cateId == child?.id}
                      onClick={() => handleCateChange(child?.slug, child?.id)}
                    >
                      <FilterText>{child?.categoryName}</FilterText>
                    </StyledListItemButton>
                  </List>
                ))}
              </Collapse>
            }
          </Box>
        )
      })
      :
      Array.from(new Array(5)).map((item, index) => (
        <Box key={`cate-${index}`}>
          <ListItemButton>
            <Skeleton variant="text" sx={{ fontSize: '16px' }} width="70%" />
          </ListItemButton>
        </Box>
      ))
  }

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
        {catesContent}
      </List>
    </Filter>
  )
}

const PublisherFilter = ({ loadPubs, donePubs, errorPubs, pubs, selectedPub, setSelectedPub, onChangePub }) => {

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

      console.log(newSelected);

      setSelectedPub(newSelected);
      onChangePub(newSelected);
    }
  }

  const isSelected = (id) => selectedPub.indexOf(id) !== -1;

  let pubsContent;

  if (loadPubs || errorPubs) {
    pubsContent = (
      Array.from(new Array(10)).map((item, index) => (
        <Box key={`pub-${index}`} style={{ display: 'flex', justifyContent: 'flex-start' }}>
          <Checkbox disabled
            disableRipple
            color="primary"
            sx={{ paddingLeft: 0 }} />
          <Skeleton variant="text" sx={{ fontSize: '14px' }} width={200} />
        </Box>
      ))
    )
  } else if (donePubs) {
    const { ids, entities } = pubs;

    pubsContent = ids?.length
      ? ids?.map((id, index) => {
        const pub = entities[id];
        const isItemSelected = isSelected(`${id}`);

        return (
          <FormControlLabel key={`${id}-${index}`}
            control={
              <Checkbox value={id}
                checked={isItemSelected}
                onChange={handleChangePub}
                disableRipple
                name={pub?.pubName}
                color="primary"
                size="small"
                sx={{ paddingLeft: 0 }} />
            }
            sx={{ fontSize: '14px' }}
            label={<LabelText>{pub?.pubName}</LabelText>}
          />
        )
      })
      :
      Array.from(new Array(10)).map((item, index) => (
        <Box key={`pub-${index}`} style={{ display: 'flex', justifyContent: 'flex-start' }}>
          <Checkbox disabled
            disableRipple
            color="primary"
            sx={{ paddingLeft: 0 }} />
          <Skeleton variant="text" sx={{ fontSize: '14px' }} width={200} />
        </Box>
      ))
  }

  return (
    <Filter>
      <TitleContainer>
        <FilterText><ClassIcon />&nbsp;Nhà xuất bản</FilterText>
      </TitleContainer>

      <FormGroup sx={{ padding: 0 }}>
        {pubsContent}
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
  };

  const handleBlur = () => {
    let newValue = [...valueInput];
    if (newValue[0] < 0) {
      newValue[0] = 1000;
      setValueInput(newValue);
    } else if (newValue[0] > 10000000) {
      newValue[0] = 10000000;
      setValueInput(newValue);
    }

    if (newValue[1] < 0) {
      newValue[1] = 1000;
      setValueInput(newValue);
    } else if (newValue[1] > 10000000) {
      newValue[1] = 10000000;
      setValueInput(newValue);
    }
  };

  const handleApply = () => {
    if (onChangeRange) onChangeRange(valueInput);
  }

  const endAdornment = <InputAdornment position="end">đ</InputAdornment>

  return (
    <Filter>
      <TitleContainer>
        <FilterText><PriceChangeIcon />&nbsp;Khoảng giá</FilterText>
      </TitleContainer>

      <Box sx={{ width: '100%', maxWidth: 250 }}>
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
          onBlur={handleBlur}
        />
      </Box>
      <InputContainer>
        <StyledNumberInput
          onChange={handleInputChange}
          onBlur={handleBlur}
          value={valueInput[0]}
          size="small"
          slotProps={{
            htmlInput: {
              style: { fontSize: 14 },
              step: 1000,
              min: 1000,
              max: 10000000,
              type: 'number',
              'aria-labelledby': 'input-slider',
            },
            input: { endAdornment: endAdornment }
          }}
        />
        &nbsp;đến&nbsp;
        <StyledNumberInput
          onChange={handleInputChange2}
          onBlur={handleBlur}
          value={valueInput[1]}
          size="small"
          slotProps={{
            htmlInput: {
              style: { fontSize: 14 },
              step: 1000,
              min: 1000,
              max: 10000000,
              type: 'number',
              'aria-labelledby': 'input-slider',
            },
            input: { endAdornment: endAdornment }
          }}
        />
      </InputContainer>
      <Button
        variant="contained"
        color="primary"
        size="large"
        fullWidth
        sx={{ marginTop: 1 }}
        onClick={handleApply}
      >
        Áp dụng
      </Button>
    </Filter>
  )
}

const OtherFilters = ({ type, shop, setShop, onChangeType, onChangeShop }) => {

  //Change type
  const handleChangeType = (event) => {
    if (onChangeType) onChangeType(event.target.value)
  }

  //change shop
  const handleChangeShop = (event) => {
    event.preventDefault();
    if (onChangeShop) onChangeShop(shop);
  };

  return (
    <Filter>
      <TitleContainer>
        <FilterText><TuneIcon />&nbsp;KHÁC</FilterText>
      </TitleContainer>
      <TextField
        label="Hình thức bìa"
        select
        margin="dense"
        size="small"
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
      </TextField>
      <TextField
        margin="dense"
        id="shop"
        label="Tên người bán"
        size="small"
        fullWidth
        variant="outlined"
        value={shop}
        onBlur={handleChangeShop}
        onChange={(e) => setShop(e.target.value)}
      />
    </Filter>
  )
}

const FilterList = (props) => {
  //#region construct
  const { filters, onChangeCate, onChangeRange, onChangePub, onChangeType, onChangeShop,
    loadCates, doneCates, errorCates, cates, currCate, loadPubs, donePubs, errorPubs, pubs, resetFilter
  } = props;

  //Initial data
  const [cateId, setCateId] = useState(filters?.cateId != "" ? filters?.cateId : currCate?.id);
  const [valueInput, setValueInput] = useState(filters?.value);
  const [type, setType] = useState(filters?.type);
  const [shop, setShop] = useState(filters?.shop);
  const [selectedPub, setSelectedPub] = useState(filters?.pubId);

  //Update value
  useEffect(() => {
    setCateId(filters?.cateId != "" ? filters?.cateId : currCate?.id);
  }, [filters?.cateId, currCate]);

  useEffect(() => {
    setType(filters?.type);
  }, [filters?.type]);

  useEffect(() => {
    setShop(filters?.shop);
  }, [filters?.shop]);

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
        useFlexGap
        flexWrap="wrap"
        divider={<Divider flexItem />}
      >
        <RangeFilter {...{ valueInput, setValueInput, onChangeRange }} />
        <CateFilter {...{ loadCates, doneCates, errorCates, cates, cateId, onChangeCate }} />
        <PublisherFilter {...{ loadPubs, donePubs, errorPubs, pubs, selectedPub, setSelectedPub, onChangePub }} />
        <OtherFilters {...{ type, shop, setShop, onChangeType, onChangeShop }} />
      </Stack>
      <Button
        variant="contained"
        color="error"
        size="large"
        fullWidth
        sx={{ marginTop: 1 }}
        onClick={resetFilter}
        startIcon={<FilterAltOff />}
      >
        Xoá bộ lọc
      </Button>
    </>
  )
}

export default FilterList;