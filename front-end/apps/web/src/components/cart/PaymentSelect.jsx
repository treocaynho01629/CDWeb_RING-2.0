import styled from "@emotion/styled";
import { FormControlLabel, Radio, RadioGroup } from "@mui/material";
import { getPaymentContent, paymentItems } from "@ring/shared";

//#region styled
const StyledForm = styled(FormControlLabel)`
  padding: ${(props) => props.theme.spacing(1)} 0;
  min-width: 50%;

  .MuiFormControlLabel-label {
    position: relative;
    width: 100%;
  }
`;

const FormContent = styled.div`
  width: 100%;
`;

const ItemTitle = styled.div`
  display: flex;
  align-items: center;

  svg {
    font-size: 24px;
    margin-right: ${(props) => props.theme.spacing(0.5)};
  }
`;

const Description = styled.span`
  font-size: 12px;
  color: ${(props) => props.theme.palette.text.secondary};
`;

const RadioContainer = styled.div`
  ${(props) => props.theme.breakpoints.down("sm")} {
    padding: 0 ${(props) => props.theme.spacing(1)};
  }
`;

const PaymentContainer = styled.div`
  padding: ${(props) => props.theme.spacing(2)};
  margin-top: ${(props) => props.theme.spacing(1)};
  border: 0.5px solid ${(props) => props.theme.palette.divider};
  background-color: ${(props) => props.theme.palette.background.paper};

  ${(props) => props.theme.breakpoints.down("sm")} {
    padding: ${(props) => props.theme.spacing(1)};
  }
`;
//#endregion

const PaymentSelect = ({ value, handleChange }) => {
  return (
    <>
      <RadioContainer>
        <RadioGroup spacing={1} row value={value} onChange={handleChange}>
          {paymentItems.map((item, index) => (
            <StyledForm
              key={index}
              sx={{ width: "100%" }}
              value={item.value}
              control={<Radio />}
              label={
                <FormContent>
                  <ItemTitle>
                    {item.icon}
                    {item.label}
                  </ItemTitle>
                  <Description>{item.description}</Description>
                </FormContent>
              }
            />
          ))}
        </RadioGroup>
      </RadioContainer>
      <PaymentContainer>{getPaymentContent(value)}</PaymentContainer>
    </>
  );
};

export default PaymentSelect;
