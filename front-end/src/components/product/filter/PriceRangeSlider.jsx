import PropTypes from 'prop-types';
import { Button, TextField, Box } from '@mui/material';
import { forwardRef, useEffect, useMemo, useState } from 'react'
import { NumericFormat } from 'react-number-format';
import { marks } from "../../../ultils/filters";
import CustomSlider from '../../custom/CustomSlider';

const NumericFormatCustom = forwardRef(
    function NumericFormatCustom(props, ref) {
        const { onChange, ...other } = props;

        return (
            <NumericFormat
                {...other}
                getInputRef={ref}
                onValueChange={(values) => {
                    onChange({
                        target: { value: values.value },
                    });
                }}
                isAllowed={(values) => {
                    const { floatValue } = values;
                    return floatValue >= 0 && floatValue <= 10000000;
                }}
                thousandSeparator
                valueIsNumericString
                suffix="đ"
            />
        );
    },
);

NumericFormatCustom.propTypes = { onChange: PropTypes.func.isRequired };

//Scale calculate function
function calculateValue(value) {
    const result = Math.round(((2 ** value) * 1000) / 1000) * 1000;

    //Threshold
    if (result <= 1000) return 0;
    if (result > 10000000) return 10000000;

    return result;
}

function reverseCalculateValue(value) {
    const result = Math.log(value / 1000) / Math.log(2);

    //Threshold
    if (result < 0) return 0;
    if (result > 13) return 13.3;

    return result;
}

function valuetext(value) {
    let scaledValue = value;
    if (scaledValue >= 10000000) {
        scaledValue = 10000000;
    }
    return `${scaledValue.toLocaleString()}đ`;
}

const PriceRangeSlider = ({ value, onChange }) => {
    //Range value
    const firstValue = useMemo(() => reverseCalculateValue(value[0]), [value[0]]);
    const secondValue = useMemo(() => reverseCalculateValue(value[1]), [value[1]]);
    const [rangeValue, setRangeValue] = useState(firstValue, secondValue);

    //Reset slider value on load
    useEffect(() => {
        handleBlur();
    }, []);

    useEffect(() => {
        setRangeValue([reverseCalculateValue(value[0]), reverseCalculateValue(value[1])]);
    }, [value]);

    //Change range functions
    const handleChangeRange = (e, newValue) => { setRangeValue(newValue); };

    const handleCommitedRange = (e, newValue) => {
        //New value
        const firstInput = calculateValue(newValue[0]);
        const secondInput = calculateValue(newValue[1]);
        const newInputValue = [firstInput, secondInput];
        onChange(newInputValue);
    };

    const handleInputChange = (e) => {
        //Input
        let newValue = [...value];
        let calculatedInputValue = e.target.value === '' ? '' : Number(e.target.value);

        //Threshold
        if (calculatedInputValue < 0) calculatedInputValue = 0;
        if (calculatedInputValue > 10000000) calculatedInputValue = 10000000;
        newValue[0] = calculatedInputValue;

        //Range
        let newRangeValue = [...rangeValue]
        const calculatedValue = reverseCalculateValue(newValue[0]);
        newRangeValue[0] = calculatedValue;

        //Set
        onChange(newValue);
        setRangeValue(newRangeValue);
    };

    const handleInputChange2 = (e) => {
        //Input
        let newValue = [...value];
        let calculatedInputValue = e.target.value === '' ? '' : Number(e.target.value);

        //Threshold
        if (calculatedInputValue < 0) calculatedInputValue = 0;
        if (calculatedInputValue > 10000000) calculatedInputValue = 10000000;
        newValue[1] = calculatedInputValue;

        //Range
        let newRangeValue = [...rangeValue]
        newRangeValue[1] = reverseCalculateValue(newValue[1]);

        //Set
        onChange(newValue);
        setRangeValue(newRangeValue);
    };

    const handleBlur = () => {
        let newValue = [...value];
        if (newValue[0] < 0) {
            newValue[0] = 0;
            onChange(newValue);
        } else if (newValue[0] > 10000000) {
            newValue[0] = 10000000;
            onChange(newValue);
        }

        if (newValue[1] < 0) {
            newValue[1] = 0;
            onChange(newValue);
        } else if (newValue[1] > 10000000) {
            newValue[1] = 10000000;
            onChange(newValue);
        }
    };

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" flexDirection={{ xs: 'column', md_lg: 'row' }}>
                <TextField
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    value={value[0]}
                    size="small"
                    slotProps={{
                        input: { sx: { fontSize: 14, 'input': { textAlign: 'center' } }, inputComponent: NumericFormatCustom }
                    }}
                />
                &nbsp;&minus;&nbsp;
                <TextField
                    onChange={handleInputChange2}
                    onBlur={handleBlur}
                    value={value[1]}
                    size="small"
                    slotProps={{
                        input: { sx: { fontSize: 14, 'input': { textAlign: 'center' } }, inputComponent: NumericFormatCustom }
                    }}
                />
            </Box>
            <Box sx={{ width: '100%' }}>
                <CustomSlider
                    getAriaLabel={() => 'Bộ lọc giá'}
                    value={rangeValue}
                    min={0}
                    step={0.1}
                    max={13.3}
                    scale={calculateValue}
                    marks={marks}
                    valueLabelDisplay="auto"
                    getAriaValueText={valuetext}
                    valueLabelFormat={valuetext}
                    onChange={handleChangeRange}
                    onChangeCommitted={handleCommitedRange}
                />
            </Box>
            <Button
                variant="outlined"
                color="warning"
                size="large"
                fullWidth
                sx={{ marginTop: 1 }}
                onClick={() => onChange([0, 10000000])}
            >
                Đặt lại
            </Button>
        </Box>
    )
}

export default PriceRangeSlider