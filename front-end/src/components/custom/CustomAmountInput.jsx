import { Add, Remove } from '@mui/icons-material';
import InputBase from '@mui/material/InputBase';
import styled from 'styled-components'

const InputContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    border: .5px solid ${props => props.theme.palette.divider};
    height: 30px;

    ${props => props.theme.breakpoints.down("sm")} {
        height: 25px;
    }
`

const CustomInput = styled(InputBase)`
    width: 28px;
    font-size: 13px;

    input[type=number]::-webkit-outer-spin-button,
    input[type=number]::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
        opacity: 1;
    };
`

const StyledButton = styled.span`
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 5px;
    color: ${props => props.theme.palette.text.secondary};

    &:hover {
        color: ${props => props.theme.palette.text.primary};
    }

    ${props => props.theme.breakpoints.down("sm")} {
        padding: 0 2px;
    }
`

export default function CustomAmountInput(props) {
    const { handleDecrease, handleIncrease, disabled, min, max, ...otherProps } = props;

    return (
        <InputContainer>
            <StyledButton
                aria-label="decrease amount"
                onClick={handleDecrease}
            >
                <Remove fontSize="small" />
            </StyledButton>
            <CustomInput
                {...otherProps}
                disabled={disabled}
                type="number"
                sx={{ textAlign: 'center' }}
                slotProps={{
                    input: {
                        min: min ?? 1,
                        max: max ?? 199,
                        type: "number",
                        style: { fontSize: 13, textAlign: 'center', padding: 0 },
                    },
                    htmlInput: {
                        min: min ?? 1,
                        max: max ?? 199,
                        type: "number",
                    },
                }}
                inputProps={{ 'aria-label': 'amount input' }}
            />
            <StyledButton
                aria-label="increase amount"
                onClick={handleIncrease}
            >
                <Add fontSize="small" />
            </StyledButton>
        </InputContainer>
    )
}