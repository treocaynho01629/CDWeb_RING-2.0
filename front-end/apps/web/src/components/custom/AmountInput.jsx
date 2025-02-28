import { Add, Remove } from "@mui/icons-material";
import styled from "@emotion/styled";
import InputBase from "@mui/material/InputBase";

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 0.5px solid ${({ theme }) => theme.palette.divider};
  height: 30px;

  ${({ theme }) => theme.breakpoints.down("sm")} {
    height: 25px;
  }
`;

const CustomInput = styled(InputBase)`
  width: 28px;
  font-size: 13px;

  input[type="number"]::-webkit-outer-spin-button,
  input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
    opacity: 1;
  }

  input[type="number"] {
    -moz-appearance: textfield;
  }
`;

const StyledButton = styled.span`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 5px;
  color: ${({ theme, disabled }) =>
    disabled ? theme.palette.text.disabled : theme.palette.text.secondary};
  pointer-events: ${({ disabled }) => (disabled ? "none" : "all")};

  &:hover {
    color: ${({ theme }) => theme.palette.text.primary};
  }

  ${({ theme }) => theme.breakpoints.down("sm")} {
    padding: 0 2px;
  }
`;

const MIN_VALUE = 1;
const MAX_VALUE = 199;

export default function AmountInput(props) {
  const { handleDecrease, handleIncrease, disabled, min, max, ...otherProps } =
    props;

  return (
    <InputContainer>
      <StyledButton
        aria-label="decrease amount"
        onClick={handleDecrease}
        disabled={disabled}
      >
        <Remove fontSize="small" />
      </StyledButton>
      <CustomInput
        {...otherProps}
        disabled={disabled}
        type="number"
        sx={{ textAlign: "center" }}
        slotProps={{
          input: {
            min: min ?? MIN_VALUE,
            max: max ?? MAX_VALUE,
            type: "number",
            style: { fontSize: 13, textAlign: "center", padding: 0 },
          },
          htmlInput: {
            min: min ?? MIN_VALUE1,
            max: max ?? MAX_VALUE,
            type: "number",
          },
        }}
        inputProps={{ "aria-label": "amount input" }}
      />
      <StyledButton
        aria-label="increase amount"
        onClick={handleIncrease}
        $disabled={disabled}
      >
        <Add fontSize="small" />
      </StyledButton>
    </InputContainer>
  );
}
