import { Add, Remove } from '@mui/icons-material';
import { IconButton, InputAdornment } from '@mui/material';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';

const CustomInput = styled(TextField)`
    display: flex;
    width: 105px;

    input[type=number]::-webkit-outer-spin-button,
    input[type=number]::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    };
    -moz-appearance: textfield;
`

const StyledButton = styled(IconButton)`
    padding: 0;
    padding-left: 5px;
    padding-right: 5px;
`

export default function CustomAmountInput(props) {
    const { handleDecrease, handleIncrease, disabled, ...otherProps } = props;

    const startAdornment =
        <InputAdornment position="start">
            <StyledButton
                aria-label="decrease amount"
                onClick={handleDecrease}
                edge="start"
                disabled={disabled}
                disableRipple
            >
                <Remove fontSize="small"/>
            </StyledButton>
        </InputAdornment>

    const endAdornment =
        <InputAdornment position="end">
            <StyledButton
                aria-label="increase amount"
                onClick={handleIncrease}
                edge="end"
                disabled={disabled}
                disableRipple
            >
                <Add fontSize="small"/>
            </StyledButton>
        </InputAdornment>

    return (
        <CustomInput
            {...otherProps}
            disabled={disabled}
            type="number"
            slotProps={{
                htmlInput: {
                    style: { fontSize: 13, textAlign: 'center', padding: '5px 0' },
                },
                input: {
                    startAdornment: startAdornment,
                    endAdornment: endAdornment
                }
            }}
        />
    )
}