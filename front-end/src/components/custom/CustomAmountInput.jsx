import { Add, Remove } from '@mui/icons-material';
import { IconButton, InputAdornment } from '@mui/material';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';

const CustomInput = styled(TextField)(({ theme }) => `
    display: flex;
    width: 105px;

    input[type=number]::-webkit-outer-spin-button,
    input[type=number]::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    };
    -moz-appearance: textfield;

    ${theme.breakpoints.down("sm")} {
        width: 90px;
    }
`)

const StyledButton = styled(IconButton)(
    ({ theme }) => ({
        padding: '0 5px',

        [theme.breakpoints.down("sm")]: {
            padding: '0 2px',
        },
    })
)

export default function CustomAmountInput(props) {
    const { handleDecrease, handleIncrease, disabled, min, max, ...otherProps } = props;

    const startAdornment =
        <InputAdornment position="start">
            <StyledButton
                aria-label="decrease amount"
                onClick={handleDecrease}
                edge="start"
                disabled={disabled}
                disableRipple
            >
                <Remove fontSize="small" />
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
                <Add fontSize="small" />
            </StyledButton>
        </InputAdornment>

    return (
        <CustomInput
            {...otherProps}
            disabled={disabled}
            type="number"
            slotProps={{
                htmlInput: {
                    min: min ?? 1,
                    max: max ?? 199,
                    type: "number",
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