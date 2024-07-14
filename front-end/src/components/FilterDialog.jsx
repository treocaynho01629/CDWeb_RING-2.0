import styled from 'styled-components'
import { useState, useEffect, useMemo } from "react"
import { Box, Divider, MenuItem, Skeleton, Chip, Stack, DialogContent, Dialog, DialogActions, DialogTitle, useMediaQuery, useTheme } from '@mui/material';
import { PriceChange as PriceChangeIcon, Category as CategoryIcon, Class as ClassIcon, Tune as TuneIcon, Check, FilterAltOff } from '@mui/icons-material';
import { marks, bookTypes } from "../ultils/filters";
import CustomButton from "./custom/CustomButton";
import CustomInput from "./custom/CustomInput";
import CustomSlider from "./custom/CustomSlider";

//#region styled
const TitleContainer = styled.div`
    width: 100%;
    max-width: 250px;
`

const Filter = styled.div`
    padding: 20px 0px;
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

const CateFilter = ({ loadCates, cates, cateId, setCateId }) => {

  //Change cate
  const handleCateChange = (id) => {
    setCateId(id);
  }

  return (
    <Filter>
      <TitleContainer>
        <FilterText><CategoryIcon />&nbsp;Danh mục</FilterText>
      </TitleContainer>

      <Stack spacing={{ xs: .5 }} direction="row" useFlexGap flexWrap="wrap">
        {(loadCates || !cates?.length ? Array.from(new Array(5)) : cates).map((cate, index) => (
          cate
            ?
            <Chip
              key={`${cate?.id}-${index}`}
              variant={cateId == cate?.id ? 'filled' : 'outlined'}
              color={cateId == cate?.id ? 'secondary' : 'primary'}
              onClick={() => handleCateChange(cate?.id)}
              label={cate?.categoryName}
            />
            :
            <Skeleton
              key={`${cate?.id}-${index}`}
              variant="rectangular"
              animation="wave"
              sx={{ borderRadius: '1em' }}
              height={32}
              width={106}
            />
        ))}
      </Stack>
    </Filter>
  )
}

const PublisherFilter = ({ loadPubs, pubs, selectedPub, setSelectedPub }) => {
  //Change pub
  const handleChangePub = (pubId) => {
    const selectedIndex = selectedPub.indexOf(pubId);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedPub, pubId);
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
  }

  const isSelected = (id) => selectedPub.indexOf(id) !== -1;

  return (
    <Filter>
      <TitleContainer>
        <FilterText><ClassIcon />&nbsp;Nhà xuất bản</FilterText>
      </TitleContainer>
      <Stack spacing={{ xs: .5 }} direction="row" useFlexGap flexWrap="wrap">
        {(loadPubs || !pubs?.length ? Array.from(new Array(10)) : pubs).map((pub, index) => {
          const isItemSelected = isSelected(pub?.id);

          if (pub) {
            return (
              <Chip
                key={`${pub?.id}-${index}`}
                variant={isItemSelected ? 'filled' : 'outlined'}
                color={isItemSelected ? 'secondary' : 'primary'}
                onClick={() => handleChangePub(pub?.id)}
                label={pub?.pubName}
              />
            )
          } else {
            return (
              <Skeleton
                key={`${pub?.id}-${index}`}
                variant="rectangular"
                animation="wave"
                sx={{ borderRadius: '1em' }}
                height={32}
                width={106}
              />
            )
          }
        })}
      </Stack>
    </Filter>
  )
}

const RangeFilter = ({ valueInput, setValueInput }) => {
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

  // Change range
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
      onRangeChange(newValue);
    } else if (newValue[1] > 10000000) {
      newValue[1] = 10000000;
      setValueInput(newValue);
    }
  };

  return (
    <Filter>
      <TitleContainer>
        <FilterText><PriceChangeIcon />&nbsp;Khoảng giá</FilterText>
      </TitleContainer>
      <Box>
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

const OtherFilters = ({ type, setType, seller, setSeller }) => {
  //Change type
  const handleChangeType = (event) => {
    setType(event.target.value)
  }

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
        onChange={(e) => setSeller(e.target.value)}
      />
    </Filter>
  )
}

const FilterDialog = (props) => {
  //#region construct
  const { filters, setFilters, onChangeCate, onChangeRange, onChangePub, onChangeType, onChangeSeller, open, handleClose, resetFilter
    , loadCates, cates, loadPubs, pubs
  } = props;

  //Initial value
  const [cateId, setCateId] = useState(filters?.cateId);
  const [valueInput, setValueInput] = useState(filters?.value);
  const [type, setType] = useState(filters?.type);
  const [seller, setSeller] = useState(filters?.seller);
  const [selectedPub, setSelectedPub] = useState(filters?.pubId);

  //Fullscreen detection
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

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

  //Apply altered filter on click
  const applyFilter = () => {
    //Close dialog
    handleClose();

    //Apply change
    if (onChangePub) onChangePub(selectedPub);
    if (onChangeRange) onChangeRange(valueInput);
    if (onChangeCate) onChangeCate(cateId);
    if (onChangeType) onChangeType(type);
    if (onChangeSeller) onChangeSeller(seller);

    //Change filters
    setFilters({
      ...filters,
      cateId: cateId ?? '',
      pubId: selectedPub,
      value: valueInput,
      type: type,
      seller: seller
    })
  }
  //#endregion

  return (
    <Dialog open={open} onClose={handleClose} scroll={'paper'} fullScreen={fullScreen}>
      <DialogTitle>BỘ LỌC</DialogTitle>
      <DialogContent dividers={true}>
        <Stack
          spacing={{ xs: 1 }}
          direction={{ xs: 'column', md: 'row' }}
          useFlexGap
          flexWrap="wrap"
          divider={<Divider flexItem />}
        >
          <CateFilter {...{ loadCates, cates, cateId, setCateId }} />
          <PublisherFilter {...{ loadPubs, pubs, selectedPub, setSelectedPub }} />
          <RangeFilter {...{ valueInput, setValueInput }} />
          <OtherFilters {...{ type, setType, seller, setSeller }} />
        </Stack>
      </DialogContent>
      <DialogActions>
        <CustomButton
          variant="outlined"
          color="error"
          size="large"
          sx={{ marginY: '10px' }}
          onClick={resetFilter}
        >
          <FilterAltOff />Xoá bộ lọc
        </CustomButton>
        <CustomButton
          variant="contained"
          color="secondary"
          size="large"
          sx={{ marginY: '10px' }}
          onClick={applyFilter}>
          <Check />Áp dụng
        </CustomButton>
      </DialogActions>
    </Dialog>
  )
}

export default FilterDialog;